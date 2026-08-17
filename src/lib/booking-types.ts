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
  nurse_id: string | null;
  payment_status: string;
  amount: number | null;
  nurse_share: number | null;
  platform_share: number | null;
  created_at: string;
};

export type NurseRow = {
  id: string;
  nurse_code: string;
  name: string;
  phone: string;
  rating: number;
  completed_visits: number;
  status: string;
  specialties: string[];
  area: string | null;
};

export type CatalogRow = {
  id: string;
  item_key: string;
  kind: string;
  name: string;
  name_en: string;
  unit: string;
  price: number;
  active: boolean;
};

export const STATUSES = ["Pending", "Confirmed", "Nurse Assigned", "In Transit", "Completed"] as const;
export const PAYMENT_STATUSES = ["Unpaid", "Paid via bKash", "Cash Collected by Nurse"] as const;
export const NURSE_STATUSES = ["Available", "On-Duty", "Off-Duty"] as const;
