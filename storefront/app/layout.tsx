import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { fontBody, fontDisplay } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Order of Things",
  description: "Eau de parfum compositions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontBody.variable} ${fontDisplay.variable} antialiased`}
    >
      {/* While a sticky buy bar is on the page, reserve its height at the end so
          the footer can scroll fully clear of it. */}
      <body className="has-data-sticky-bar:pb-[76px] lg:has-data-sticky-bar:pb-20">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
