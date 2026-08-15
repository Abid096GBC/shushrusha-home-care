import { useState, type ReactNode } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Syringe } from "lucide-react";
import { INJECTION_PRICES, SITE, waLink } from "@/lib/site";

type Category = keyof typeof INJECTION_PRICES;
type RouteType = "IV" | "IM";

const CATEGORIES: Category[] = ["বড় / Adult", "বাচ্চা / Child"];
const ROUTES: { value: RouteType; label: string }[] = [
  { value: "IV", label: "IV — ইন্ট্রাভেনাস" },
  { value: "IM", label: "IM — ইন্ট্রামাসকুলার" },
];

const schema = z.object({
  medicine: z.string().trim().min(2, "ইনজেকশন / ওষুধের নাম লিখুন").max(120),
  location: z.string().trim().min(4, "আপনার ঠিকানা লিখুন").max(200),
});

export function InjectionModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [medicine, setMedicine] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [route, setRoute] = useState<RouteType | "">("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const price = category && route ? INJECTION_PRICES[category][route] : null;

  function reset() {
    setStep(1);
    setMedicine("");
    setCategory("");
    setRoute("");
    setLocation("");
    setError("");
  }

  function next() {
    setError("");
    if (step === 1) {
      if (medicine.trim().length < 2) return setError("ইনজেকশন / ওষুধের নাম লিখুন");
      return setStep(2);
    }
    if (step === 2) {
      if (!category) return setError("রোগীর ক্যাটাগরি নির্বাচন করুন");
      return setStep(3);
    }
    if (step === 3) {
      if (!route) return setError("ইনজেকশনের রুট নির্বাচন করুন");
      return setStep(4);
    }
    const parsed = schema.safeParse({ medicine, location });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "তথ্য পূরণ করুন");
    const age = category === "বাচ্চা / Child" ? "Child" : "Adult";
    const msg = `Hello Shushrusha, I need Injection Push. Medicine: ${parsed.data.medicine}, Age: ${age}, Type: ${route}, Location: ${parsed.data.location}. (আনুমানিক মূল্য: ${price} + কনভিনিয়েন্স চার্জ)`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setOpen(false);
    reset();
  }

  const chip = (active: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
      active
        ? "border-primary bg-secondary text-primary"
        : "border-border bg-background text-foreground hover:bg-secondary/60"
    }`;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Syringe className="size-5 text-primary" /> ইনজেকশন পুশ রিকোয়েস্ট
          </DialogTitle>
          <DialogDescription>ধাপে ধাপে তথ্য দিন — মূল্য সাথে সাথেই দেখতে পাবেন।</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div>
              <Label htmlFor="medicine">ধাপ ১ — ইনজেকশন / ওষুধের নাম</Label>
              <Input
                id="medicine"
                value={medicine}
                maxLength={120}
                onChange={(e) => setMedicine(e.target.value)}
                className="mt-1.5"
                placeholder="যেমন: Ceftriaxone 1gm"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <Label>ধাপ ২ — রোগীর ক্যাটাগরি</Label>
              <div className="mt-2 grid gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <Label>ধাপ ৩ — ইনজেকশন রুট</Label>
              <div className="mt-2 grid gap-2">
                {ROUTES.map((r) => (
                  <button key={r.value} type="button" className={chip(route === r.value)} onClick={() => setRoute(r.value)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <>
              <div>
                <Label htmlFor="location">ধাপ ৪ — আপনার ঠিকানা / এলাকা</Label>
                <Input
                  id="location"
                  value={location}
                  maxLength={200}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5"
                  placeholder="বাসা, রোড, এলাকা"
                />
              </div>
              <div>
                <Label htmlFor="referral">রেফারাল / প্রমো কোড (যদি থাকে)</Label>
                <Input
                  id="referral"
                  value={referral}
                  maxLength={40}
                  onChange={(e) => setReferral(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g., ROHIM50"
                />
              </div>
            </>
          )}

          {price && (
            <div className="rounded-xl border border-primary/20 bg-secondary p-4">
              <p className="text-sm text-muted-foreground">আনুমানিক সার্ভিস চার্জ</p>
              <p className="text-2xl font-bold text-primary">{price}</p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">{BILLING_NOTE}</p>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-2">
            {step > 1 && (
              <Button type="button" variant="softOutline" className="flex-1" onClick={() => setStep(step - 1)}>
                পেছনে
              </Button>
            )}
            <Button
              type="button"
              variant={step === 4 ? "whatsapp" : "hero"}
              className="flex-1"
              onClick={next}
            >
              {step === 4 ? "WhatsApp-এ পাঠান" : "পরবর্তী ধাপ"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
