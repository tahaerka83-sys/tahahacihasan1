// Çalışma saatleri: Pzt-Cmt 09:00-20:00, Pazar 11:00-18:00
export function getWorkingHours(dateStr: string): { open: number; close: number } | null {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0 = Pazar
  if (day === 0) return { open: 11, close: 18 };
  return { open: 9, close: 20 };
}

export function generateSlots(dateStr: string, durationMin: number): string[] {
  const hours = getWorkingHours(dateStr);
  if (!hours) return [];
  const slots: string[] = [];
  const step = 30;
  for (let m = hours.open * 60; m + durationMin <= hours.close * 60; m += step) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}

export function slotOverlaps(
  slot: string,
  durationMin: number,
  bookedTime: string,
  bookedDuration: number,
): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const s1 = toMin(slot);
  const e1 = s1 + durationMin;
  const s2 = toMin(bookedTime);
  const e2 = s2 + bookedDuration;
  return s1 < e2 && s2 < e1;
}
