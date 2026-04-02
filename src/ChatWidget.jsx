import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase.js";
import { months } from "./hochbeet-data.js";

const C = {
  green: "#49a078",
  red: "#e36d52",
  greenBg: "rgba(73,160,120,0.12)",
  redBg: "rgba(227,109,82,0.12)",
};
const font = "'DM Sans', sans-serif";

const CATEGORY_LABELS = {
  vorziehen: "Vorziehen",
  aussaeen: "Aussäen",
  einpflanzen: "Einpflanzen",
  ernten: "Ernten",
};

function ProposalCard({ proposal, onConfirm, onReject }) {
  const [status, setStatus] = useState(null); // null | "saving" | "saved" | "rejected"

  async function handleConfirm() {
    setStatus("saving");
    await onConfirm(proposal.changes);
    setStatus("saved");
  }

  function handleReject() {
    setStatus("rejected");
    onReject();
  }

  return (
    <div
      style={{
        fontFamily: font,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "12px",
        margin: "8px 0",
      }}
    >
      <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
        {proposal.summary}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
        {proposal.changes.map((change, i) => (
          <div
            key={i}
            style={{
              background: change.type === "addition" ? C.greenBg : C.redBg,
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: change.type === "addition" ? C.green : C.red, fontWeight: 600 }}>
              {change.type === "addition" ? "+" : "−"}
            </span>
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>{change.name}</span>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>
              {months[change.month_index]} · {CATEGORY_LABELS[change.category] || change.category}
              {change.wo ? ` · ${change.wo}` : ""}
            </span>
          </div>
        ))}
      </div>

      {status === null && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleReject}
            style={{
              flex: 1,
              padding: "7px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              color: "#6b7280",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: font,
            }}
          >
            Nein, ändern
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: "7px",
              borderRadius: "8px",
              border: "none",
              background: C.green,
              color: "white",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: font,
              fontWeight: 500,
            }}
          >
            Ja, speichern
          </button>
        </div>
      )}

      {status === "saving" && (
        <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Speichern…</div>
      )}
      {status === "saved" && (
        <div style={{ textAlign: "center", color: C.green, fontSize: "13px", fontWeight: 500 }}>
          Gespeichert ✓
        </div>
      )}
      {status === "rejected" && (
        <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Abgebrochen</div>
      )}
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "8px",
      }}
    >
      {msg.proposal ? (
        msg.proposalElement
      ) : (
        <div
          style={{
            maxWidth: "85%",
            padding: "8px 12px",
            borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: isUser ? C.green : "#f3f4f6",
            color: isUser ? "white" : "#374151",
            fontSize: "14px",
            fontFamily: font,
            lineHeight: "1.45",
          }}
        >
          {msg.content}
        </div>
      )}
    </div>
  );
}

export default function ChatWidget({ onConfirm, existingItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hallo! Ich kann dir helfen, Pflanzen zum Kalender hinzuzufügen oder zu entfernen. Was möchtest du ändern?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingProposal, setPendingProposal] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function handleSend() {
    const text = inputText.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      // Build message list for the API (exclude proposal UI messages)
      const apiMessages = newMessages
        .filter(m => !m.proposal)
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("garden-chat", {
        body: { messages: apiMessages, existingItems },
      });

      if (error) throw error;

      if (data.type === "proposal") {
        setPendingProposal(data);
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.summary,
            proposal: true,
            proposalData: data,
            proposalElement: null, // will be rendered inline
          },
        ]);
        // Replace the last message with one that renders a ProposalCard
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            proposalElement: (
              <ProposalCard
                proposal={data}
                onConfirm={async (changes) => {
                  await onConfirm(changes);
                  setMessages(m => [
                    ...m,
                    { role: "assistant", content: "Gespeichert! Die Änderungen erscheinen jetzt im Kalender. 🌱" },
                  ]);
                  setPendingProposal(null);
                }}
                onReject={() => {
                  setMessages(m => [
                    ...m,
                    { role: "assistant", content: "Kein Problem! Was soll ich stattdessen tun?" },
                  ]);
                  setPendingProposal(null);
                }}
              />
            ),
          };
          return updated;
        });
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es nochmal." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: C.green,
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(73,160,120,0.4)",
          zIndex: 1000,
          transition: "transform 0.15s ease",
          fontFamily: font,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        title="Gartenchat öffnen"
      >
        {isOpen ? "✕" : "🌿"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            width: "min(360px, calc(100vw - 48px))",
            height: "480px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
            fontFamily: font,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: C.green,
              color: "white",
              padding: "12px 16px",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            🌱 Gartenassistent
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 12px 0",
            }}
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} />
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "8px" }}>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "#f3f4f6",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  …
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #f3f4f6",
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pflanze hinzufügen oder entfernen…"
              disabled={loading}
              rows={1}
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "14px",
                fontFamily: font,
                resize: "none",
                outline: "none",
                lineHeight: "1.4",
                maxHeight: "80px",
                overflowY: "auto",
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "none",
                background: loading || !inputText.trim() ? "#e5e7eb" : C.green,
                color: "white",
                fontSize: "16px",
                cursor: loading || !inputText.trim() ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
