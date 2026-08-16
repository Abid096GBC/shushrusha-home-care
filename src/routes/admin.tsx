import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LockKeyhole, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminListBookings, adminUpdateStatus } from "@/lib/bookings.functions";
import { STATUSES, type BookingRow } from "@/lib/booking-types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ড্যাশবোর্ড | শুশ্রূষা বুকিং ম্যানেজমেন্ট" },
      {
        name: "description",
        content: "শুশ্রূষা অ্যাডমিন প্যানেল — হোম নার্সিং বুকিং, রেফারাল কোড ও সার্ভিস স্ট্যাটাস ম্যানেজ করুন।",
      },
      { property: "og:title", content: "শুশ্রূষা অ্যাডমিন ড্যাশবোর্ড" },
      { property: "og:description", content: "বুকিং তালিকা ও স্ট্যাটাস আপডেট করার নিরাপদ প্যানেল।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUS_STYLE: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  Confirmed: "bg-secondary text-primary",
  "Nurse Assigned": "bg-accent/20 text-accent-foreground",
  Completed: "bg-whatsapp/20 text-foreground",
};

function AdminPage() {
  const list = useServerFn(adminListBookings);
  const update = useServerFn(adminUpdateStatus);

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(pw: string) {
    setBusy(true);
    setError("");
    try {
      const data = await list({ data: { password: pw } });
      setRows(data);
      setAuthed(true);
    } catch {
      setError("পাসওয়ার্ড সঠিক নয়।");
      setAuthed(false);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await update({ data: { password, id, status } });
    } catch {
      setError("স্ট্যাটাস আপডেট করা যায়নি।");
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="card-elevated w-full max-w-sm p-7">
          <span className="gradient-primary flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
            <LockKeyhole className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
          <p className="mt-1 text-sm text-muted-foreground">শুশ্রূষা বুকিং ড্যাশবোর্ডে প্রবেশ করুন।</p>
          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void load(password);
            }}
          >
            <div>
              <Label htmlFor="pw">পাসওয়ার্ড</Label>
              <Input
                id="pw"
                type="password"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} প্রবেশ করুন
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">বুকিং ড্যাশবোর্ড</h1>
            <p className="text-sm text-muted-foreground">মোট {rows.length} টি অনুরোধ</p>
          </div>
          <Button variant="softOutline" onClick={() => void load(password)} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <RefreshCw />} রিফ্রেশ
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="card-elevated mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-secondary/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service / Details</th>
                <th className="px-4 py-3">Region / Stitches</th>
                <th className="px-4 py-3">Referral</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">#{r.tracking_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-GB")}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{r.customer_name}</p>
                    <a href={`tel:${r.phone}`} className="text-xs text-accent">
                      {r.phone}
                    </a>
                    <p className="text-xs text-muted-foreground">{r.address}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{r.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(r.details ?? {})
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(" • ")}
                    </p>
                    {r.price_estimate && (
                      <p className="text-xs font-semibold text-primary">{r.price_estimate}</p>
                    )}
                    {r.notes && <p className="text-xs text-muted-foreground">📝 {r.notes}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {r.body_region ?? "—"}
                    {r.stitch_count ? ` • ${r.stitch_count} সেলাই` : ""}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">
                    {r.referral_code ?? "None"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLE[r.status] ?? "bg-muted"
                      }`}
                    >
                      {r.status}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void setStatus(r.id, s)}
                          className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                            r.status === s
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    এখনো কোনো বুকিং নেই।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
