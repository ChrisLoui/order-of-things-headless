import { Archivo, Archivo_Narrow } from "next/font/google";

// Stand-ins for Pilat / Pilat Narrow (commercial). To use the real fonts,
// replace these two declarations with next/font/local and update the two
// matching lines in globals.css (@theme inline).
//
// Both load as variable fonts (no `weight` list). Requesting static weights
// for Archivo breaks the Turbopack build in Next 16.4.2.
export const fontBody = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontDisplay = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  display: "swap",
});
