import { useState, type ReactNode } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SERVICES, SITE, waLink } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "রোগীর নাম লিখুন").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{6,20}$/, "সঠিক ফোন নম্বর লিখুন"),
  address: z.string().trim().min(4, "ঠিকানা লিখুন").max(200),
  service: z.string().min(1, "সেবা নির্বাচন করুন"),
  datetime: z.string().min(1, "তারিখ ও সময় নির্বাচন করুন"),
  notes: z.string().trim().max(500).optional(),
});

export function BookingModal({ children, service }: { children: ReactNode; service?: string }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      service: service ?? String(fd.get("service") ?? ""),
      datetime: String(fd.get("datetime") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const msg = [
      `🩺 ${SITE.name} — সেবা বুকিং অনুরোধ`,
      `রোগীর নাম: ${d.name}`,
      `ফোন: ${d.phone}`,
      `ঠিকানা: ${d.address}`,
      `সেবা: ${d.service}`,
      `সময়: ${d.datetime}`,
      d.notes ? `বিশেষ নোট: ${d.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const field = "mt-1.5";
  const err = (k: string) =>
    errors[k] ? <p className="mt-1 text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">সেবা বুক করুন</DialogTitle>
          <DialogDescription>
            তথ্যগুলো পূরণ করুন — আমরা WhatsApp-এ আপনার অনুরোধ পাঠিয়ে দেব।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">রোগীর নাম</Label>
            <Input id="name" name="name" maxLength={80} className={field} placeholder="আপনার নাম" />
            {err("name")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input id="phone" name="phone" inputMode="tel" maxLength={20} className={field} placeholder="01XXXXXXXXX" />
              {err("phone")}
            </div>
            <div>
              <Label htmlFor="datetime">পছন্দের তারিখ ও সময়</Label>
              <Input id="datetime" name="datetime" type="datetime-local" className={field} />
              {err("datetime")}
            </div>
          </div>
          <div>
            <Label htmlFor="address">ঠিকানা / এলাকা</Label>
            <Input id="address" name="address" maxLength={200} className={field} placeholder="বাসা, রোড, এলাকা" />
            {err("address")}
          </div>
          {service ? (
            <div>
              <Label>সেবা</Label>
              <p className="mt-1.5 rounded-md border border-primary/20 bg-secondary px-3 py-2 text-sm font-medium text-primary">
                {service}
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="service">সেবা নির্বাচন করুন</Label>
              <select
                id="service"
                name="service"
                defaultValue=""
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  — নির্বাচন করুন —
                </option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title} ({s.titleEn})
                  </option>
                ))}
              </select>
              {err("service")}
            </div>
          )}

          <div>
            <Label htmlFor="notes">বিশেষ নোট</Label>
            <Textarea id="notes" name="notes" maxLength={500} className={field} placeholder="রোগীর অবস্থা বা অন্য কিছু জানানোর থাকলে লিখুন" />
            {err("notes")}
          </div>
          <Button type="submit" variant="whatsapp" size="lg" className="w-full">
            WhatsApp-এ অনুরোধ পাঠান
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
