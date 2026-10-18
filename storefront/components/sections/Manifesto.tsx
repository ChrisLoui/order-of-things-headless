import Image from "next/image";
import { COLUMNS, BrandGrid } from "@/components/brand/BrandGrid";
import { Rule } from "@/components/brand/Rule";
import { LogoSymbol } from "@/components/icons";

// Figma 14:3818 (desktop 1440×661) / 14:3983 (mobile 390×560): photo with the
// large symbol, beside a charcoal panel with butter rules.
// The render shows only three of the grid's columns here (bone over the photo,
// one on the charcoal), so only those are drawn.
const VISIBLE_COLUMNS = [COLUMNS[0], COLUMNS[2], COLUMNS[3]];

export function Manifesto() {
  return (
    <section className="relative mx-auto grid max-w-[1440px] lg:h-[661px] lg:grid-cols-2">
      <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden bg-charcoal lg:aspect-auto">
        <Image
          src="/images/section-manifesto-water.jpg"
          alt=""
          fill
          sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw"
          // Desktop crops in tight on the hair over the water at the photo's left
          // edge (desktop-full.png); mobile shows the whole frame.
          className="object-cover lg:origin-left lg:scale-[1.75]"
        />
        <LogoSymbol className="relative w-[140px] text-bone lg:w-[300px]" />
      </div>

      <div className="flex flex-col bg-charcoal px-5 pt-[30px] pb-[25px] text-butter lg:pt-12 lg:pr-0 lg:pb-[49px] lg:pl-[15.7%]">
        <div className="flex flex-1 flex-col lg:w-[450px] lg:max-w-full">
          <Rule tone="butter" />
          {/* Two fixed lines as in Figma. Archivo Narrow is wider than Pilat Narrow,
              so at 64px the first line runs slightly past the rules (as in the
              render); below xl the panel is too narrow for 64px, so it stays at H2. */}
          <h2 className="mt-[27px] text-h2 whitespace-nowrap uppercase lg:mt-7 lg:pl-4 xl:text-h1">
            <span className="block">Order without</span>
            <span className="block">complexity.</span>
          </h2>
          <div className="mt-auto pt-6">
            <Rule tone="butter" />
          </div>
          <p className="mt-[26px] text-body-m lg:mt-[25px] lg:max-w-[340px] lg:pl-4">
            <span className="lg:hidden">
              Six compositions, each written to fine-fragrance standard and finished without
              compromise.
            </span>
            <span className="hidden lg:inline">
              Six compositions, each written to fine-fragrance standard. The first use matters;
              the hundredth matters more.
            </span>
          </p>
          <div className="mt-[22px] lg:mt-auto">
            <Rule tone="butter" />
          </div>
        </div>
      </div>

      <BrandGrid rows={false} tone="bone" columns={VISIBLE_COLUMNS} className="hidden lg:block" />
    </section>
  );
}
