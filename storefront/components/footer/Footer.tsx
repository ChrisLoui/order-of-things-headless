import { LogoSymbol, Wordmark } from "@/components/icons";

// Figma Footer/Desktop (14:3881, 1440×540) and Footer/Mobile (14:4051, 390×556).
// Links are placeholders. Mobile uses shorter column titles and bottom-row copy.
const COLUMNS = [
  { title: "Customer care", short: "Help", links: ["Contact", "FAQ", "Shipping", "Returns"] },
  { title: "The company", short: "Company", links: ["Discover", "Concierge", "Research"] },
  { title: "Legal", short: "Legal", links: ["Terms", "Privacy", "Cookies"] },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube"];

const hairline = "border-bone/40";

export function Footer() {
  return (
    <footer className="bg-charcoal text-bone">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-[18px] lg:px-10 lg:pt-0 lg:pb-[34px]">
        <div className={`border-b ${hairline} lg:grid lg:grid-cols-[560fr_267fr_267fr_266fr]`}>
          <div className="lg:pt-[55px]">
            <LogoSymbol className="w-14 lg:w-[72px]" />
            <p className="mt-[34px] pb-[35px] text-body-m opacity-85 lg:mt-[27px] lg:max-w-[320px] lg:pb-0">
              Six eaux de parfum, written to fine-fragrance standard and blended in France &amp;
              Italy.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className={`grid grid-cols-[108fr_121fr_121fr] border-t ${hairline} lg:col-span-3 lg:grid-cols-subgrid lg:border-t-0`}
          >
            {COLUMNS.map((column, i) => (
              <div
                key={column.title}
                className={`pt-[31px] pb-[33px] lg:border-l lg:pt-[57px] lg:pb-[57px] lg:pl-8 ${hairline} ${
                  i > 0 ? "border-l pl-3" : ""
                }`}
              >
                <h3 className="text-caption opacity-60">
                  <span className="lg:hidden">{column.short}</span>
                  <span className="hidden lg:inline">{column.title}</span>
                </h3>
                <ul className="mt-[18px] flex flex-col gap-1.5 text-body-m lg:mt-[17px] lg:gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={`border-b ${hairline} py-8 lg:py-[41px]`}>
          <Wordmark className="w-full" />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-caption lg:mt-5 lg:grid lg:grid-cols-3 lg:items-center">
          <ul className="flex gap-6 lg:order-2 lg:justify-center">
            {SOCIALS.map((social) => (
              <li key={social}>
                <a href="#">{social}</a>
              </li>
            ))}
          </ul>
          <p className="flex justify-between opacity-60 lg:contents">
            <span className="lg:order-1">
              © Order of Things ·{" "}
              <span className="lg:hidden">AU · FR · IT</span>
              <span className="hidden lg:inline">Australia · France · Italy</span>
            </span>
            <span className="lg:order-3 lg:text-right">
              AUD / USD<span className="hidden lg:inline"> (auto)</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
