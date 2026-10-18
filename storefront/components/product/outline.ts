// Outline states shared by the scent tiles, purchase options and delivery
// frequency (Figma Option Tile 14:2535 / Purchase Option 14:2554 / 14:3546):
// selected is a full ink outline with a 3px base rule; "checked" is the plain
// 1px ink outline of the frequency tiles; inactive sits at 14% ink, 60% on
// hover; unavailable at 8%.
export function outlineClass(
  state: "selected" | "checked" | "default" | "unavailable",
): string {
  switch (state) {
    case "selected":
      return "border border-b-3 border-ink";
    case "checked":
      return "border border-ink";
    case "default":
      return "border border-ink/14 hover:border-ink/60";
    case "unavailable":
      return "border border-ink/8";
  }
}
