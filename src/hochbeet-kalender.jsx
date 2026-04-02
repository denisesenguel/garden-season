import { useState, useEffect } from "react";
import { months, sublocations } from "./hochbeet-data.js";
import { supabase } from "./supabase.js";
import { useMergedCalendar } from "./useMergedCalendar.js";
import { itemKey } from "./itemKey.js";
import ChatWidget from "./ChatWidget.jsx";

const C = {
  green:  "#49a078",
  blue:   "#5b90e7",
  red:    "#e36d52",
  greenBg: "rgba(73,160,120,0.12)",
  blueBg:  "rgba(91,144,231,0.12)",
  redBg:   "rgba(227,109,82,0.12)",
};

const font = "'DM Sans', sans-serif";
const maxW = { maxWidth: "44.5rem" };

function Section({ title, titleColor, items, rowBg, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3">
      <div style={{ color: titleColor, fontFamily: font }} className="text-xs uppercase tracking-widest italic mb-2">{title}</div>
      <div className="space-y-1.5">
        {items.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  );
}

export default function App() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const [selected, setSelected] = useState(currentMonth);
  const [selectedLocs, setSelectedLocs] = useState(sublocations);
  const [checked, setChecked] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("garden-checked") || "[]"));
    } catch {
      return new Set();
    }
  });

  const { mergedCalendar, modifications, setModifications } = useMergedCalendar();

  useEffect(() => {
    supabase
      .from("garden_state")
      .select("checked")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const set = new Set(data.checked);
        setChecked(set);
        localStorage.setItem("garden-checked", JSON.stringify([...set]));
      });
  }, []);

  const data = mergedCalendar[selected];

  // Flat list of existing items for the chat widget context
  const existingItems = mergedCalendar.flatMap((month, mi) =>
    ["vorziehen", "aussaeen", "einpflanzen", "ernten"].flatMap(cat =>
      (month[cat] || []).map(item =>
        `${item.name} (${months[mi]}, ${cat}${item.wo ? ", " + item.wo : ""})`
      )
    )
  );

  async function handleConfirm(changes) {
    const rows = changes.map(change => ({
      type: change.type,
      month_index: change.month_index,
      category: change.category,
      name: change.name,
      wo: change.wo || null,
      tipp: change.tipp || null,
      item_key: change.item_key,
    }));

    const { data: inserted } = await supabase
      .from("plant_modifications")
      .insert(rows)
      .select();

    if (inserted) {
      // Optimistic update
      setModifications(prev => [...prev, ...inserted]);
    }
  }

  function toggleLoc(loc) {
    setSelectedLocs(prev => {
      if (prev.length === sublocations.length) return [loc];
      if (prev.includes(loc)) {
        const next = prev.filter(l => l !== loc);
        return next.length === 0 ? sublocations : next;
      }
      return [...prev, loc];
    });
  }

  function toggleChecked(key) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      const arr = [...next];
      localStorage.setItem("garden-checked", JSON.stringify(arr));
      supabase
        .from("garden_state")
        .update({ checked: arr })
        .eq("id", 1)
        .then(() => {});
      return next;
    });
  }

  const mk = (cat, item) =>
    itemKey(selected, cat, item.name || item.text, item.wo);

  const filterByLoc = (items) => items.filter(item => !item.wo || selectedLocs.includes(item.wo));

  const filtered = {
    vorziehen: filterByLoc(data.vorziehen),
    aussaeen: filterByLoc(data.aussaeen),
    einpflanzen: filterByLoc(data.einpflanzen),
    ernten: filterByLoc(data.ernten),
  };

  function PlantRow({ item, cat, rowBg }) {
    const key = mk(cat, item);
    const done = checked.has(key);
    return (
      <div style={{ background: rowBg, fontFamily: font }} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${done ? "opacity-50" : ""}`}>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium text-gray-800 ${done ? "line-through italic" : "italic"}`}>{item.name}</span>
          {item.tipp && <div className="text-xs text-gray-400 mt-0.5 not-italic">{item.tipp}</div>}
        </div>
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggleChecked(key)}
          style={{ accentColor: C.green }}
          className="shrink-0 cursor-pointer"
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: font, background: "#f4f7f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: C.green }} className="px-4 pt-8 pb-6 text-white">
        <div style={maxW} className="mx-auto">
          <h1 className="text-3xl font-light uppercase tracking-wide mb-4">Gartenkalender 2026</h1>
          <div className="flex flex-wrap gap-2">
            {sublocations.map(loc => {
              const isActive = selectedLocs.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => toggleLoc(loc)}
                  style={isActive
                    ? { background: "white", color: C.green }
                    : { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.35)" }
                  }
                  className="px-3 py-1.5 rounded-full text-sm uppercase tracking-wide transition-all duration-150"
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Month tabs */}
      <div style={maxW} className="mx-auto pt-4">
        <div className="flex flex-wrap gap-1.5 mb-5">
          {months.map((m, i) => {
            const isActive = i === selected;
            const isCurrent = i === currentMonth;
            return (
              <button
                key={m}
                onClick={() => setSelected(i)}
                style={
                  isActive
                    ? { background: C.green, color: "white" }
                    : isCurrent
                    ? { background: "white", color: C.green, border: `2px solid ${C.green}` }
                    : {}
                }
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wide transition-all duration-150 ${
                  isActive ? "shadow-md" : !isCurrent ? "bg-white text-gray-500 border border-gray-200 hover:border-gray-400" : ""
                }`}
              >
                {m.slice(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
          {/* Card Header */}
          <div style={{ background: C.green }} className="px-5 py-4 text-white">
            <div className="text-2xl font-light uppercase tracking-wide">{data.icon} {data.month}</div>
          </div>

          {/* Aufgaben */}
          {filterByLoc(data.aufgaben).length > 0 && (
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
              <div className="text-xs uppercase tracking-widest italic text-stone-400 mb-2">Aufgaben</div>
              <ul className="space-y-1">
                {filterByLoc(data.aufgaben).map((item, i) => {
                  const key = mk("aufgaben", item);
                  const done = checked.has(key);
                  return (
                    <li key={i} className={`text-sm text-gray-600 flex items-center gap-2.5 ${done ? "opacity-50" : ""}`}>
                      <span className={`flex-1 ${done ? "line-through" : ""}`}>{item.text}</span>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleChecked(key)}
                        style={{ accentColor: C.green }}
                        className="shrink-0 cursor-pointer"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Tipp */}
          <div style={{ background: C.blueBg, borderBottom: `1px solid rgba(91,144,231,0.2)` }} className="px-5 py-3 text-sm text-gray-600">
            <span style={{ color: C.blue }} className="uppercase tracking-wide text-xs italic">Tipp </span>{data.tipp}
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <Section
              title="🌡 Vorziehen (drinnen)"
              titleColor={C.red}
              items={filtered.vorziehen}
              renderItem={(item, i) => <PlantRow key={i} item={item} cat="vorziehen" rowBg={C.redBg} />}
            />
            <Section
              title="🌱 Aussäen"
              titleColor={C.blue}
              items={filtered.aussaeen}
              renderItem={(item, i) => <PlantRow key={i} item={item} cat="aussaeen" rowBg={C.blueBg} />}
            />
            <Section
              title="🌿 Einpflanzen"
              titleColor={C.green}
              items={filtered.einpflanzen}
              renderItem={(item, i) => <PlantRow key={i} item={item} cat="einpflanzen" rowBg={C.greenBg} />}
            />
            <Section
              title="🧺 Ernten"
              titleColor={C.red}
              items={filtered.ernten}
              renderItem={(item, i) => <PlantRow key={i} item={item} cat="ernten" rowBg={C.redBg} />}
            />

            {filterByLoc(data.aufgaben).length === 0 && filtered.vorziehen.length === 0 && filtered.aussaeen.length === 0 && filtered.einpflanzen.length === 0 && filtered.ernten.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm italic">
                Ruhemonat – Zeit für Planung & Bestellung
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs uppercase tracking-wide text-gray-400 pb-6">
          Zeiten gelten für Mitteleuropa (Zone 6–7)
        </div>
      </div>

      <ChatWidget onConfirm={handleConfirm} existingItems={existingItems} />
    </div>
  );
}
