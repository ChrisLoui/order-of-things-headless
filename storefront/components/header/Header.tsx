import Link from "next/link";
import { Suspense } from "react";
import { MenuIcon, SearchIcon, Wordmark } from "@/components/icons";
import { CartLink, CartLinkView } from "./CartLink";

// Figma: Header/Desktop 14:3704 and Header/Mobile 14:3883, variant "Compact Light".
// Per the component note, this variant sticks to the top for the rest of the page.
// Search, Login, menu and nav links are placeholders.
const NAV = ["Products", "Scents", "Discover"];

export function Header() {
  return (
    <header data-site-header className="sticky top-0 z-40 bg-bone">
      <div className="mx-auto max-w-[1440px] px-5 py-3 lg:px-10 lg:py-5">
        <div className="flex flex-col gap-4 lg:py-[14px]">
          <div className="flex items-center justify-between border-b border-ink pt-3 pb-[14px] lg:pt-0 lg:pb-4">
            <div className="flex w-24 items-center gap-[18px] lg:w-[132px] lg:gap-2">
              <button type="button" aria-label="Menu" className="lg:hidden">
                <MenuIcon />
              </button>
              <a href="#" className="flex items-center gap-2 text-nav">
                <SearchIcon className="size-[22px] lg:size-[18px]" />
                <span className="sr-only lg:not-sr-only">Search</span>
              </a>
            </div>

            <Link href="/" aria-label="Order of Things, home">
              <Wordmark className="w-[140px] lg:w-[200px]" />
            </Link>

            <div className="flex w-24 justify-end gap-8 text-nav lg:w-auto">
              <a href="#" className="hidden lg:inline">
                Login
              </a>
              <Suspense fallback={<CartLinkView count={0} />}>
                <CartLink />
              </Suspense>
            </div>
          </div>

          <nav aria-label="Primary" className="hidden justify-center gap-8 text-nav lg:flex">
            {NAV.map((item) => (
              <a key={item} href="#">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
