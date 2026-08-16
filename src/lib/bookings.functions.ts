import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  service: z.string().trim().min(2).max(120),
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(20),
  address: z.string().trim().min(4).max(240),
  details: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  body_region: z.string().trim().max(60).optional(),
  stitch_count: z.number().int().min(0).max(200).optional(),
  referral_code: z.string().trim().max(40).optional(),
  price_estimate: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(600).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;

export type BookingRow = {
  id: string;
  tracking_id: string;
  service: string;
  customer_name: string;
  phone: string;
  address: string;
  details: Record<string, unknown>;
  body_region: string | null;
  stitch_count: number | null;
  referral_code: string | null;
  price_estimate: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export const STATUSES = ["Pending", "Confirmed", "Nurse Assigned", "Completed"] as const;

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingInput) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tracking = `SHU-${Math.floor(1000 + Math.random() * 8999)}`;
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        tracking_id: tracking,
        service: data.service,
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        details: data.details,
        body_region: data.body_region ?? null,
        stitch_count: data.stitch_count ?? null,
        referral_code: data.referral_code || null,
        price_estimate: data.price_estimate ?? null,
        notes: data.notes ?? null,
      })
      .select("tracking_id")
      .single();
    if (error) throw new Error(error.message);
    return { trackingId: row.tracking_id as string };
  });

function checkPassword(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) throw new Error("Invalid admin password");
}

export const adminListBookings = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) =>
    z.object({ password: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as BookingRow[];
  });

export const adminUpdateStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; id: string; status: string }) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().uuid(),
        status: z.enum(STATUSES),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
