import { db } from "@/db";
import { services } from "@/db/schema";

const seedServices = [
  {
    name: "Özel Saç Tasarımı & Kesim",
    description: "Yüz hatlarınıza ve tarzınıza göre kişiye özel tasarlanan kesim. Yıkama ve şekillendirme dahil.",
    durationMin: 45,
    price: 600,
    icon: "scissors",
    sortOrder: 1,
  },
  {
    name: "Sakal İnce İşçilik & Sakal Kesimi",
    description: "Ustura hassasiyetinde sakal hatları, şekillendirme ve bakım yağı uygulaması.",
    durationMin: 30,
    price: 400,
    icon: "razor",
    sortOrder: 2,
  },
  {
    name: "Saç & Sakal Kombin Bakım",
    description: "Kesim ve sakal işçiliğinin bir arada sunulduğu, uyumlu ve eksiksiz görünüm paketi.",
    durationMin: 60,
    price: 900,
    icon: "crown",
    sortOrder: 3,
  },
  {
    name: "VIP Saç & Cilt Bakım Seansı",
    description: "Saç derisi masajı, besleyici maske ve cilt temizliği ile yenilenme seansı.",
    durationMin: 40,
    price: 500,
    icon: "spa",
    sortOrder: 4,
  },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const [svc] = await db.select({ id: services.id }).from(services).limit(1);
  if (!svc) await db.insert(services).values(seedServices);
  seeded = true;
}
