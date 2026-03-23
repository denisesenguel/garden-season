import { useState } from "react";
import { months, calendar, sublocations } from "./hochbeet-data.js";

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
  const [selectedLocs, setSelectedLocs] = useState(sublocations);
  const [checked, setChecked] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("garden-checked") || "[]"));
    } catch {
      return new Set();
    }
  });
  const data = calendar[selected];

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
      localStorage.setItem("garden-checked", JSON.stringify([...next]));
      return next;
    });
  }

  // Stable key: month index + category + item name/text + location
  const mk = (cat, item) =>
    `${selected}:${cat}:${item.name || item.text}:${item.wo || ""}`;

  const filterByLoc = (items) => items.filter(item => !item.wo || selectedLocs.includes(item.wo));

  const filtered = {
    vorziehen: filterByLoc(data.vorziehen),
    aussaeen: filterByLoc(data.aussaeen),
    einpflanzen: filterByLoc(data.einpflanzen),
    ernten: filterByLoc(data.ernten),
  };

  function PlantRow({ item, cat, bg }) {
    const key = mk(cat, item);
    const done = checked.has(key);
    return (
      <div className={`flex items-center gap-2.5 ${bg} rounded-lg px-3 py-2 ${done ? "opacity-50" : ""}`}>
        <div className="flex-1 min-w-0">
          <span className={`font-semibold text-sm text-gray-800 ${done ? "line-through" : ""}`}>{item.name}</span>
          {item.tipp && <div className="text-xs text-gray-500 mt-0.5">{item.tipp}</div>}
        </div>
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggleChecked(key)}
          className="shrink-0 accent-green-600 cursor-pointer"
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0e8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2d5a27 0%, #4a7c3f 50%, #6b9e5e 100%)" }} className="px-4 pt-8 pb-6 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }} className="text-3xl font-bold mb-4">🌿 Gartenkalender 2026</h1>

          <div className="flex flex-wrap gap-2">
            {sublocations.map(loc => {
              const isActive = selectedLocs.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => toggleLoc(loc)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white text-green-800 shadow-sm scale-105"
                      : "bg-white/15 text-white/75 border border-white/30 hover:bg-white/25"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Month tabs */}
      <div className="max-w-2xl mx-auto pt-4">
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
          <div style={{ background: "linear-gradient(135deg, #4a7c3f, #7ab367)" }} className="px-5 py-4 text-white">
            <div style={{ fontFamily: "'Georgia', serif" }} className="text-2xl font-bold">
              {data.icon} {data.month}
            </div>
          </div>

          {/* Aufgaben */}
          {filterByLoc(data.aufgaben).length > 0 && (
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Aufgaben</div>
              <ul className="space-y-1">
                {filterByLoc(data.aufgaben).map((item, i) => {
                  const key = mk("aufgaben", item);
                  const done = checked.has(key);
                  return (
                    <li key={i} className={`text-sm text-gray-700 flex items-center gap-2.5 ${done ? "opacity-50" : ""}`}>
                      <span className={`flex-1 ${done ? "line-through" : ""}`}>{item.text}</span>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleChecked(key)}
                        className="shrink-0 accent-green-600 cursor-pointer"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Tipp */}
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 text-sm text-amber-900">
            💡 <span className="font-semibold">Tipp:</span> {data.tipp}
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <Section
              title="🌡️ Vorziehen (drinnen)"
              color="text-orange-600"
              items={filtered.vorziehen}
              renderItem={(item, i) => (
                <PlantRow key={i} item={item} cat="vorziehen" bg="bg-orange-50" />
              )}
            />

            <Section
              title="🌱 Aussäen"
              color="text-lime-700"
              items={filtered.aussaeen}
              renderItem={(item, i) => (
                <PlantRow key={i} item={item} cat="aussaeen" bg="bg-lime-50" />
              )}
            />

            <Section
              title="🌿 Einpflanzen"
              color="text-green-700"
              items={filtered.einpflanzen}
              renderItem={(item, i) => (
                <PlantRow key={i} item={item} cat="einpflanzen" bg="bg-green-50" />
              )}
            />

            <Section
              title="🧺 Ernten"
              color="text-red-600"
              items={filtered.ernten}
              renderItem={(item, i) => (
                <PlantRow key={i} item={item} cat="ernten" bg="bg-red-50" />
              )}
            />

            {filterByLoc(data.aufgaben).length === 0 && filtered.vorziehen.length === 0 && filtered.aussaeen.length === 0 && filtered.einpflanzen.length === 0 && filtered.ernten.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                🛋️ Ruhemonat – Zeit für Planung & Bestellung!
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          Hinweis: Zeiten gelten für Mitteleuropa (Zone 6–7). Bei deiner Region ggf. 1–2 Wochen anpassen.
        </div>
      </div>
    </div>
  );
}
