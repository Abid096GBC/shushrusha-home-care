import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BodyDiagram, StitchLine } from "@/components/BodyDiagram";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { BILLING_NOTE, DRESSING_KIT_PRICE, SERVICES } from "@/lib/site";
import { createBooking } from "@/lib/bookings.functions";

type Value = string | number | boolean;
type State = Record<string, Value>;
type Step = {
  title: string;
  render: (s: State, set: (patch: State) => void) => ReactNode;
  validate?: (s: State) => string | null;
};

const chip = (active: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
    active
      ? "border-primary bg-secondary text-primary"
      : "border-border bg-background text-foreground hover:bg-secondary/60"
  }`;

function Choice({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string; hint?: string }[];
  value: Value | undefined;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <button key={o.value} type="button" className={chip(value === o.value)} onClick={() => onSelect(o.value)}>
          {o.label}
          {o.hint && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

function MultiChoice({
  options,
  state,
  set,
}: {
  options: { key: string; label: string }[];
  state: State;
  set: (p: State) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={chip(state[o.key] === true)}
          onClick={() => set({ [o.key]: !state[o.key] })}
        >
          <span className="mr-2">{state[o.key] === true ? "☑" : "☐"}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <Button type="button" variant="softOutline" size="lg" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </Button>
      <span className="min-w-14 text-center text-3xl font-bold text-primary">{value}</span>
      <Button type="button" variant="softOutline" size="lg" onClick={() => onChange(Math.min(60, value + 1))}>
        +
      </Button>
    </div>
  );
}

function stepsFor(id: string): Step[] {
  switch (id) {
    case "injection":
      return [
        {
          title: "ইনজেকশন / ওষুধের নাম",
          validate: (s) => (String(s["medicine"] ?? "").trim().length < 2 ? "ওষুধের নাম লিখুন" : null),
          render: (s, set) => (
            <Input
              value={String(s["medicine"] ?? "")}
              maxLength={120}
              placeholder="যেমন: Ceftriaxone 1gm"
              onChange={(e) => set({ medicine: e.target.value })}
            />
          ),
        },
        {
          title: "রোগীর ক্যাটাগরি",
          validate: (s) => (s["category"] ? null : "ক্যাটাগরি নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["category"]}
              onSelect={(v) => set({ category: v })}
              options={[
                { value: "বড় / Adult", label: "বড় / Adult" },
                { value: "বাচ্চা / Child", label: "বাচ্চা / Child" },
              ]}
            />
          ),
        },
        {
          title: "ইনজেকশন রুট",
          validate: (s) => (s["route"] ? null : "রুট নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["route"]}
              onSelect={(v) => set({ route: v })}
              options={[
                { value: "IV", label: "IV — ইন্ট্রাভেনাস" },
                { value: "IM", label: "IM — ইন্ট্রামাসকুলার" },
              ]}
            />
          ),
        },
      ];
    case "suturing":
      return [
        {
          title: "শরীরের কোন অংশে?",
          validate: (s) => (s["body_region"] ? null : "শরীরের অংশ নির্বাচন করুন"),
          render: (s, set) => (
            <BodyDiagram value={String(s["body_region"] ?? "")} onChange={(v) => set({ body_region: v })} />
          ),
        },
        {
          title: "সেবার ধরন",
          validate: (s) => (s["suture_type"] ? null : "ধরন নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["suture_type"]}
              onSelect={(v) => set({ suture_type: v })}
              options={[
                { value: "সেলাই করা / Suturing", label: "সেলাই করা (Suturing)" },
                { value: "সেলাই কাটা / Stitch Removal", label: "সেলাই কাটা (Stitch Removal)" },
              ]}
            />
          ),
        },
        {
          title: "সেলাই সংখ্যা",
          validate: (s) => (Number(s["stitch_count"] ?? 0) > 0 ? null : "সেলাই সংখ্যা দিন"),
          render: (s, set) => (
            <div>
              <Counter value={Number(s["stitch_count"] ?? 0)} onChange={(n) => set({ stitch_count: n })} />
              <StitchLine count={Number(s["stitch_count"] ?? 0)} />
            </div>
          ),
        },
      ];
    case "dressing":
      return [
        {
          title: "ক্ষতের ধরন / সিভিয়ারিটি",
          validate: (s) => (s["severity"] ? null : "ক্ষতের ধরন নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["severity"]}
              onSelect={(v) => set({ severity: v })}
              options={[
                { value: "ছোট কাটা / ছোলা (Small)", label: "ছোট কাটা / ছোলা", hint: "৳৩০০ থেকে" },
                { value: "সেলাই ড্রেসিং (Medium)", label: "সেলাই ড্রেসিং", hint: "৳৪০০ থেকে" },
                { value: "বড় / পোড়া ক্ষত (Large)", label: "বড় / পোড়া ক্ষত", hint: "৳৬০০ থেকে" },
              ]}
            />
          ),
        },
        {
          title: "ড্রেসিং কিট যুক্ত করবেন?",
          render: (s, set) => (
            <button type="button" className={chip(s["dressing_kit"] === true)} onClick={() => set({ dressing_kit: !s["dressing_kit"] })}>
              <span className="mr-2">{s["dressing_kit"] === true ? "☑" : "☐"}</span>
              এই অর্ডারে ড্রেসিং কিট যোগ করুন (৳{DRESSING_KIT_PRICE})
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                গজ, ব্যান্ডেজ, মাইক্রোপোর টেপ ও অ্যান্টিসেপটিক
              </span>
            </button>
          ),
        },
      ];
    case "saline":
      return [
        {
          title: "ক্যানুলা প্রয়োজন?",
          validate: (s) => (s["cannula"] ? null : "একটি অপশন নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["cannula"]}
              onSelect={(v) => set({ cannula: v })}
              options={[
                { value: "নতুন ক্যানুলা প্রয়োজন", label: "নতুন ক্যানুলা প্রয়োজন" },
                { value: "ক্যানুলা আগে থেকেই আছে", label: "ক্যানুলা আগে থেকেই আছে" },
              ]}
            />
          ),
        },
        {
          title: "স্যালাইনের ধরন",
          validate: (s) => (s["saline_type"] ? null : "স্যালাইনের ধরন নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["saline_type"]}
              onSelect={(v) => set({ saline_type: v })}
              options={[
                { value: "Normal Saline", label: "Normal Saline (NS)" },
                { value: "DNS", label: "DNS" },
                { value: "Cholera Saline", label: "কলেরা স্যালাইন" },
              ]}
            />
          ),
        },
      ];
    case "nebulizer":
      return [
        {
          title: "সেবার মোড",
          validate: (s) => (s["mode"] ? null : "মোড নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["mode"]}
              onSelect={(v) => set({ mode: v })}
              options={[
                { value: "এককালীন ব্যবহার (৳১০০)", label: "এককালীন ব্যবহার", hint: "৳১০০ / বার" },
                { value: "মেশিন রেন্ট ৭ দিন (৳৫০০)", label: "৭ দিনের জন্য মেশিন রেন্ট", hint: "৳৫০০" },
              ]}
            />
          ),
        },
      ];
    case "vitals":
      return [
        {
          title: "কোন কোন পরীক্ষা দরকার?",
          validate: (s) =>
            s["bp"] || s["glucose"] || s["spo2"] ? null : "কমপক্ষে একটি পরীক্ষা নির্বাচন করুন",
          render: (s, set) => (
            <MultiChoice
              state={s}
              set={set}
              options={[
                { key: "bp", label: "রক্তচাপ (BP)" },
                { key: "glucose", label: "ব্লাড সুগার (Glucose)" },
                { key: "spo2", label: "অক্সিজেন স্যাচুরেশন (SpO2)" },
              ]}
            />
          ),
        },
      ];
    case "caregiving":
    case "post-surgery":
      return [
        {
          title: "কী ধরনের সহায়তা প্রয়োজন?",
          validate: (s) =>
            s["need_postop"] || s["need_stroke"] || s["need_tube"] || s["need_daily"]
              ? null
              : "কমপক্ষে একটি নির্বাচন করুন",
          render: (s, set) => (
            <MultiChoice
              state={s}
              set={set}
              options={[
                { key: "need_postop", label: "অপারেশন পরবর্তী যত্ন" },
                { key: "need_stroke", label: "স্ট্রোক রোগীর যত্ন" },
                { key: "need_tube", label: "ক্যাথেটার / রাইলস টিউব কেয়ার" },
                { key: "need_daily", label: "দৈনন্দিন সহায়তা (খাওয়ানো, গোসল, চলাফেরা)" },
              ]}
            />
          ),
        },
        {
          title: "সেবার সময়কাল",
          validate: (s) => (s["duration"] ? null : "সময়কাল নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["duration"]}
              onSelect={(v) => set({ duration: v })}
              options={[
                { value: "৬ ঘণ্টা শিফট", label: "৬ ঘণ্টা শিফট" },
                { value: "১২ ঘণ্টা শিফট", label: "১২ ঘণ্টা শিফট" },
                { value: "২৪ ঘণ্টা / সার্বক্ষণিক", label: "২৪ ঘণ্টা / সার্বক্ষণিক" },
                { value: "মাসিক প্যাকেজ", label: "মাসিক প্যাকেজ" },
              ]}
            />
          ),
        },
      ];
    case "translator":
      return [
        {
          title: "কী অনুবাদ করাতে চান?",
          validate: (s) =>
            String(s["terms"] ?? "").trim().length > 1 || s["has_photo"] === true
              ? null
              : "মেডিকেল টার্ম লিখুন অথবা ছবি পাঠানোর অপশন নির্বাচন করুন",
          render: (s, set) => (
            <div className="space-y-3">
              <Textarea
                value={String(s["terms"] ?? "")}
                maxLength={600}
                placeholder="প্রেসক্রিপশনের ওষুধ বা মেডিকেল টার্ম লিখুন"
                onChange={(e) => set({ terms: e.target.value })}
              />
              <button type="button" className={chip(s["has_photo"] === true)} onClick={() => set({ has_photo: !s["has_photo"] })}>
                <span className="mr-2">{s["has_photo"] === true ? "☑" : "☐"}</span>
                আমি প্রেসক্রিপশন / রিপোর্টের ছবি পাঠাতে চাই
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  টিকিট তৈরি হলে আমাদের টিম আপনাকে কল/মেসেজ দিয়ে ছবি সংগ্রহ করবে।
                </span>
              </button>
            </div>
          ),
        },
        {
          title: "উত্তর কীভাবে চান?",
          validate: (s) => (s["reply_pref"] ? null : "একটি অপশন নির্বাচন করুন"),
          render: (s, set) => (
            <Choice
              value={s["reply_pref"]}
              onSelect={(v) => set({ reply_pref: v })}
              options={[
                { value: "ভয়েস নোট", label: "🎙️ ভয়েস নোট" },
                { value: "বাংলা টেক্সট", label: "📝 বাংলা টেক্সট" },
              ]}
            />
          ),
        },
      ];
    case "product":
      return [
        {
          title: "পরিমাণ নির্বাচন করুন",
          validate: (s) => (Number(s["qty"] ?? 1) > 0 ? null : "পরিমাণ দিন"),
          render: (s, set) => (
            <div>
              <Counter value={Number(s["qty"] ?? 1)} onChange={(n) => set({ qty: Math.max(1, n) })} />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {String(s["product"] ?? "")} — একক মূল্য ৳{Number(s["unit_price"] ?? 0)}
              </p>
            </div>
          ),
        },
      ];
    default:
      return [
        {
          title: "আপনার প্রয়োজন লিখুন",
          validate: (s) => (String(s["requirement"] ?? "").trim().length > 3 ? null : "সংক্ষেপে লিখুন"),
          render: (s, set) => (
            <Textarea
              value={String(s["requirement"] ?? "")}
              maxLength={500}
              placeholder="আপনার প্রয়োজন সংক্ষেপে লিখুন"
              onChange={(e) => set({ requirement: e.target.value })}
            />
          ),
        },
      ];
  }
}

function estimate(id: string, s: State): string {
  switch (id) {
    case "injection": {
      const child = s["category"] === "বাচ্চা / Child";
      if (!child) return "৳৩০০";
      return s["route"] === "IM" ? "৳৫০০ – ৳৮০০" : "৳৫০০";
    }
    case "suturing": {
      const n = Number(s["stitch_count"] ?? 0);
      const base = s["suture_type"] === "সেলাই কাটা / Stitch Removal" ? 300 : 400;
      return `৳${base + n * 50} (আনুমানিক)`;
    }
    case "dressing": {
      const base = s["severity"] === "বড় / পোড়া ক্ষত (Large)" ? 600 : s["severity"] === "সেলাই ড্রেসিং (Medium)" ? 400 : 300;
      return `৳${base + (s["dressing_kit"] === true ? DRESSING_KIT_PRICE : 0)}`;
    }
    case "nebulizer":
      return s["mode"] === "মেশিন রেন্ট ৭ দিন (৳৫০০)" ? "৳৫০০" : "৳১০০";
    case "vitals": {
      return "৳১০০";
    }
    case "saline":
      return s["cannula"] === "নতুন ক্যানুলা প্রয়োজন" ? "৳৪০০ (আনুমানিক)" : "৳৩০০ (আনুমানিক)";
    case "translator":
      return "সম্পূর্ণ ফ্রি";
    case "product":
      return `৳${Number(s["unit_price"] ?? 0) * Number(s["qty"] ?? 1)}`;
    default:
      return "কাস্টম প্যাকেজ";
  }
}

const contactSchema = z.object({
  customer_name: z.string().trim().min(2, "রোগীর নাম লিখুন").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{6,20}$/, "সঠিক ফোন নম্বর লিখুন"),
  address: z.string().trim().min(4, "ঠিকানা লিখুন").max(240),
});

export function ServiceWizard({
  serviceId,
  children,
  extraTitle,
  presetDetails,
}: {
  serviceId: string;
  children: ReactNode;
  extraTitle?: string;
  presetDetails?: State;
}) {
  const service = SERVICES.find((s) => s.id === serviceId);
  const serviceLabel = extraTitle ?? `${service?.title ?? serviceId} (${service?.titleEn ?? ""})`.trim();
  const submit = useServerFn(createBooking);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>(presetDetails ?? {});
  const [contact, setContact] = useState({ name: "", phone: "", address: "", referral: "", notes: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState("");

  const custom = stepsFor(serviceId);
  const total = custom.length + 1;
  const price = estimate(serviceId, state);

  function set(patch: State) {
    setState((prev) => ({ ...prev, ...patch }));
    setError("");
  }

  function reset() {
    setStep(0);
    setState(presetDetails ?? {});
    setContact({ name: "", phone: "", address: "", referral: "", notes: "" });
    setError("");
    setTracking("");
    setBusy(false);
  }

  async function finish() {
    const parsed = contactSchema.safeParse({
      customer_name: contact.name,
      phone: contact.phone,
      address: contact.address,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "তথ্য পূরণ করুন");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const details: State = {};
      for (const [k, v] of Object.entries(state)) if (v !== "" && v !== false) details[k] = v;
      const res = await submit({
        data: {
          service: serviceLabel,
          customer_name: parsed.data.customer_name,
          phone: parsed.data.phone,
          address: parsed.data.address,
          details,
          body_region: state["body_region"] ? String(state["body_region"]) : undefined,
          stitch_count: state["stitch_count"] ? Number(state["stitch_count"]) : undefined,
          referral_code: contact.referral.trim() || undefined,
          price_estimate: price,
          amount: est.amount,
          notes: contact.notes.trim() || undefined,
        },
      });
      setTracking(res.trackingId);
    } catch {
      setError("অনুরোধ পাঠানো যায়নি — আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  function next() {
    if (step < custom.length) {
      const v = custom[step]?.validate?.(state) ?? null;
      if (v) return setError(v);
      setError("");
      return setStep(step + 1);
    }
    void finish();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {tracking ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
              <CheckCircle2 className="size-9" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-foreground">অনুরোধ সফলভাবে জমা হয়েছে!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              আমাদের কেয়ার টিম ৩০ মিনিটের মধ্যে আপনাকে কল করে নিশ্চিত করবে।
            </p>
            <div className="mt-5 rounded-2xl border border-primary/25 bg-secondary px-5 py-4">
              <p className="text-xs font-medium text-muted-foreground">আপনার ট্র্যাকিং আইডি</p>
              <p className="mt-1 text-2xl font-bold tracking-wide text-primary">#{tracking}</p>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Copy className="size-3.5" /> আইডিটি সংরক্ষণ করুন — স্ট্যাটাস জানতে কাজে লাগবে।
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              স্ট্যাটাস: <span className="text-accent">Pending — নিশ্চিতকরণের অপেক্ষায়</span>
            </p>
            <Button className="mt-5 w-full" variant="hero" onClick={() => setOpen(false)}>
              ঠিক আছে
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg">
                <AnimatedIcon id={serviceId} className="size-10" />
                {service?.title ?? "সেবা বুকিং"}
              </DialogTitle>
              <DialogDescription>
                ধাপ {step + 1} / {total} — {step < custom.length ? custom[step]?.title : "আপনার তথ্য"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="space-y-4">
              {step < custom.length ? (
                custom[step]?.render(state, set)
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="w-name">রোগীর নাম</Label>
                    <Input
                      id="w-name"
                      className="mt-1.5"
                      maxLength={80}
                      value={contact.name}
                      placeholder="আপনার নাম"
                      onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="w-phone">ফোন নম্বর</Label>
                      <Input
                        id="w-phone"
                        className="mt-1.5"
                        inputMode="tel"
                        maxLength={20}
                        value={contact.phone}
                        placeholder="01XXXXXXXXX"
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="w-ref">রেফারাল / প্রমো কোড (যদি থাকে)</Label>
                      <Input
                        id="w-ref"
                        className="mt-1.5"
                        maxLength={40}
                        value={contact.referral}
                        placeholder="e.g., ROHIM50"
                        onChange={(e) => setContact((c) => ({ ...c, referral: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="w-address">ঠিকানা / এলাকা</Label>
                    <Input
                      id="w-address"
                      className="mt-1.5"
                      maxLength={240}
                      value={contact.address}
                      placeholder="বাসা, রোড, এলাকা"
                      onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="w-notes">বিশেষ নোট</Label>
                    <Textarea
                      id="w-notes"
                      className="mt-1.5"
                      maxLength={600}
                      value={contact.notes}
                      placeholder="রোগীর অবস্থা বা পছন্দের সময় লিখুন"
                      onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-secondary px-4 py-3">
                <span className="text-sm text-muted-foreground">আনুমানিক মূল্য</span>
                <span className="text-lg font-bold text-primary">{price}</span>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                {BILLING_NOTE}
              </p>

              <div className="flex gap-2">
                {step > 0 && (
                  <Button type="button" variant="softOutline" className="flex-1" onClick={() => setStep(step - 1)}>
                    পেছনে
                  </Button>
                )}
                <Button type="button" variant="hero" className="flex-1" disabled={busy} onClick={next}>
                  {busy && <Loader2 className="animate-spin" />}
                  {step < custom.length ? "পরবর্তী ধাপ" : "বুকিং কনফার্ম করুন"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
