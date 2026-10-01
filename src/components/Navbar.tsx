"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#randevu", label: "Randevu" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-ink/80 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="font-display text-lg font-medium tracking-[0.3em] text-cream sm:text-xl">
          T<span className="text-gold">H</span>
        </a>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 transition hover:text-gold">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#randevu" className="outline-btn rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em]">
          Randevu
        </a>
      </nav>
    </header>
  );
}
