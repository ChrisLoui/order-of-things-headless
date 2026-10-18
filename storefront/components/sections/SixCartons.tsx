import Image from "next/image";

// Figma 14:3868 (desktop 1440×780) / 14:4041 (mobile 390×390).
export function SixCartons() {
  return (
    <section className="relative mx-auto aspect-square max-w-[1440px] lg:aspect-[1440/780]">
      <Image
        src="/images/section-six-cartons.jpg"
        alt="Six butter cartons in a row on a travertine block"
        fill
        sizes="(min-width: 1440px) 1440px, 100vw"
        className="object-cover"
      />
    </section>
  );
}
