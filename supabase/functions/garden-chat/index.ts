import Anthropic from "npm:@anthropic-ai/sdk@0.36.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const SYSTEM_PROMPT = `Du bist ein hilfreicher Gartenassistent für einen Gartenkalender in Deutschland (Klimazone 6–7).

Du hilfst Nutzern, Pflanzen zum Kalender hinzuzufügen oder zu entfernen. Der Kalender zeigt für jeden Monat (Januar=0 bis Dezember=11), welche Pflanzen vorgezogen, ausgesät, eingepflanzt oder geerntet werden können.

**Kategorien:**
- vorziehen: Indoor anziehen/vorziehen (z.B. Januar–März für Tomaten)
- aussaeen: Direktsaat ins Beet
- einpflanzen: Setzlinge ins Beet setzen
- ernten: Erntezeit

**Exakte Standorte (wo-Feld) – nur diese 5 verwenden, exakt so geschrieben:**
- Hochbeet überdacht
- Hochbeet
- Freiland Beet
- Kräuterspirale
- Topf

**Klimaregeln für Zone 6–7:**
- Eisheiligen: 11.–15. Mai – frostempfindliche Pflanzen erst danach raus (Tomaten, Paprika, Gurken, Basilikum)
- Tomaten, Paprika, Gurken: vorziehen ab März, einpflanzen Mai
- Salat, Radieschen: aussäen ab März (unter Dach) oder April
- Kräuter (Basilikum, Petersilie): vorziehen ab März, einpflanzen ab Mai (nach Eisheiligen)
- Wintergemüse (Feldsalat, Spinat): aussäen Juli–September

**Wichtig:**
- Frage nach dem Standort (wo), bevor du einen Vorschlag machst, wenn der Standort unklar ist.
- Verwende immer den exakt geschriebenen Standort aus der Liste oben.
- Antworte IMMER mit gültigem JSON. Kein Markdown, kein erklärender Text außerhalb von JSON.

**Format für Rückfragen:**
{"type":"question","message":"Deine Frage auf Deutsch"}

**Format für Vorschläge:**
{"type":"proposal","summary":"Kurze Zusammenfassung auf Deutsch","changes":[{"type":"addition","month_index":4,"category":"einpflanzen","name":"Basilikum","wo":"Topf","tipp":"Nach den Eisheiligen (ab 16. Mai) endgültig raus"}]}

**Regeln für changes:**
- type: "addition" oder "removal"
- month_index: 0–11 (Januar=0)
- category: genau einer von: vorziehen, aussaeen, einpflanzen, ernten
- name: Pflanzenname (exakt, wie er im Kalender stehen soll)
- wo: einer der 5 exakten Standorte oder null wenn nicht zutreffend (z.B. bei ernten manchmal egal)
- tipp: kurzer Hinweis (optional, kann null sein)

Antworte auf Deutsch. Sei freundlich und konkret.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, existingItems } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ type: "question", message: "Konfigurationsfehler: API-Schlüssel fehlt." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Build context about existing items
    let contextAddition = "";
    if (existingItems && existingItems.length > 0) {
      contextAddition = `\n\nBereits im Kalender vorhanden (zur Information):\n${existingItems.slice(0, 50).join("\n")}`;
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + contextAddition,
      messages: messages,
    });

    const rawText = response.content[0]?.type === "text" ? response.content[0].text : "";

    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback to question on parse error
      parsed = { type: "question", message: rawText || "Entschuldigung, ich habe dich nicht verstanden. Kannst du es nochmal versuchen?" };
    }

    // Validate and compute item_key server-side for all changes
    if (parsed.type === "proposal" && Array.isArray(parsed.changes)) {
      parsed.changes = parsed.changes.map(change => ({
        ...change,
        item_key: `${change.month_index}:${change.category}:${change.name}:${change.wo ?? ""}`,
      }));
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("garden-chat error:", err);
    return new Response(
      JSON.stringify({ type: "question", message: "Ein Fehler ist aufgetreten. Bitte versuche es nochmal." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
