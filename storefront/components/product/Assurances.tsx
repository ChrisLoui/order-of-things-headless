import { OriginIcon, ReturnIcon, TruckIcon } from "@/components/icons";

// Figma Assurances (14:3807): three Detail Tiles, icon over label.
const ITEMS = [
  { Icon: TruckIcon, label: "Shipping included" },
  { Icon: ReturnIcon, label: "30-day returns" },
  { Icon: OriginIcon, label: "France & Italy" },
];

export function Assurances() {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {ITEMS.map(({ Icon, label }) => (
        <li key={label} className="flex flex-col gap-3">
          <Icon />
          <p className="text-label">{label}</p>
        </li>
      ))}
    </ul>
  );
}
