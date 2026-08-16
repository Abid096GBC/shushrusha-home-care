export const SITE = {
  name: "শুশ্রূষা",
  nameEn: "Shushrusha",
  phone: "+8801628402283",
  phoneDisplay: "+880 1628-402283",
  whatsapp: "8801628402283",
  email: "mdadhassan123@gmail.com",
  areas: ["ঢাকা", "নারায়ণগঞ্জ", "গাজীপুর", "চট্টগ্রাম"],
  conveyance: "গাড়ির ভাড়া / কনভিনিয়েন্স চার্জ: দূরত্বভেদে ৳৫০ থেকে শুরু।",
  conveyanceShort: "কনভিনিয়েন্স চার্জ: দূরত্ব অনুযায়ী সর্বনিম্ন ৳৫০+ যুক্ত হবে।",
};

export const BILLING_NOTE =
  "ℹ️ * সার্ভিস লোকেশন ও দূরত্বের ওপর ভিত্তি করে কনভিনিয়েন্স চার্জ (সর্বনিম্ন ৳৫০) চূড়ান্ত বিলে যুক্ত হতে পারে।";

export type Service = {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  price: string;
  priceNote?: string;
  primary?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "injection",
    title: "ইনজেকশন পুশ",
    titleEn: "Injection Push (IV / IM)",
    desc: "প্রশিক্ষিত নার্সের মাধ্যমে ঘরে বসেই নিরাপদ ইনজেকশন পুশ।",
    price: "৳৩০০ থেকে শুরু",
    priceNote: "বড়: ৳৩০০ (IV/IM) • বাচ্চা: ৳৫০০ (IV), ৳৫০০–৮০০ (IM)",
    primary: true,
  },
  {
    id: "suturing",
    title: "সেলাই করা ও সেলাই কাটা",
    titleEn: "Wound Suturing & Stitch Removal",
    desc: "শরীরের অংশ ও সেলাই সংখ্যা অনুযায়ী মূল্য নির্ধারিত হয়।",
    price: "৳৪০০ থেকে শুরু",
    priceNote: "প্রতি সেলাই ৳৫০ (আনুমানিক)",
    primary: true,
  },
  {
    id: "dressing",
    title: "ড্রেসিং সেবা",
    titleEn: "Wound Dressing",
    desc: "ক্ষত বা সার্জারি সেলাইয়ের ওপর ভিত্তি করে নির্ধারণযোগ্য।",
    price: "৳৩০০ থেকে শুরু",
    primary: true,
  },
  {
    id: "nebulizer",
    title: "নেবুলাইজার সেবা",
    titleEn: "Nebulizer",
    desc: "শ্বাসকষ্টে দ্রুত নেবুলাইজেশন সাপোর্ট, মেশিন রেন্টসহ।",
    price: "৳১০০ / বার",
    priceNote: "মেশিন রেন্ট: ৳৫০০ (৭ দিনের জন্য)",
    primary: true,
  },
  {
    id: "saline",
    title: "স্যালাইন ক্যানুলা ও IV সেটআপ",
    titleEn: "Saline & Cannula Setup",
    desc: "ক্যানুলা স্থাপন, স্যালাইন ও IV ফ্লুইড সেটআপ ঘরেই।",
    price: "মূল্য জানতে যোগাযোগ",
    primary: true,
  },
  {
    id: "vitals",
    title: "রক্তচাপ, ডায়াবেটিস ও অক্সিজেন পালস চেক",
    titleEn: "Health Vitals Check",
    desc: "প্রেসার, ব্লাড সুগার ও অক্সিজেন স্যাচুরেশন পরীক্ষা।",
    price: "৳১০০",
    primary: true,
  },
  {
    id: "post-surgery",
    title: "অপারেশন পরবর্তী বিশেষ প্যাকেজ",
    titleEn: "Post-Surgery Package",
    desc: "সেলাই ড্রেসিং, ভাইটাল মনিটরিং ও রিকভারি কেয়ার প্যাকেজ।",
    price: "কাস্টম প্যাকেজ",
    primary: true,
  },
  {
    id: "translator",
    title: "ফ্রি মেডিকেল ট্রান্সলেটর",
    titleEn: "Free Medical Translator",
    desc: "প্রেসক্রিপশন বা রিপোর্টের ছবি পাঠান — বাংলায় বুঝিয়ে দেব।",
    price: "সম্পূর্ণ ফ্রি",
  },
  {
    id: "caregiving",
    title: "প্রবীণদের সার্বক্ষণিক যত্ন",
    titleEn: "Caregiving / Elderly Care",
    desc: "দীর্ঘমেয়াদী কেয়ারগিভিং সেবা (সেকেন্ডারি অপশন)।",
    price: "দৈনিক / মাসিক ভিত্তিতে",
  },
];

export const INJECTION_PRICES = {
  "বড় / Adult": { IV: "৳৩০০", IM: "৳৩০০" },
  "বাচ্চা / Child": { IV: "৳৫০০", IM: "৳৫০০ – ৳৮০০" },
} as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Product = {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  unit: string;
};

export const PRODUCTS: Product[] = [
  { id: "gauze", name: "স্টেরাইল গজ", nameEn: "Sterile Gauze", price: 60, unit: "প্যাক" },
  { id: "hexisol", name: "হেক্সিসল হ্যান্ড রাব", nameEn: "Hexisol", price: 120, unit: "বোতল" },
  { id: "bandage", name: "ব্যান্ডেজ রোল", nameEn: "Bandage Roll", price: 80, unit: "পিস" },
  { id: "micropore", name: "মাইক্রোপোর টেপ", nameEn: "Micro-pore Tape", price: 70, unit: "রোল" },
  { id: "neb-mask", name: "নেবুলাইজার মাস্ক", nameEn: "Nebulizer Mask", price: 150, unit: "সেট" },
  { id: "bp-monitor", name: "ডিজিটাল বিপি মনিটর", nameEn: "BP Monitor", price: 2200, unit: "পিস" },
  { id: "dressing-kit", name: "ড্রেসিং কিট", nameEn: "Dressing Kit", price: 120, unit: "কিট" },
  { id: "glucometer", name: "গ্লুকোমিটার স্ট্রিপ", nameEn: "Glucometer Strips", price: 650, unit: "বক্স" },
];

export const DRESSING_KIT_PRICE = 120;
