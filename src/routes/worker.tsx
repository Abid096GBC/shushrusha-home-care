import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Loader2, LockKeyhole, RefreshCw, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workerAction, workerFeed } from "@/lib/worker.functions";
import { TIER_LABEL, type BookingRow } from "@/lib/booking-types";

export const Route = createFileRoute("/worker")({
  head: () => ({
    meta: [
      { title: "নার্স ও ওয়ার্কার পোর্টাল | শুশ্রূষা" },
      {
        name: "description",
        content: "শুশ্রূষা নার্স ও হেলথ ওয়ার্কারদের জব ফিড, স্ট্যাটাস আপডেট ও আয়ের হিসাব এক জায়গায়।",
      },
      { property: "og:title", content: "নার্স ও ওয়ার্কার পোর্টাল | শুশ্রূষা" },
      { property: "og:description", content: "টিয়ার অনুযায়ী জব ফিড ও ওয়ালেট ড্যাশবোর্ড।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkerPage,
});

type Feed = Awaited<ReturnType<typeof workerFeed>>;

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* audio unavailable */
  }
}

function WorkerPage() {
  const feedFn = useServerFn(workerFeed);
  const actFn = useServerFn(workerAction);

  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [tier, setTier] = useState<"nurse" | "worker">("nurse");
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const openCount = useRef(0);

  const load = useCallback(
    async (c: string, p: string, silent = false) => {
      if (!silent) setBusy(true);
      try {
        const res = await feedFn({ data: { code: c, pin: p } });
        if (res.open.length > openCount.current && openCount.current > 0) beep();
        openCount.current = res.open.length;
        setFeed(res);
        setError("");
      } catch {
        if (!silent) setError("কোড বা পিন সঠিক নয়।");
      } finally {
        setBusy(false);
      }
    },
    [feedFn],
  );

  useEffect(() => {
    if (!feed) return;
    const t = window.setInterval(() => void load(code, pin, true), 20000);
    return () => window.clearInterval(t);
  }, [feed, code, pin, load]);

  async function act(b: BookingRow, action: "accept" | "transit" | "active" | "payment" | "complete", payment?: string) {
    const body: { code: string; pin: string; bookingId: string; action: typeof action; payment?: string } = {
      code,
      pin,
      bookingId: b.id,
      action,
    };
    if (payment) body.payment = payment;
    await actFn({ data: body });
    await load(code, pin, true);
  }

  if (!feed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="card-elevated w-full max-w-sm p-7">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <LockKeyhole className="size-6" />
          </span>
          <h1 className="mt-4 text-center text-xl font-bold text-foreground">নার্স ও ওয়ার্কার পোর্টাল</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">আপনার আইডি ও পিন দিয়ে প্রবেশ করুন।</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {(["nurse", "worker"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                  tier === t ? "border-primary bg-secondary text-primary" : "border-border text-foreground"
                }`}
              >
                {t === "nurse" ? "রেজিস্টার্ড নার্স (BSc/Diploma)" : "হেলথ ওয়ার্কার (MATS/Paramedic)"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="wcode">ওয়ার্কার আইডি</Label>
              <Input id="wcode" className="mt-1.5" placeholder="NUR-101" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="wpin">পিন</Label>
              <Input
                id="wpin"
                className="mt-1.5"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void load(code, pin)}
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <Button className="mt-4 w-full" variant="hero" disabled={busy} onClick={() => void load(code, pin)}>
            {busy && <Loader2 className="animate-spin" />} প্রবেশ করুন
          </Button>
        </div>
      </div>
    );
  }

  const w = feed.worker;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {w.name} <span className="text-sm font-medium text-muted-foreground">#{w.nurse_code}</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {TIER_LABEL[w.tier]} • ⭐ {w.rating} • {w.completed_visits} ভিজিট
            </p>
          </div>
          <Button variant="softOutline" size="sm" onClick={() => void load(code, pin)}>
            <RefreshCw /> রিফ্রেশ
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <section className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "আজকের আয়", value: `৳${feed.earnings.today}` },
            { label: "এই সপ্তাহে", value: `৳${feed.earnings.week}` },
            { label: "মোট আয়", value: `৳${feed.earnings.total}` },
            { label: "কমিশন হার", value: `${feed.earnings.pct}%` },
          ].map((s) => (
            <div key={s.label} className="card-elevated p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-primary">{s.value}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BadgeCheck className="size-5 text-primary" /> নতুন কাজ ({feed.open.length})
          </h2>
          <div className="mt-3 space-y-3">
            {feed.open.length === 0 && <p className="text-sm text-muted-foreground">এখন কোনো নতুন কাজ নেই।</p>}
            {feed.open.map((b) => (
              <article key={b.id} className="card-elevated flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    #{b.tracking_id} — {b.service}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.customer_name} • {b.address} • ৳{b.total ?? b.amount ?? 0}
                  </p>
                </div>
                <Button size="sm" variant="hero" onClick={() => void act(b, "accept")}>
                  কাজটি গ্রহণ করুন
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Wallet className="size-5 text-primary" /> আমার কাজ
          </h2>
          <div className="mt-3 space-y-3">
            {feed.mine.length === 0 && <p className="text-sm text-muted-foreground">কোনো কাজ নেই।</p>}
            {feed.mine.map((b) => (
              <article key={b.id} className="card-elevated p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    #{b.tracking_id} — {b.service}
                  </p>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {b.customer_name} • {b.phone} • {b.address}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  বিল ৳{b.total ?? b.amount ?? 0} • আপনার অংশ ৳{b.nurse_share ?? 0} • {b.payment_status}
                </p>
                {b.status !== "Completed" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="softOutline" onClick={() => void act(b, "transit")}>
                      যাত্রা শুরু
                    </Button>
                    <Button size="sm" variant="softOutline" onClick={() => void act(b, "active")}>
                      সেবা চলছে
                    </Button>
                    <Button size="sm" variant="softOutline" onClick={() => void act(b, "payment", "Cash Collected by Nurse")}>
                      ক্যাশ নেওয়া হয়েছে
                    </Button>
                    <Button size="sm" variant="softOutline" onClick={() => void act(b, "payment", "Paid via bKash")}>
                      বিকাশে পেমেন্ট
                    </Button>
                    <Button size="sm" variant="hero" onClick={() => void act(b, "complete")}>
                      সেবা সম্পন্ন
                    </Button>
                  </div>
                )}
                {b.rating && (
                  <p className="mt-2 text-xs text-accent">
                    কাস্টমার রেটিং: {"★".repeat(b.rating)} {b.review ? `— ${b.review}` : ""}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Star className="size-5 text-primary" /> কাস্টমার ফিডব্যাক
          </h2>
          <div className="mt-3 space-y-2">
            {feed.reviews.length === 0 && <p className="text-sm text-muted-foreground">এখনো কোনো রিভিউ নেই।</p>}
            {feed.reviews.map((r) => (
              <div key={r.id} className="card-elevated p-3 text-sm">
                <span className="text-accent">{"★".repeat(r.rating)}</span>{" "}
                <span className="text-muted-foreground">{r.service}</span>
                {r.review && <p className="mt-1 text-foreground">{r.review}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
