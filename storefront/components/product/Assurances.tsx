import { OriginIcon, ReturnIcon, TruckIcon } from "@/components/icons";
import { DetailGrid } from "./DetailGrid";

// Figma Assurances (14:3807).
export function Assurances() {
  return (
    <DetailGrid
      items={[
        { Icon: TruckIcon, title: "Shipping included" },
        { Icon: ReturnIcon, title: "30-day returns" },
        { Icon: OriginIcon, title: "France & Italy" },
      ]}
    />
  );
}
