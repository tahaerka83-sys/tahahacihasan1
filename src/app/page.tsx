import { asc } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import Reveal from "@/components/Reveal";
import { ClockIcon, PhoneIcon, PinIcon, ServiceIcon, WhatsAppIcon } from "@/components/Icons";
import { PHONE_DISPLAY, PHONE_TEL, whatsappUrl } from "@/lib/contact";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const serviceList = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)] blur-2xl sm:h-[760px] sm:w-[760px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,14,14,0.6)_80%,#0e0e0e)]" />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="hero-in hero-in-1 text-[10px] uppercase tracking-[0.5em] text-gold sm:text-xs">Premium Erkek Bakım · Randevu İle</p>

            <div className="hero-line gold-rule my-8 w-24" />

            <h1 className="hero-in hero-in-2 font-display text-[12vw] font-light leading-[0.95] tracking-[0.12em] text-cream sm:text-7xl md:text-8xl">
              TAHA
              <br />
              <span className="gold-text">HACIHASAN</span>
            </h1>

            <div className="hero-line gold-rule my-8 w-24" />

            <p className="hero-in hero-in-3 font-display text-xl font-light italic tracking-wide text-neutral-300 sm:text-2xl">
              Kişiye Özel Premium Erkek Bakım Deneyimi
            </p>

            <a href="#randevu" className="hero-in hero-in-4 gold-btn mt-12 rounded-full px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.3em]">
              Randevu Oluştur
            </a>

            <p className="hero-in hero-in-4 mt-6 text-[10px] uppercase tracking-[0.3em] text-neutral-600">Yalnızca randevu ile</p>
          </div>

          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
            <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-600">Keşfet</span>
            <span className="h-12 w-px bg-gradient-to-b from-gold/70 to-transparent" />
          </div>
        </section>

        {/* SERVICES */}
        <section id="hizmetler" className="relative py-28 sm:py-36">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal className="mb-16 text-center">
              <p className="text-[10px] uppercase tracking-[0.45em] text-gold">Menü</p>
              <h2 className="font-display mt-4 text-4xl font-light text-cream sm:text-5xl">Hizmetler &amp; Fiyatlar</h2>
              <div className="gold-rule mx-auto mt-6 w-16" />
            </Reveal>

            <ul className="border-t border-line">
              {serviceList.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 90} className="group border-b border-line">
                  <div className="flex items-start gap-6 py-8 transition-colors duration-500 sm:items-center sm:gap-8">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_0_24px_-6px_rgba(212,175,55,0.7)]">
                      <ServiceIcon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <h3 className="font-display text-2xl font-light text-cream transition group-hover:text-gold-light sm:text-3xl">{s.name}</h3>
                        <span className="hidden flex-1 border-b border-dotted border-line sm:block" />
                        <span className="font-display text-2xl text-gold">₺{s.price.toLocaleString("tr-TR")}</span>
                      </div>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">{s.description}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-neutral-600">{s.durationMin} dakika</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-10 text-center" delay={200}>
              <a href="#randevu" className="outline-btn inline-block rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.25em]">
                Randevu Oluştur
              </a>
            </Reveal>
          </div>
        </section>

        {/* BOOKING */}
        <section id="randevu" className="relative overflow-hidden py-28 sm:py-36">
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.1),transparent_60%)] blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Reveal className="mb-14 text-center">
              <p className="text-[10px] uppercase tracking-[0.45em] text-gold">Rezervasyon</p>
              <h2 className="font-display mt-4 text-4xl font-light text-cream sm:text-5xl">Randevu Oluşturun</h2>
              <div className="gold-rule mx-auto mt-6 w-16" />
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-500">
                Üç sade adımda yerinizi ayırtın. Her seans yalnızca size ayrılır.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <BookingForm services={serviceList} />
            </Reveal>
          </div>
        </section>

        {/* FOOTER / CONTACT */}
        <footer id="iletisim" className="relative border-t border-line py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="mb-14 text-center">
              <p className="font-display text-2xl font-light tracking-[0.3em] text-cream">
                TAHA <span className="text-gold">HACIHASAN</span>
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-neutral-600">Premium Erkek Bakım</p>
            </Reveal>

            <div className="grid gap-12 text-center sm:grid-cols-3 sm:text-left">
              <Reveal delay={0}>
                <div className="mb-4 flex items-center justify-center gap-2 text-gold sm:justify-start">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">Çalışma Saatleri</span>
                </div>
                <p className="text-sm text-neutral-300">Pazartesi – Cumartesi</p>
                <p className="font-display text-xl text-cream">09:00 – 20:00</p>
                <p className="mt-2 text-sm text-neutral-300">Pazar</p>
                <p className="font-display text-xl text-cream">11:00 – 18:00</p>
              </Reveal>

              <Reveal delay={100}>
                <div className="mb-4 flex items-center justify-center gap-2 text-gold sm:justify-start">
                  <PinIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">Çalışma Bilgisi</span>
                </div>
                <p className="font-display text-2xl font-light italic text-gold-light">Randevu İle Çalışmaktadır.</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  Her seans yalnızca size ayrılır. Randevunuzu site üzerinden oluşturabilir ya da doğrudan arayabilirsiniz.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mb-4 flex items-center justify-center gap-2 text-gold sm:justify-start">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">İletişim</span>
                </div>
                <a href={PHONE_TEL} className="font-display block text-2xl tracking-wider text-cream transition hover:text-gold">
                  {PHONE_DISPLAY}
                </a>
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <a href={PHONE_TEL} className="outline-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.2em]">
                    <PhoneIcon className="h-4 w-4" />
                    Ara
                  </a>
                  <a
                    href={whatsappUrl("Merhaba Taha Bey, randevu almak istiyorum.")}
                    target="_blank"
                    rel="noreferrer"
                    className="gold-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="gold-rule mt-16" />
            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-600">
              © {new Date().getFullYear()} Taha Hacıhasan · Tüm hakları saklıdır
            </p>
          </div>
        </footer>
      </main>

      {/* Floating WhatsApp */}
      <a
        href={whatsappUrl("Merhaba Taha Bey, randevu almak istiyorum.")}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-gold/50 bg-ink/90 text-gold shadow-[0_10px_30px_-8px_rgba(212,175,55,0.5)] backdrop-blur transition hover:bg-gold hover:text-ink"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </>
  );
}
