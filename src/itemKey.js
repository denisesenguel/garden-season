export const itemKey = (monthIndex, category, name, wo) =>
  `${monthIndex}:${category}:${name}:${wo ?? ""}`;
