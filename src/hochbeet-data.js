export const months = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

// Canonical sublocation names — used as `wo` values in calendar entries
export const sublocations = [
  "Hochbeet überdacht",
  "Hochbeet",
  "Freiland Beet",
  "Kräuterspirale",
  "Topf",
];

export const calendar = [
  {
    month: "Januar",
    icon: "❄️",
    vorziehen: [
      { name: "Paprika", wo: "Hochbeet überdacht", tipp: "Braucht Wärme (20–25°C) zum Keimen, lange Anzuchtzeit!" },
      { name: "Kohlrabi (1. Satz)", wo: "Hochbeet überdacht", tipp: "Frühe Sorte, z.B. 'Azur Star'" },
    ],
    pflanzen: [],
    ernten: [
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Falls im Herbst gesät" },
    ],
    tipp: "Saatgut bestellen & Anzuchterde besorgen! Paprika und Kohlrabi brauchen einen frühen Start.",
    beet: null,
  },
  {
    month: "Februar",
    icon: "🌱",
    vorziehen: [
      { name: "Paprika (nachholen)", wo: "Hochbeet überdacht", tipp: "Spätestens jetzt ansetzen" },
      { name: "Kohlrabi (2. Satz)", wo: "Hochbeet", tipp: "Für gestaffelte Ernte" },
      { name: "Salat (früh)", wo: "Hochbeet überdacht", tipp: "Kopfsalat oder Schnittsalat" },
    ],
    pflanzen: [],
    ernten: [
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Letzter Ernteansatz vom Herbst" },
    ],
    tipp: "Anzuchtstation einrichten: Zimmergewächshaus + Wärmeunterlage empfehlenswert.",
    beet: null,
  },
  {
    month: "März",
    icon: "🌿",
    vorziehen: [
      { name: "Tomaten", wo: "Hochbeet überdacht", tipp: "Ab Mitte März; mind. 8 Wochen vor Auspflanzen" },
      { name: "Gurken", wo: "Hochbeet überdacht", tipp: "Erst Ende März, wachsen schnell!" },
      { name: "Zucchini", wo: "Freiland Beet", tipp: "Ende März, wächst rasant" },
      { name: "Kürbis", wo: "Freiland Beet", tipp: "Ende März; für Freiland" },
      { name: "Salat", wo: "Hochbeet", tipp: "2. Satz für Hochbeet" },
      { name: "Kohlrabi (3. Satz)", wo: "Hochbeet", tipp: "Für späte Ernte" },
    ],
    pflanzen: [
      { name: "Radieschen", wo: "Hochbeet überdacht", tipp: "Direktsaat möglich, mag Kühle" },
      { name: "Salat (Jungpflanzen)", wo: "Hochbeet überdacht", tipp: "Vorgezogene Pflanzen aus Februar" },
    ],
    ernten: [],
    tipp: "Hochbeet überdacht kann schon bepflanzt werden – geschützt vor Frost.",
    beet: "Überdacht: Radieschen + Salat",
  },
  {
    month: "April",
    icon: "🌸",
    vorziehen: [
      { name: "Kürbis (nochmals)", wo: "Freiland Beet", tipp: "Falls März-Satz nicht geklappt hat" },
    ],
    pflanzen: [
      { name: "Kohlrabi Jungpflanzen", wo: "Hochbeet überdacht", tipp: "Aus Jan/Feb-Anzucht" },
      { name: "Salat (Folgesatz)", wo: "Hochbeet", tipp: "Ab Mitte April, wenn kein Frost mehr erwartet" },
      { name: "Radieschen", wo: "Hochbeet", tipp: "Direktsaat ab Mitte April" },
      { name: "Erbsen", wo: "Hochbeet", tipp: "Direktsaat – gut für Anfänger!" },
      { name: "Möhren", wo: "Hochbeet", tipp: "Direktsaat, mag lockere Erde" },
    ],
    ernten: [
      { name: "Radieschen (März-Satz)", wo: "Hochbeet überdacht", tipp: "Ca. 3–4 Wochen nach Aussaat" },
      { name: "Salat (erste Blätter)", wo: "Hochbeet überdacht", tipp: "Schnittsalat nach Bedarf ernten" },
    ],
    tipp: "Tomaten, Paprika, Gurken stehen drinnen und wachsen heran – regelmäßig pikieren!",
    beet: "Überdacht: Kohlrabi | Hochbeet: Salat, Radieschen, Erbsen, Möhren",
  },
  {
    month: "Mai",
    icon: "☀️",
    vorziehen: [],
    pflanzen: [
      { name: "Tomaten", wo: "Hochbeet überdacht", tipp: "Ab Mitte Mai nach den Eisheiligen (11.–15. Mai)!" },
      { name: "Paprika", wo: "Hochbeet überdacht", tipp: "Wärmeliebend – nach Eisheiligen" },
      { name: "Gurken", wo: "Hochbeet überdacht", tipp: "Ideal unter dem Dach" },
      { name: "Zucchini", wo: "Freiland Beet", tipp: "Braucht viel Platz!" },
      { name: "Kürbis", wo: "Freiland Beet", tipp: "Sehr platzintensiv, ab Mitte Mai" },
      { name: "Salat (3. Satz)", wo: "Hochbeet", tipp: "Gestaffelt alle 3 Wochen säen" },
    ],
    ernten: [
      { name: "Radieschen", wo: "Hochbeet", tipp: "Laufende Ernte" },
      { name: "Salat", wo: "Hochbeet", tipp: "Schnittsalat oder Köpfe" },
      { name: "Erbsen (Zuckerschoten)", wo: "Hochbeet", tipp: "Falls früh gepflanzt" },
      { name: "Kohlrabi (früh)", wo: "Hochbeet überdacht", tipp: "Aus März-Anzucht, wenn Knollen faustgroß" },
    ],
    tipp: "🌡️ ACHTUNG EISHEILIGE (11.–15. Mai): Erst danach empfindliche Pflanzen raus! Tomaten unter Dach früher.",
    beet: "Überdacht: Tomaten, Paprika, Gurken | Hochbeet: Salat, Möhren",
  },
  {
    month: "Juni",
    icon: "🌞",
    vorziehen: [
      { name: "Salat (Herbstsatz)", wo: "Hochbeet", tipp: "Hitzeresistente Sorte wählen" },
      { name: "Kohlrabi (Herbstsatz)", wo: "Hochbeet", tipp: "Für Herbsternte" },
    ],
    pflanzen: [
      { name: "Salat (Folge)", wo: "Hochbeet", tipp: "Immer staffeln!" },
      { name: "Radieschen (Folge)", wo: "Hochbeet", tipp: "Bis Ende Juni noch möglich" },
      { name: "Buschbohnen", wo: "Hochbeet", tipp: "Direktsaat, einfach & ertragreich" },
      { name: "Rote Bete", wo: "Hochbeet", tipp: "Direktsaat bis Ende Juni" },
    ],
    ernten: [
      { name: "Radieschen", wo: "Hochbeet", tipp: "Laufend" },
      { name: "Salat", wo: "Hochbeet", tipp: "Laufend" },
      { name: "Kohlrabi", wo: "Hochbeet überdacht", tipp: "Aus Frühjahrsanzucht" },
      { name: "Erbsen", wo: "Hochbeet", tipp: "Haupternte" },
      { name: "Möhren (Frühsorten)", wo: "Hochbeet", tipp: "Wenn fingerdick" },
    ],
    tipp: "Tomaten, Paprika und Gurken regelmäßig gießen und Tomaten ausgeizen!",
    beet: "Überdacht: Tomaten/Paprika/Gurken wachsen | Hochbeet: Bohnen, Bete",
  },
  {
    month: "Juli",
    icon: "🍅",
    vorziehen: [
      { name: "Salat (Herbst)", wo: "Hochbeet", tipp: "Für September-Pflanzung" },
      { name: "Pak Choi / Asiasalat", wo: "Hochbeet überdacht", tipp: "Tolles Anfänger-Gemüse für Herbst" },
    ],
    pflanzen: [
      { name: "Kohlrabi (Herbst)", wo: "Hochbeet", tipp: "Nach Frühernte-Lücken nachpflanzen" },
      { name: "Spinat", wo: "Hochbeet", tipp: "Direktsaat für Herbst" },
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Ab Ende Juli für Winterernte" },
    ],
    ernten: [
      { name: "🍅 Erste Tomaten!", wo: "Hochbeet überdacht", tipp: "Cherry-Tomaten zuerst reif" },
      { name: "Gurken", wo: "Hochbeet überdacht", tipp: "Regelmäßig ernten, sonst werden sie bitter" },
      { name: "Zucchini", wo: "Freiland Beet", tipp: "Klein ernten (20 cm) = zarter Geschmack" },
      { name: "Kohlrabi", wo: "Hochbeet", tipp: "Haupternte" },
      { name: "Salat", wo: "Hochbeet", tipp: "Laufend" },
      { name: "Buschbohnen", wo: "Hochbeet", tipp: "Haupternte" },
      { name: "Möhren", wo: "Hochbeet", tipp: "Wenn dick genug" },
    ],
    tipp: "Hochsaison! Zucchini täglich kontrollieren – wächst sehr schnell!",
    beet: "Alle Beete in voller Produktion",
  },
  {
    month: "August",
    icon: "🥒",
    vorziehen: [],
    pflanzen: [
      { name: "Salat (Herbst)", wo: "Hochbeet", tipp: "Letzte Chance für Herbsternte" },
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Direktsaat für Winter" },
      { name: "Spinat", wo: "Hochbeet", tipp: "Herbst-/Winterernte" },
      { name: "Radieschen (Herbst)", wo: "Hochbeet", tipp: "Noch eine schnelle Runde!" },
    ],
    ernten: [
      { name: "Tomaten", wo: "Hochbeet überdacht", tipp: "Haupternte – Überschuss einkochen!" },
      { name: "Paprika", wo: "Hochbeet überdacht", tipp: "Grün oder reif rot ernten" },
      { name: "Gurken", wo: "Hochbeet überdacht", tipp: "Täglich kontrollieren" },
      { name: "Zucchini", wo: "Freiland Beet", tipp: "Laufend" },
      { name: "Kürbis", wo: "Freiland Beet", tipp: "Noch nicht – Stiel muss verkorkt sein" },
      { name: "Rote Bete", wo: "Hochbeet", tipp: "Ab ca. Faustgröße" },
      { name: "Möhren", wo: "Hochbeet", tipp: "Laufend" },
      { name: "Buschbohnen", wo: "Hochbeet", tipp: "2. Ernte" },
    ],
    tipp: "Nach Ernte freiwerdende Flächen sofort mit Feldsalat oder Spinat nachsäen!",
    beet: "Überdacht: Tomaten/Paprika Hochsaison | Hochbeet: Nachsaat Herbst",
  },
  {
    month: "September",
    icon: "🍂",
    vorziehen: [],
    pflanzen: [
      { name: "Feldsalat (letzte Chance)", wo: "Hochbeet", tipp: "Bis Mitte September noch säen" },
      { name: "Winterportulak", wo: "Hochbeet überdacht", tipp: "Tolles kältehartes Wintergemüse" },
      { name: "Asiasalate", wo: "Hochbeet überdacht", tipp: "Mizuna, Pak Choi – sehr einfach!" },
    ],
    ernten: [
      { name: "Tomaten", wo: "Hochbeet überdacht", tipp: "Letzte Ernte, grüne Tomaten für Chutney" },
      { name: "Paprika", wo: "Hochbeet überdacht", tipp: "Alles vor dem ersten Frost ernten" },
      { name: "Kürbis 🎃", wo: "Freiland Beet", tipp: "Wenn Stiel verkorkt und Schale hart – jetzt ernten!" },
      { name: "Zucchini (letzter)", wo: "Freiland Beet", tipp: "Vor Frost ernten" },
      { name: "Möhren", wo: "Hochbeet", tipp: "Komplett ernten oder im Beet lagern" },
      { name: "Rote Bete", wo: "Hochbeet", tipp: "Vor starkem Frost ernten" },
      { name: "Salat", wo: "Hochbeet", tipp: "Laufend" },
      { name: "Kohlrabi (Herbst)", wo: "Hochbeet", tipp: "Ab jetzt" },
    ],
    tipp: "Kürbisse nach Ernte trocken und kühl lagern – halten Monate! Tomaten-Pflanzen nach Saison kompostieren.",
    beet: "Räumung + Nachsaat Wintergemüse",
  },
  {
    month: "Oktober",
    icon: "🎃",
    vorziehen: [],
    pflanzen: [
      { name: "Knoblauch", wo: "Hochbeet überdacht", tipp: "Jetzt stecken für nächstes Jahr!" },
      { name: "Knoblauch", wo: "Hochbeet", tipp: "Jetzt stecken für nächstes Jahr!" },
      { name: "Zwiebeln (Steckzwiebeln)", wo: "Hochbeet", tipp: "Herbststeckung für Frühjahrsernte" },
    ],
    ernten: [
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Erste Blätter" },
      { name: "Asiasalate", wo: "Hochbeet überdacht", tipp: "Im überdachten Beet laufend" },
      { name: "Kohlrabi (Herbst)", wo: "Hochbeet", tipp: "Letzte Ernte vor Frost" },
      { name: "Spinat", wo: "Hochbeet", tipp: "Vor Frost ernten oder mulchen" },
      { name: "Winterportulak", wo: "Hochbeet überdacht", tipp: "Kälteverträglich, kann bleiben" },
    ],
    tipp: "Beete abräumen, kompostieren und mit Mulch oder Winterbegrünung abdecken.",
    beet: "Abrüsten + Knoblauch stecken",
  },
  {
    month: "November",
    icon: "🌧️",
    vorziehen: [],
    pflanzen: [],
    ernten: [
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Verträgt leichten Frost" },
      { name: "Winterportulak", wo: "Hochbeet überdacht", tipp: "Im überdachten Beet ernten" },
      { name: "Asiasalate", wo: "Hochbeet überdacht", tipp: "Im überdachten Beet – bis Frost" },
    ],
    tipp: "Ruhephase. Saatgut-Kataloge studieren & Beetplanung für nächstes Jahr beginnen. Rhabarber-Wurzeln jetzt pflanzen!",
    beet: "Überdachtes Hochbeet: Wintergemüse",
  },
  {
    month: "Dezember",
    icon: "🎄",
    vorziehen: [],
    pflanzen: [],
    ernten: [
      { name: "Feldsalat", wo: "Hochbeet", tipp: "Wenn kein extremer Frost" },
      { name: "Winterportulak", wo: "Hochbeet überdacht", tipp: "Im überdachten Beet" },
    ],
    tipp: "Gartenplanung für 2027! Saatgut bestellen, Beetplan zeichnen, Fruchtfolge planen.",
    beet: "Ruhe – Feldsalat & Portulak ernten",
  },
];

export const tagColors = {
  "Hochbeet überdacht": "bg-sky-100 text-sky-800 border border-sky-300",
  "Hochbeet":           "bg-green-100 text-green-700 border border-green-300",
  "Freiland Beet":      "bg-lime-100 text-lime-700 border border-lime-300",
  "Kräuterspirale":     "bg-teal-100 text-teal-700 border border-teal-300",
  "Topf":               "bg-orange-100 text-orange-700 border border-orange-300",
};
