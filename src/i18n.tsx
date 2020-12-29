import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useState } from "react";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'de'],
        ns: ['common', 'map', 'menu', 'products'],

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        },

        backend: {
            loadPath: '/food-logger/lang/{{lng}}/{{ns}}.json',
        },

        react: {
            wait: true
        }
    })

export const useI18N = () => {
    const [loading, setLoading] = useState(true)
    i18n.on('initialized', x => setLoading(false))
    return loading
}

export default i18n