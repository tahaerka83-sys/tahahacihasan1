import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services } from "@/db/schema";
import { generateSlots, slotOverlaps } from "@/lib/slots";

export const dynamic = "force-dynamic";

type Body = {
  serviceId?: number;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  note?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const serviceId = Number(body.serviceId);
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const note = body.note ? String(body.note).trim().slice(0, 500) : null;

  if (!serviceId) return NextResponse.json({ error: "Lütfen bir hizmet seçin" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Geçersiz tarih" }, { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ error: "Geçersiz saat" }, { status: 400 });
  if (name.length < 3) return NextResponse.json({ error: "Lütfen ad soyad girin" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Geçerli bir telefon numarası girin" }, { status: 400 });

  const [service] = await db.select().from(services).where(eq(services.id, serviceId));
  if (!service) return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date + "T00:00:00") < today) {
    return NextResponse.json({ error: "Geçmiş bir tarih seçilemez" }, { status: 400 });
  }

  if (!generateSlots(date, service.durationMin).includes(time)) {
    return NextResponse.json({ error: "Bu saat çalışma saatleri dışında" }, { status: 400 });
  }

  const booked = await db
    .select({ time: appointments.appointmentTime, duration: services.durationMin })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(eq(appointments.appointmentDate, date), eq(appointments.status, "confirmed")));

  if (booked.some((b) => slotOverlaps(time, service.durationMin, b.time, b.duration))) {
    return NextResponse.json({ error: "Bu saat az önce dolmuş. Lütfen başka bir saat seçin." }, { status: 409 });
  }

  try {
    const [created] = await db
      .insert(appointments)
      .values({ serviceId, appointmentDate: date, appointmentTime: time, customerName: name, customerPhone: phone, note })
      .returning();

    return NextResponse.json({
      appointment: created,
      code: `TH-${String(created.id).padStart(4, "0")}`,
      service: service.name,
    });
  } catch {
    return NextResponse.json({ error: "Bu saat az önce dolmuş. Lütfen başka bir saat seçin." }, { status: 409 });
  }
}
