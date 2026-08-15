export const SITE = {
  name: "শুশ্রূষা",
  nameEn: "Shushrusha",
  phone: "+8801628402283",
  phoneDisplay: "+880 1628-402283",
  whatsapp: "8801628402283",
  email: "mdadhassan123@gmail.com",
  areas: ["ঢাকা", "নারায়ণগঞ্জ", "গাজীপুর", "চট্টগ্রাম"],
};

export const SERVICES = [
  {
    id: "home-nursing",
    title: "হোম নার্সিং",
    titleEn: "Home Nursing",
    desc: "ইনজেকশন, ড্রিপ, স্যালাইন ও ড্রেসিং সেবা",
  },
  {
    id: "elderly-care",
    title: "বয়স্কদের যত্ন",
    titleEn: "Elderly Care",
    desc: "বয়স্কদের যত্ন ও সার্বক্ষণিক পরিচর্যা",
  },
  {
    id: "post-surgery",
    title: "অপারেশন পরবর্তী সেবা",
    titleEn: "Post-Surgery Care",
    desc: "অপারেশন পরবর্তী রিকভারি সেবা",
  },
  {
    id: "emergency",
    title: "জরুরি পরামর্শ",
    titleEn: "Emergency Guidance",
    desc: "দ্রুত ডাক্তারি পরামর্শ ও সাপোর্ট",
  },
];

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
