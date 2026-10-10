"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ur";

const translations = {
  en: {
    // Navigation
    home: "Home",
    search: "Search",
    check: "Check",
    meds: "Meds",
    profile: "Profile",

    // Auth
    signIn: "Sign In",
    signUp: "Register",
    login: "Login",
    register: "Create Account",
    email: "Email",
    password: "Password",
    name: "Full Name",
    phone: "Phone",

    // Landing
    heroTitle: "Check Your Medicines Before You Take",
    heroSubtitle: "PillWise instantly checks dangerous interactions between your medicines. Protect yourself and your family from preventable adverse reactions.",
    getStarted: "Get Started Free",
    seeHowItWorks: "See How It Works",
    features: "Features",
    howItWorks: "How It Works",
    statistics: "Statistics",

    // Home
    welcomeBack: "Welcome back",
    hello: "Hello",
    safetyScore: "Safety Score",
    myMedicines: "My Medicines",
    warnings: "Warnings",
    family: "Family",
    checkInteractions: "Check Interactions",
    manageMedicines: "Manage your current medicines list",
    browseMedicines: "Search medicines in our database",
    healthTip: "Health Tip",

    // Common
    add: "Add",
    remove: "Remove",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    loading: "Loading...",
    share: "Share",
    export: "Export",
    print: "Print",

    // Checker
    interactionChecker: "Interaction Checker",
    selectMedicines: "Select Medicines",
    checkNow: "Check Now",
    safe: "Safe",
    mild: "Mild",
    dangerous: "Dangerous",
    dangerousFound: "DANGEROUS INTERACTION!",
    consultDoctor: "Consult your doctor immediately",

    // Medicine
    purpose: "Purpose",
    dosage: "Dosage",
    sideEffects: "Side Effects",
    addToMyMedicines: "Add to My Medicines",
    addedToMedicines: "Added to My Medicines",
    knownInteractions: "Known Interactions",

    // Disclaimer
    disclaimer: "This is not medical advice. Always consult a healthcare professional.",

    // Emergency / Red Alert
    redAlert: "Red Alert",
    redAlertTitle: "EMERGENCY: Dangerous Interactions",
    redAlertSubtitle: "Show this screen to your doctor or pharmacist now",
    noDangerous: "No dangerous interactions found",
    dismiss: "Dismiss",

    // Printable card
    printCard: "Print Card",
    largePrintCard: "Large-Print Medicine Card",
    printInstructions: "Tape this to your fridge or keep it in your wallet",

    // Body systems
    bodySystems: "By Body System",
    bodySystemSubtitle: "Where these medicines could cause harm",

    // Safer substitutes
    saferSubstitutes: "Safer Substitutes",
    noSubstitutes: "No safer substitute found in this category",

    // Offline
    offlineMode: "Offline",
    offlineNotice: "You are offline. Showing the last saved check.",
    cachedResult: "Saved check",
  },
  ur: {
    // Navigation
    home: "ہوم",
    search: "تلاش",
    check: "چیک",
    meds: "ادویات",
    profile: "پروفائل",

    // Auth
    signIn: "سائن ان",
    signUp: "رجسٹر کریں",
    login: "لاگ ان",
    register: "اکاؤنٹ بنائیں",
    email: "ای میل",
    password: "پاس ورڈ",
    name: "پورا نام",
    phone: "فون",

    // Landing
    heroTitle: "لینے سے پہلے اپنی ادویات چیک کریں",
    heroSubtitle: "پل وائیز آپ کی ادویات کے خطرناک باہمی اثرات کی فوراً جانچ کرتا ہے۔ اپنے اور اپنے خاندان کو ناقابلِ روک متضاد کے اثرات سے بچائیں۔",
    getStarted: "مفت شروع کریں",
    seeHowItWorks: "کیسے کام کرتا ہے دیکھیں",
    features: "خصوصیات",
    howItWorks: "کیسے کام کرتا ہے",
    statistics: "شماریات",

    // Home
    welcomeBack: "خوش آمدید",
    hello: "ہیلو",
    safetyScore: "حفاظتی اسکور",
    myMedicines: "میری ادویات",
    warnings: "تنبیہات",
    family: "خاندان",
    checkInteractions: "اثرائے چیک کریں",
    manageMedicines: "اپنی موجودہ ادویات کی فہرست منظم کریں",
    browseMedicines: "ہمارے ڈیٹابیس میں ادویات تلاش کریں",
    healthTip: "صحت مشورہ",

    // Common
    add: "شامل کریں",
    remove: "ہٹائیں",
    cancel: "منسوخ",
    save: "محفوظ کریں",
    back: "واپس",
    loading: "لوڈ ہو رہا ہے...",
    share: "شیئر",
    export: "ایکسپورٹ",
    print: "پرنٹ",

    // Checker
    interactionChecker: "اثرائے چیکر",
    selectMedicines: "ادویات منتخب کریں",
    checkNow: "ابھی چیک کریں",
    safe: "محفوظ",
    mild: "ہلکا",
    dangerous: "خطرناک",
    dangerousFound: "خطرناک باہمی اثر!",
    consultDoctor: "فوراً ڈاکٹر سے رجوع کریں",

    // Medicine
    purpose: "مقصد",
    dosage: "خوراک",
    sideEffects: "ثانثی اثرات",
    addToMyMedicines: "میری ادویات میں شامل کریں",
    addedToMedicines: "میری ادویات میں شامل ہو گیا",
    knownInteractions: "معلوم باہمی اثرات",

    // Disclaimer
    disclaimer: "یہ طبی مشورہ نہیں ہے۔ ہمیشہ کسی ہیلث کیئر پروفیشنل سے رجوع کریں۔",

    // Emergency / Red Alert
    redAlert: "سرخ انتباہ",
    redAlertTitle: "ایمرجنسی: خطرناک باہمی اثرات",
    redAlertSubtitle: "اس سکرین کو اپنے ڈاکٹر یا صيدلی کو دکھائیں",
    noDangerous: "کوئی خطرناک باہمی اثر نہیں ملا",
    dismiss: "بند کریں",

    // Printable card
    printCard: "کارڈ پرنٹ کریں",
    largePrintCard: "بڑے حروف والی ادویات کا کارڈ",
    printInstructions: "اسے فریج پر چسپاں کریں یا اپنے پارس میں رکھیں",

    // Body systems
    bodySystems: "جسمانی نظام کے مطابق",
    bodySystemSubtitle: "یہ ادویات کس حصے کو نقصان پہنچا سکتی ہیں",

    // Safer substitutes
    saferSubstitutes: "محفوظ متبادل",
    noSubstitutes: "اس زمرے میں کوئی محفوظ متبادل نہیں ملا",

    // Offline
    offlineMode: "آف لائن",
    offlineNotice: "آپ آف لائن ہیں۔ آخری محفوظ شدہ چیک دکھائی جا رہی ہے۔",
    cachedResult: "محفوظ شدہ چیک",
  },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pillwise-lang") as Language;
    if (saved) {
      setLangState(saved);
      applyLang(saved);
    }
  }, []);

  const applyLang = (l: Language) => {
    if (l === "ur") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ur";
      document.documentElement.classList.add("urdu");
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
      document.documentElement.classList.remove("urdu");
    }
  };

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("pillwise-lang", l);
    applyLang(l);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      className="glass-card px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white transition-all flex items-center gap-2"
      title={lang === "en" ? "اردو میں تبدیل کریں" : "Switch to English"}
    >
      <span>🌐</span> {lang === "en" ? "اردو" : "English"}
    </button>
  );
}
