import i18n from "i18next";
import Backend from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";
import translationEN from "@/locales/en/translation.json";
import translationVI from "@/locales/vi/translation.json";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      vi: { translation: translationVI },
    },
    lng: "en",
    fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
