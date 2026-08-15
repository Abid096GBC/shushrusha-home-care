import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  BadgeCheck,
  Check,
  Clock,
  HeartHandshake,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SERVICES, SITE, waLink } from "@/lib/site";
import heroImage from "@/assets/hero-care.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "শুশ্রূষা | ঘরে বসে বিশ্বস্ত হোম নার্সিং সেবা" },
      {
        name: "description",
        content:
          "শুশ্রূষা (Shushrusha) — প্রশিক্ষিত নার্সদের মাধ্যমে হোম নার্সিং, বয়স্কদের যত্ন, অপারেশন পরবর্তী সেবা ও ২৪/৭ জরুরি পরামর্শ। WhatsApp-এ সহজ বুকিং।",
      },
      { property: "og:title", content: "শুশ্রূষা | ঘরে বসে বিশ্বস্ত হোম নার্সিং সেবা" },
      {
        property: "og:description",
        content:
          "হোম নার্সিং, এল্ডারলি কেয়ার ও পোস্ট-সার্জারি কেয়ার — দ্রুত, নিরাপদ ও সাশ্রয়ী মূল্যে আপনার দরজায়।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SERVICE_ICONS = [Syringe, HeartHandshake, Activity, Stethoscope];

const PACKAGES = [
  {
    name: "এককালীন হোম ভিজিট",
    en: "Single Visit",
    price: "৳ ৮০০",
    unit: "/ ভিজিট",
    features: ["একবার নার্স ভিজিট", "ইনজেকশন / ড্রেসিং / স্যালাইন", "প্রাথমিক স্বাস্থ্য পরীক্ষা", "রিপোর্ট শেয়ারিং"],
    highlight: false,
  },
  {
    name: "সাপ্তাহিক কেয়ার",
    en: "Weekly Care",
    price: "৳ ৪,৫০০",
    unit: "/ সপ্তাহ",
    features: ["সপ্তাহে ৭ দিন ভিজিট", "নিয়মিত ভাইটাল মনিটরিং", "ডাক্তারি পরামর্শ সমন্বয়", "ফোনে ২৪/৭ সাপোর্ট"],
    highlight: true,
  },
  {
    name: "মাসিক নার্সিং কেয়ার",
    en: "Monthly Care",
    price: "৳ ১৬,০০০",
    unit: "/ মাস",
    features: ["ডেডিকেটেড নার্স", "দীর্ঘমেয়াদী রোগীর পরিচর্যা", "মাসিক হেলথ রিপোর্ট", "অগ্রাধিকার জরুরি সাপোর্ট"],
    highlight: false,
  },
];

const TRUST = [
  { icon: BadgeCheck, title: "যাচাইকৃত ও দক্ষ নার্স", desc: "প্রতিটি নার্স সার্টিফায়েড, অভিজ্ঞ ও ব্যাকগ্রাউন্ড ভেরিফায়েড।" },
  { icon: Clock, title: "২৪/৭ দ্রুত ডোরস্টেপ সেবা", desc: "কল করার ৬০ মিনিটের মধ্যে সেবা পৌঁছে দেওয়ার লক্ষ্য।" },
  { icon: Wallet, title: "সাশ্রয়ী ও স্বচ্ছ খরচ", desc: "কোনো লুকানো চার্জ নেই — আগেই জানবেন সম্পূর্ণ খরচ।" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section id="home" className="gradient-soft border-b border-border/60">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-4" /> বিশ্বস্ত হোম হেলথকেয়ার সার্ভিস
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
                ঘরে বসেই বিশ্বস্ত ও পেশাদার <span className="text-primary">স্বাস্থ্যসেবা</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                দ্রুত, নির্ভরযোগ্য ও যত্নশীল হোম নার্সিং এবং মেডিকেল সাপোর্ট — সরাসরি আপনার দরজায়।
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <BookingModal>
                  <Button variant="hero" size="lg">
                    সেবা বুক করুন
                  </Button>
                </BookingModal>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={waLink("Hello Shushrusha, I would like to book a service.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> WhatsApp Chat
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-accent" /> ৫০০+ পরিবারের আস্থা
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-accent" /> ২৪/৭ হটলাইন
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="বাসায় বয়স্ক রোগীর সেবা দিচ্ছেন একজন প্রশিক্ষিত নার্স"
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
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">আমাদের সেবাসমূহ</h2>
            <p className="mt-3 text-muted-foreground">
              হাসপাতালের মানসম্পন্ন সেবা এখন আপনার ঘরেই, প্রশিক্ষিত নার্সদের হাতে।
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[i] ?? Stethoscope;
              return (
                <article key={s.id} className="card-elevated p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-xs font-medium tracking-wide text-accent">{s.titleEn}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="border-y border-border/60 bg-card/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">সার্ভিস প্যাকেজ ও মূল্য</h2>
              <p className="mt-3 text-muted-foreground">স্বচ্ছ মূল্য — প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন।</p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {PACKAGES.map((p) => (
                <article
                  key={p.name}
                  className={`card-elevated relative p-7 ${p.highlight ? "ring-2 ring-primary" : ""}`}
                >
                  {p.highlight && (
                    <span className="gradient-primary absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                      জনপ্রিয়
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  <p className="text-xs font-medium tracking-wide text-accent">{p.en}</p>
                  <p className="mt-4 text-3xl font-bold text-primary">
                    {p.price}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{p.unit}</span>
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" /> {f}
                      </li>
                    ))}
                  </ul>
                  <BookingModal>
                    <Button variant={p.highlight ? "hero" : "softOutline"} className="mt-6 w-full">
                      এই প্যাকেজ নিন
                    </Button>
                  </BookingModal>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us / About */}
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
              <BookingModal>
                <Button variant="softOutline" size="lg">
                  সেবা বুক করুন
                </Button>
              </BookingModal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
