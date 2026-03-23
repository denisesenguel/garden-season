import { useState } from "react";
import { months, calendar, tagColors } from "./hochbeet-data.js";

function Badge({ label }) {
  const cls = tagColors[label] || "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {label}
    </span>
  );
}

function Section({ title, color, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3">
      <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${color}`}>{title}</div>
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
  const data = calendar[selected];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0e8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2d5a27 0%, #4a7c3f 50%, #6b9e5e 100%)" }} className="px-4 pt-8 pb-6 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Dein persönlicher</div>
          <h1 style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }} className="text-3xl font-bold mb-1">🌱 Hochbeet-Kalender</h1>
          <p className="text-sm opacity-80 mb-4">Überdacht 1,20 × 2,50 m &nbsp;|&nbsp; Offen 2,50 × 1,00 m</p>

          {/* Beet visual */}
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-2">
              <span>🏠</span>
              <div>
                <div className="font-semibold">Überdacht</div>
                <div className="opacity-75">1,20 × 2,50 m = 3 m²</div>
                <div className="opacity-75">Tomaten, Paprika, Gurken</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-2">
              <span>☀️</span>
              <div>
                <div className="font-semibold">Offen</div>
                <div className="opacity-75">2,50 × 1,00 m = 2,5 m²</div>
                <div className="opacity-75">Salate, Kohlrabi, Möhren…</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Month tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex flex-wrap gap-1.5 mb-5">
          {months.map((m, i) => {
            const isActive = i === selected;
            const isCurrent = i === currentMonth;
            return (
              <button
                key={m}
                onClick={() => setSelected(i)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-green-700 text-white shadow-md scale-105"
                    : isCurrent
                    ? "bg-green-100 text-green-800 border-2 border-green-400"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700"
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
          <div style={{ background: "linear-gradient(135deg, #4a7c3f, #7ab367)" }} className="px-5 py-4 text-white flex items-center justify-between">
            <div>
              <div className="text-sm opacity-75">Monat</div>
              <div style={{ fontFamily: "'Georgia', serif" }} className="text-2xl font-bold">
                {data.icon} {data.month}
              </div>
            </div>
            {data.beet && (
              <div className="text-right text-xs opacity-90 max-w-[160px] leading-relaxed">
                <div className="font-semibold mb-0.5">📋 Beet-Status</div>
                {data.beet}
              </div>
            )}
          </div>

          {/* Tipp */}
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 text-sm text-amber-900">
            💡 <span className="font-semibold">Tipp:</span> {data.tipp}
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <Section
              title="🌡️ Vorziehen (drinnen)"
              color="text-orange-600"
              items={data.vorziehen}
              renderItem={(item, i) => (
                <div key={i} className="flex items-start gap-2 bg-orange-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-800">{item.name}</span>
                      <Badge label={item.wo} />
                    </div>
                    {item.tipp && <div className="text-xs text-gray-500 mt-0.5">{item.tipp}</div>}
                  </div>
                </div>
              )}
            />

            <Section
              title="🌿 Einpflanzen / Aussäen"
              color="text-green-700"
              items={data.pflanzen}
              renderItem={(item, i) => (
                <div key={i} className="flex items-start gap-2 bg-green-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-800">{item.name}</span>
                      <Badge label={item.wo} />
                    </div>
                    {item.tipp && <div className="text-xs text-gray-500 mt-0.5">{item.tipp}</div>}
                  </div>
                </div>
              )}
            />

            <Section
              title="🧺 Ernten"
              color="text-red-600"
              items={data.ernten}
              renderItem={(item, i) => (
                <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-800">{item.name}</span>
                    {item.tipp && <div className="text-xs text-gray-500 mt-0.5">{item.tipp}</div>}
                  </div>
                </div>
              )}
            />

            {data.vorziehen.length === 0 && data.pflanzen.length === 0 && data.ernten.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                🛋️ Ruhemonat – Zeit für Planung & Bestellung!
              </div>
            )}
          </div>
        </div>

        {/* Legende */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 mb-8">
          <h2 style={{ fontFamily: "'Georgia', serif" }} className="text-base font-bold text-green-800 mb-3">🗺️ Legende</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(tagColors).map(([label, cls]) => (
              <span key={label} className={`px-2.5 py-1 rounded-full font-medium ${cls}`}>{label}</span>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <div>🌡️ <strong>Vorziehen</strong> = drinnen auf der Fensterbank oder im Zimmergewächshaus</div>
            <div>🌿 <strong>Einpflanzen</strong> = direkt ins Hochbeet oder Garten</div>
            <div>🧺 <strong>Ernten</strong> = typischer Erntezeitraum (je nach Wetter variabel)</div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          Hinweis: Zeiten gelten für Mitteleuropa (Zone 6–7). Bei deiner Region ggf. 1–2 Wochen anpassen.
        </div>
      </div>
    </div>
  );
}
