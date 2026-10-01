import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  durationMin: integer("duration_min").notNull(),
  price: integer("price").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    appointmentDate: date("appointment_date").notNull(),
    appointmentTime: varchar("appointment_time", { length: 5 }).notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    note: text("note"),
    status: text("status").notNull().default("confirmed"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("appointments_slot_idx").on(t.appointmentDate, t.appointmentTime)],
);

export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
