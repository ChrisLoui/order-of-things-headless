import type { Metadata } from "next";
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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
