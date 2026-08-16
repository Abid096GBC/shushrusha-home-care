export type BookingRow = {
  id: string;
  tracking_id: string;
  service: string;
  customer_name: string;
  phone: string;
  address: string;
  details: Record<string, string | number | boolean>;
  body_region: string | null;
  stitch_count: number | null;
  referral_code: string | null;
  price_estimate: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export const STATUSES = ["Pending", "Confirmed", "Nurse Assigned", "Completed"] as const;
