import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  BadgeCheck,
  Camera,
  Check,
  Clock,
  Droplets,
  Gift,
  HeartHandshake,
  Info,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  
  Wallet,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { InjectionModal } from "@/components/InjectionModal";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SERVICES, SITE, waLink } from "@/lib/site";
import heroImage from "@/assets/hero-care.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "শুশ্রূষা | ইনজেকশন, ড্রেসিং ও নেবুলাইজার হোম সার্ভিস" },
      {
        name: "description",
        content:
          "শুশ্রূষা (Shushrusha) — ঘরে বসে ইনজেকশন পুশ (৳৩০০ থেকে), ড্রেসিং, নেবুলাইজার, স্যালাইন ক্যানুলা ও ভাইটাল চেক। ফ্রি প্রেসক্রিপশন গাইডেন্স ও WhatsApp বুকিং।",
      },
      { property: "og:title", content: "শুশ্রূষা | ইনস্ট্যান্ট হোম নার্সিং প্রসিডিউর সার্ভিস" },
      {
        property: "og:description",
        content:
          "ইনজেকশন পুশ, ড্রেসিং, নেবুলাইজার, IV ক্যানুলা ও হেলথ ভাইটাল চেক — স্বচ্ছ মূল্যে আপনার দরজায়।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SERVICE_ICONS: Record<string, typeof Syringe> = {
  injection: Syringe,
  dressing: Activity,
  nebulizer: Wind,
  saline: Droplets,
  vitals: Stethoscope,
  "post-surgery": ShieldCheck,
  caregiving: HeartHandshake,
};

const TRUST = [
  { icon: BadgeCheck, title: "যাচাইকৃত ও দক্ষ নার্স", desc: "প্রতিটি নার্স সার্টিফায়েড, অভিজ্ঞ ও ব্যাকগ্রাউন্ড ভেরিফায়েড।" },
  { icon: Clock, title: "২৪/৭ দ্রুত ডোরস্টেপ সেবা", desc: "কল করার ৬০ মিনিটের মধ্যে সেবা পৌঁছে দেওয়ার লক্ষ্য।" },
  { icon: Wallet, title: "সাশ্রয়ী ও স্বচ্ছ খরচ", desc: "কোনো লুকানো চার্জ নেই — আগেই জানবেন সম্পূর্ণ খরচ।" },
];

const PRESCRIPTION_MSG =
  "Hello Shushrusha, I need FREE prescription guidance. I am sending a photo of my prescription/medicine.";

function Home() {
  const primary = SERVICES.filter((s) => s.primary);
  const secondary = SERVICES.filter((s) => !s.primary);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section id="home" className="gradient-soft border-b border-border/60">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold text-primary">
                <Syringe className="size-4" /> ইনস্ট্যান্ট অন-ডিমান্ড নার্সিং প্রসিডিউর
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
                ঘরে বসেই <span className="text-primary">ইনজেকশন, ড্রেসিং ও নেবুলাইজার</span> সেবা
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                প্রশিক্ষিত নার্সের মাধ্যমে দ্রুত ও নিরাপদ মেডিকেল প্রসিডিউর — স্বচ্ছ মূল্যে, সরাসরি আপনার দরজায়।
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <InjectionModal>
                  <Button variant="hero" size="lg">
                    <Syringe /> ইনজেকশন পুশ বুক করুন
                  </Button>
                </InjectionModal>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={waLink("Hello Shushrusha, I would like to book a service.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> WhatsApp Chat
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="বাসায় রোগীকে ইনজেকশন ও নার্সিং সেবা দিচ্ছেন একজন প্রশিক্ষিত নার্স"
                width={1280}
                height={1024}
                className="w-full rounded-3xl border border-border object-cover shadow-glow"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">সেবা ও নির্ধারিত মূল্য</h2>
            <p className="mt-3 text-muted-foreground">
              প্রতিটি প্রসিডিউরের মূল্য আগেই জানুন — কোনো লুকানো চার্জ নেই।
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {primary.map((s) => {
              const Icon = SERVICE_ICONS[s.id] ?? Stethoscope;
              return (
                <article key={s.id} className="card-elevated flex flex-col p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-xs font-medium tracking-wide text-accent">{s.titleEn}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <p className="mt-4 text-xl font-bold text-primary">{s.price}</p>
                  {s.priceNote && <p className="mt-1 text-xs text-muted-foreground">{s.priceNote}</p>}
                  <div className="mt-5">
                    {s.id === "injection" ? (
                      <InjectionModal>
                        <Button variant="hero" className="w-full">
                          রিকোয়েস্ট করুন
                        </Button>
                      </InjectionModal>
                    ) : (
                      <BookingModal service={`${s.title} (${s.titleEn})`}>
                        <Button variant="softOutline" className="w-full">
                          বুক করুন
                        </Button>
                      </BookingModal>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {secondary.length > 0 && (
            <div className="mt-8 grid gap-5">
              {secondary.map((s) => {
                const Icon = SERVICE_ICONS[s.id] ?? HeartHandshake;
                return (
                  <article
                    key={s.id}
                    className="card-elevated flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary">
                        <Icon className="size-6" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                        <p className="text-xs font-medium tracking-wide text-accent">{s.titleEn}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                        <p className="mt-1 text-sm font-semibold text-primary">{s.price}</p>
                      </div>
                    </div>
                    <BookingModal service={`${s.title} (${s.titleEn})`}>
                      <Button variant="softOutline">আলোচনা করুন</Button>
                    </BookingModal>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Free prescription guidance */}
        <section id="packages" className="border-y border-border/60 bg-card/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="card-elevated relative overflow-hidden p-8 md:p-10">
              <span className="gradient-primary absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                সম্পূর্ণ ফ্রি
              </span>
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <Gift className="size-6 text-accent" /> ফ্রি প্রেসক্রিপশন গাইডেন্স
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    ডাক্তারের প্রেসক্রিপশন বুঝতে সমস্যা হচ্ছে? ওষুধের ছবি তুলুন এবং আমাদের ওয়াটসঅ্যাপে
                    পাঠান—আমাদের টিম সম্পূর্ণ বিনামূল্যে আপনাকে বিস্তারিত বুঝিয়ে দেবে।
                  </p>
                </div>
                <Button asChild variant="whatsapp" size="lg" className="shrink-0">
                  <a href={waLink(PRESCRIPTION_MSG)} target="_blank" rel="noopener noreferrer">
                    <Camera /> প্রেসক্রিপশন আপলোড করুন (WhatsApp)
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" /> {SITE.conveyance}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">কেন শুশ্রূষা?</h2>
            <p className="mt-3 text-muted-foreground">
              আমরা পরিবারের মতো যত্ন নিই — পেশাদারিত্ব ও মমতার সমন্বয়ে।
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TRUST.map((t) => (
              <article key={t.title} className="card-elevated p-7 text-center">
                <span className="gradient-primary mx-auto flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
                  <t.icon className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </article>
            ))}
          </div>

          <div className="card-elevated mt-12 flex flex-col items-center gap-5 p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-xl font-bold text-foreground">জরুরি প্রয়োজনে এখনই কল করুন</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                আমাদের কেয়ার টিম ২৪ ঘণ্টা আপনার পাশে আছে।
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <a href={`tel:${SITE.phone}`}>
                  <Phone /> {SITE.phoneDisplay}
                </a>
              </Button>
              <InjectionModal>
                <Button variant="softOutline" size="lg">
                  <Check /> ইনজেকশন পুশ রিকোয়েস্ট
                </Button>
              </InjectionModal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
