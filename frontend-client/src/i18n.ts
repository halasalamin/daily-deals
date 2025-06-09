import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "Daily Deals": "Daily Deals",
      "Welcome": "Welcome to our store!",
      "Sign Up": "Sign Up",
      "Login": "Login",
      "Language": "Language",
      "search_placeholder": "Search products...",
      "Laptops": "Laptops",
      "Computers": "Computers",
      "Accessories": "Accessories",
      "Phones": "Phones",
      "Tablets": "Tablets"
    }
  },
  ar: {
    translation: {
      "Daily Deals": "عروض يومية",
      "Welcome": "مرحبًا بك في متجرنا!",
      "Language": "اللغة",
      "search_placeholder": "ابحث عن المنتجات...",
      "Laptops": "أجهزة اللاب توب",
      "Computers": "أجهزة الكمبيوتر",
      "Accessories": "ملحقات",
      "Phones": "الهواتف",
      "Tablets": "الأجهزة اللوحية",
      "My Account": "حسابي",
      "Login": "تسجيل الدخول",
      "Sign Up": "إنشاء حساب",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: localStorage.getItem("language") || "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
