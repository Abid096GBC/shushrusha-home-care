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
