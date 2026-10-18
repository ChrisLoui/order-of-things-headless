// Outline states shared by the scent tiles and purchase options (Figma Option
// Tile 14:2535 / Purchase Option 14:2554): selected is a full ink outline with a
// 3px base rule; inactive sits at 14% ink, 60% on hover; unavailable at 8%.
export function outlineClass(state: "selected" | "default" | "unavailable"): string {
  switch (state) {
    case "selected":
      return "border border-b-3 border-ink";
    case "default":
      return "border border-ink/14 hover:border-ink/60";
    case "unavailable":
      return "border border-ink/8";
  }
}
