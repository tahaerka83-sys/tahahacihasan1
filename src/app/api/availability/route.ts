import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services } from "@/db/schema";
import { generateSlots, slotOverlaps } from "@/lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date");

  if (!serviceId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
  }

  const [service] = await db.select().from(services).where(eq(services.id, serviceId));
  if (!service) return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });

  const booked = await db
    .select({ time: appointments.appointmentTime, duration: services.durationMin })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(eq(appointments.appointmentDate, date), eq(appointments.status, "confirmed")));

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots = generateSlots(date, service.durationMin).map((time) => {
    const [h, m] = time.split(":").map(Number);
    const past = date === todayStr && h * 60 + m <= nowMin;
    const taken = booked.some((b) => slotOverlaps(time, service.durationMin, b.time, b.duration));
    return { time, available: !past && !taken };
  });

  return NextResponse.json({ slots });
}
