import { useState, useEffect } from "react";
import { calendar } from "./hochbeet-data.js";
import { supabase } from "./supabase.js";
import { itemKey } from "./itemKey.js";

function buildMergedCalendar(modifications) {
  // Deep clone static calendar
  const merged = calendar.map(month => ({
    ...month,
    vorziehen: [...month.vorziehen],
    aussaeen: [...month.aussaeen],
    einpflanzen: [...month.einpflanzen],
    ernten: [...month.ernten],
    aufgaben: [...month.aufgaben],
  }));

  for (const mod of modifications) {
    const { type, month_index, category, name, wo, tipp } = mod;
    const monthData = merged[month_index];
    if (!monthData || !monthData[category]) continue;

    if (type === "addition") {
      // Avoid duplicates
      const key = itemKey(month_index, category, name, wo);
      const exists = monthData[category].some(
        item => itemKey(month_index, category, item.name, item.wo) === key
      );
      if (!exists) {
        monthData[category].push({ name, wo: wo || undefined, tipp: tipp || undefined });
      }
    } else if (type === "removal") {
      const key = itemKey(month_index, category, name, wo);
      monthData[category] = monthData[category].filter(
        item => itemKey(month_index, category, item.name, item.wo) !== key
      );
    }
  }

  return merged;
}

export function useMergedCalendar() {
  const [modifications, setModifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("plant_modifications")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setModifications(data);
        setLoading(false);
      });
  }, []);

  const mergedCalendar = buildMergedCalendar(modifications);

  return { mergedCalendar, modifications, setModifications, loading };
}
