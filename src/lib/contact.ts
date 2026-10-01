export const PHONE_DISPLAY = "0531 839 14 63";
export const PHONE_TEL = "tel:05318391463";
export const WHATSAPP_NUMBER = "905318391463";

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildAppointmentMessage(p: {
  code?: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  name: string;
  phone: string;
  note?: string;
}) {
  const lines = [
    "Merhaba Taha Bey, randevu talebim aşağıdadır:",
    "",
    `✂️ Hizmet: ${p.service}`,
    `📅 Tarih: ${p.date}`,
    `⏰ Saat: ${p.time} (${p.duration} dk)`,
    `💰 Ücret: ₺${p.price.toLocaleString("tr-TR")}`,
    "",
    `👤 Ad Soyad: ${p.name}`,
    `📞 Telefon: ${p.phone}`,
  ];
  if (p.note) lines.push(`📝 Not: ${p.note}`);
  if (p.code) lines.push("", `Randevu Kodu: ${p.code}`);
  lines.push("", "Onayınızı bekliyorum, teşekkürler.");
  return lines.join("\n");
}
