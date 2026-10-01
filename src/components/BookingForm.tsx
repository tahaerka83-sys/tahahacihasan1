"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Service } from "@/db/schema";
import { CheckIcon, ServiceIcon, WhatsAppIcon } from "@/components/Icons";
import { buildAppointmentMessage, whatsappUrl } from "@/lib/contact";

type Slot = { time: string; available: boolean };

const STEPS = ["Hizmet", "Tarih & Saat", "İletişim"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateTR(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingForm({ services }: { services: Service[] }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ code: string; waUrl: string } | null>(null);

  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);

  const minDate = toDateStr(new Date());
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toDateStr(d);
  }, []);

  const quickDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        value: toDateStr(d),
        label: i === 0 ? "Bugün" : i === 1 ? "Yarın" : d.toLocaleDateString("tr-TR", { weekday: "short" }),
        sub: d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      };
    });
  }, []);

  const loadSlots = useCallback(async () => {
    if (!serviceId || !date) return;
    setSlotsLoading(true);
    setSlots([]);
    try {
      const res = await fetch(`/api/availability?serviceId=${serviceId}&date=${date}`, { cache: "no-store" });
      const data = (await res.json()) as { slots?: Slot[] };
      setSlots(data.slots ?? []);
    } finally {
      setSlotsLoading(false);
    }
  }, [serviceId, date]);

  useEffect(() => {
    setTime("");
    void loadSlots();
  }, [loadSlots]);

  const canNext = [
    serviceId !== null,
    date !== "" && time !== "",
    name.trim().length >= 3 && phone.replace(/\D/g, "").length >= 10,
  ][step];

  const next = () => {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    if (!canNext) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, name, phone, note }),
      });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu");
        if (res.status === 409) {
          setStep(1);
          void loadSlots();
        }
        return;
      }
      const code = data.code ?? "";
      const waUrl = whatsappUrl(
        buildAppointmentMessage({
          code,
          service: service?.name ?? "",
          date: formatDateTR(date),
          time,
          duration: service?.durationMin ?? 0,
          price: service?.price ?? 0,
          name: name.trim(),
          phone: phone.trim(),
          note: note.trim() || undefined,
        }),
      );
      setSuccess({ code, waUrl });
      // Müşteriyi hazır randevu özetiyle WhatsApp hattına yönlendir
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setServiceId(null);
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setNote("");
    setSuccess(null);
    setError(null);
  };

  /* ---------- VIP Onay Kartı ---------- */
  if (success) {
    return (
      <div className="vip-card relative mx-auto max-w-lg overflow-hidden rounded-2xl p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 text-gold">
            <CheckIcon className="h-7 w-7" />
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-gold">VIP Randevu Onayı</p>
          <h3 className="font-display mt-3 text-3xl font-light text-cream sm:text-4xl">Randevunuz Alındı</h3>
          <p className="font-display mt-2 text-xl tracking-[0.3em] text-gold-light">{success.code}</p>

          <div className="gold-rule my-8" />

          <dl className="space-y-4 text-left text-sm">
            <Row label="Misafir" value={name} />
            <Row label="Hizmet" value={service?.name ?? ""} />
            <Row label="Tarih" value={formatDateTR(date)} />
            <Row label="Saat" value={time} />
            <Row label="Süre" value={`${service?.durationMin} dakika`} />
          </dl>

          <div className="gold-rule my-8" />

          <p className="font-display text-lg font-light italic text-neutral-400">
            &ldquo;Sizi ağırlamaktan onur duyacağız.&rdquo;
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-gold/80">Taha Hacıhasan</p>

          <p className="mt-8 text-xs leading-relaxed text-neutral-500">
            Randevu özetiniz WhatsApp&apos;a aktarıldı. Pencere açılmadıysa aşağıdaki butonla gönderebilirsiniz.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={success.waUrl}
              target="_blank"
              rel="noreferrer"
              className="gold-btn inline-flex items-center gap-2 rounded-full px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp&apos;ta Gönder
            </a>
            <button onClick={reset} className="outline-btn rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.2em]">
              Yeni Randevu
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-center gap-4 sm:gap-8">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                    active
                      ? "border-gold bg-gold text-ink shadow-[0_0_24px_-4px_rgba(212,175,55,0.7)]"
                      : done
                        ? "border-gold/60 text-gold"
                        : "border-line text-neutral-600"
                  }`}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : <span className="font-display text-sm">{i + 1}</span>}
                </span>
                <span className={`hidden text-[11px] uppercase tracking-[0.25em] sm:block ${active ? "text-cream" : done ? "text-gold/80" : "text-neutral-600"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="relative block h-px w-8 bg-line sm:w-14">
                  <span className={`absolute inset-y-0 left-0 bg-gold transition-all duration-700 ${done ? "w-full" : "w-0"}`} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="relative rounded-2xl border border-line bg-coal/80 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur sm:p-10">
        {/* Step 1 */}
        {step === 0 && (
          <div key="s0" className="step-enter">
            <StepTitle
              n="01"
              title="Hizmetinizi seçin"
              sub={service ? `Seçilen: ${service.name} — ₺${service.price.toLocaleString("tr-TR")} · ${service.durationMin} dk` : "Süre ve fiyat bilgileri her hizmetin yanında"}
            />
            <ul className="divide-y divide-line border-y border-line">
              {services.map((s) => {
                const sel = s.id === serviceId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      className={`group flex w-full items-center gap-5 px-2 py-5 text-left transition-all duration-300 sm:px-4 ${
                        sel ? "bg-gold/[0.06]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${sel ? "border-gold text-gold" : "border-line text-gold/70 group-hover:border-gold/50"}`}>
                        <ServiceIcon name={s.icon} className="h-5 w-5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`font-display block text-xl font-light transition ${sel ? "text-gold-light" : "text-cream"}`}>{s.name}</span>
                        <span className="mt-0.5 block text-xs text-neutral-500">{s.durationMin} dakika</span>
                      </span>
                      <span className="font-display shrink-0 text-xl text-gold">₺{s.price.toLocaleString("tr-TR")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div key="s1" className="step-enter">
            <StepTitle n="02" title="Tarih ve saat" sub={`${service?.name} · ${service?.durationMin} dk · ₺${service?.price.toLocaleString("tr-TR")}`} />
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {quickDates.map((d) => {
                const sel = d.value === date;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDate(d.value)}
                    className={`rounded-lg border py-3 text-center transition-all duration-300 ${
                      sel ? "border-gold bg-gold text-ink" : "border-line text-neutral-300 hover:border-gold/50"
                    }`}
                  >
                    <span className="block text-[10px] font-medium uppercase tracking-[0.15em]">{d.label}</span>
                    <span className={`font-display block text-base ${sel ? "text-ink/80" : "text-neutral-500"}`}>{d.sub}</span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
              <span className="uppercase tracking-[0.2em]">Başka tarih</span>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-line bg-transparent px-3 py-1.5 text-sm text-cream outline-none transition focus:border-gold"
              />
            </label>

            {date && (
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Müsait Saatler</span>
                  <span className="gold-rule flex-1" />
                  <span className="font-display text-sm text-gold">{formatDateTR(date)}</span>
                </div>
                {slotsLoading ? (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-10 animate-pulse rounded-md bg-ash" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <p className="py-6 text-center text-sm text-neutral-500">Bu tarihte uygun saat bulunmuyor.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {slots.map((s) => {
                      const sel = s.time === time;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setTime(s.time)}
                          className={`font-display rounded-md border py-2.5 text-base transition-all duration-300 ${
                            !s.available
                              ? "cursor-not-allowed border-transparent text-neutral-700 line-through"
                              : sel
                                ? "border-gold bg-gold text-ink shadow-[0_0_20px_-6px_rgba(212,175,55,0.8)]"
                                : "border-line text-neutral-200 hover:border-gold/60"
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div key="s2" className="step-enter">
            <StepTitle n="03" title="İletişim bilgileriniz" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Ad Soyad" value={name} onChange={setName} placeholder="Adınız ve soyadınız" />
              <Field label="Telefon" value={phone} onChange={setPhone} placeholder="05XX XXX XX XX" type="tel" />
              <div className="sm:col-span-2">
                <Field label="Not (opsiyonel)" value={note} onChange={setNote} placeholder="Özel bir isteğiniz varsa" />
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-gold/20 bg-gold/[0.04] p-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Randevu Özeti</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Row label="Hizmet" value={service?.name ?? ""} />
                <Row label="Ücret" value={`₺${service?.price.toLocaleString("tr-TR")}`} />
                <Row label="Tarih" value={formatDateTR(date)} />
                <Row label="Saat" value={`${time} · ${service?.durationMin} dk`} />
              </dl>
              <p className="mt-5 flex items-center gap-2 text-[11px] text-neutral-500">
                <WhatsAppIcon className="h-4 w-4 text-gold" />
                Onayladığınızda randevu özetiniz WhatsApp üzerinden Taha Hacıhasan&apos;a iletilir.
              </p>
            </div>
          </div>
        )}

        {error && <p className="mt-6 border-l border-red-400/60 pl-4 text-sm text-red-300">{error}</p>}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition hover:text-cream disabled:invisible"
          >
            ← Geri
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} disabled={!canNext} className="gold-btn rounded-full px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em]">
              Devam
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={!canNext || submitting} className="gold-btn rounded-full px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em]">
              {submitting ? "Onaylanıyor…" : "Randevuyu Onayla"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-display text-sm tracking-[0.3em] text-gold">{n}</span>
      <div>
        <h3 className="font-display text-3xl font-light text-cream">{title}</h3>
        {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-2">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</dt>
      <dd className="text-right text-cream">{value}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border-0 border-b border-line bg-transparent py-2.5 text-base text-cream placeholder:text-neutral-700 outline-none transition focus:border-gold"
      />
    </label>
  );
}
