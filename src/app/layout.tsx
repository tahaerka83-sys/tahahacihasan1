import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "TAHA HACIHASAN | Kişiye Özel Premium Erkek Bakım Deneyimi",
  description:
    "Taha Hacıhasan — kişiye özel saç tasarımı, sakal ince işçiliği ve VIP bakım seansları. Yalnızca randevu ile.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}
