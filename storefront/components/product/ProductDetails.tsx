import type { ComponentType, SVGProps } from "react";
import {
  CartonIcon,
  ClockIcon,
  DropIcon,
  FlaskIcon,
  GiftIcon,
  NeckIcon,
  NoRubIcon,
  OriginIcon,
  ReturnIcon,
  RibbonIcon,
  SprayIcon,
  TruckIcon,
  WristIcon,
} from "@/components/icons";
import { Accordion } from "./Accordion";

// Details accordion content (Figma 14:3381, open states). The copy is
// composition-agnostic except "The composition" intro, which is written per
// composition. It lives here until it moves into Shopify metafields.
type Detail = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
};

const COMPOSITION_INTROS: Record<string, string> = {
  "no-1-woody-vetiver":
    "Opens bright with bergamot, turns green and aromatic, and dries down to a dry, woody vetiver that stays close to the skin.",
};

const HOW_TO_WEAR: Detail[] = [
  { Icon: NeckIcon, title: "2× · Neck", text: "At the base, where it warms" },
  { Icon: WristIcon, title: "1× · Wrist", text: "Inner wrist, one spray" },
  { Icon: NoRubIcon, title: "Don't rub", text: "Let it settle on its own" },
];

const COMPOSITION: Detail[] = [
  { Icon: OriginIcon, title: "France & Italy", text: "Blended with a fragrance house" },
  { Icon: DropIcon, title: "Eau de Parfum", text: "One concentration" },
  { Icon: RibbonIcon, title: "Fine fragrance", text: "Written complete, then adapted" },
];

const PACKAGING: Detail[] = [
  { Icon: SprayIcon, title: "50 ml spray", text: "1.7 fl oz, natural spray" },
  { Icon: CartonIcon, title: "Butter carton", text: "Printed with its scent ID" },
  { Icon: GiftIcon, title: "Wrapped by hand", text: "Every order" },
];

const SHIPPING: Detail[] = [
  { Icon: TruckIcon, title: "Complimentary shipping", text: "Every order within Australia" },
  { Icon: ClockIcon, title: "Dispatched in 1–2 business days", text: "Tracked to your door" },
  { Icon: ReturnIcon, title: "30-day returns", text: "On unopened cartons. Terms to be confirmed" },
];

// Placeholder list, as marked in the design.
const INGREDIENTS = [
  { label: "Formula", items: ["Alcohol denat.", "Parfum (fragrance)", "Aqua (water)"] },
  { label: "Declared allergens", items: ["Limonene", "Linalool", "Citral", "Geraniol"] },
];

function Intro({ children }: { children: string }) {
  return <p className="mb-4 text-body-m">{children}</p>;
}

/** Three columns under a hairline: icon, uppercase label, sub-line. */
function Columns({ items }: { items: Detail[] }) {
  return (
    <ul className="grid grid-cols-3 gap-4 border-t border-hairline pt-4">
      {items.map(({ Icon, title, text }) => (
        <li key={title} className="flex flex-col gap-2">
          <Icon />
          <p className="text-label">{title}</p>
          <p className="text-body-s opacity-75">{text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Stacked rows separated by hairlines: icon beside a title and sub-line. */
function Rows({ items }: { items: Detail[] }) {
  return (
    <ul className="border-t border-hairline">
      {items.map(({ Icon, title, text }) => (
        <li key={title} className="flex gap-3 border-b border-hairline py-3 last:border-b-0">
          <Icon className="shrink-0" />
          <div>
            <p className="text-label">{title}</p>
            <p className="text-body-s opacity-75">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Ingredients() {
  return (
    <div className="flex flex-col gap-4">
      {INGREDIENTS.map(({ label, items }) => (
        <div key={label}>
          <p className="mb-2 text-caption opacity-60">{label}</p>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item} className="border border-ink px-2 py-1 text-caption">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Rows
        items={[
          {
            Icon: FlaskIcon,
            title: "Placeholder list",
            text: "Final INCI and allergens to be supplied by the fragrance house",
          },
        ]}
      />
    </div>
  );
}

export function ProductDetails({ handle }: { handle: string }) {
  const compositionIntro = COMPOSITION_INTROS[handle];

  return (
    <Accordion
      items={[
        {
          title: "How to wear",
          content: (
            <>
              <Intro>After bathing, while skin is still warm.</Intro>
              <Columns items={HOW_TO_WEAR} />
            </>
          ),
        },
        {
          title: "The composition",
          content: (
            <>
              {compositionIntro && <Intro>{compositionIntro}</Intro>}
              <Columns items={COMPOSITION} />
            </>
          ),
        },
        { title: "Ingredients", content: <Ingredients /> },
        { title: "Packaging", content: <Columns items={PACKAGING} /> },
        { title: "Shipping & returns", content: <Rows items={SHIPPING} /> },
      ]}
    />
  );
}
