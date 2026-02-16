"use client";

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        nav_home: "Home",
        nav_news: "News",
        nav_dashboard: "Dashboard",
        nav_subscription: "Subscription",
        nav_login: "Login",
        nav_signup: "Signup",
        hero_title: "Your Daily Stream of Knowledge",
        hero_subtitle: "Stay updated with the latest news, powered by AI curation.",
        latest_news: "Latest News",
        trending: "Trending",
        read_more: "Read Full",
        ai_summary: "Summarize with AI",
        loading: "Loading..."
    },
    hi: {
        nav_home: "होम",
        nav_news: "समाचार",
        nav_dashboard: "डैशबोर्ड",
        nav_subscription: "सदस्यता",
        nav_login: "लॉगिन",
        nav_signup: "साइन अप",
        hero_title: "ज्ञान की आपकी दैनिक धारा",
        hero_subtitle: "AI क्यूरेशन द्वारा संचालित नवीनतम समाचारों से अपडेट रहें।",
        latest_news: "ताज़ा ख़बरें",
        trending: "ट्रेंडिंग",
        read_more: "पूरा पढ़ें",
        ai_summary: "AI सारांश",
        loading: "लोड हो रहा है..."
    },
    mr: {
        nav_home: "मुख्य पान",
        nav_news: "बातम्या",
        nav_dashboard: "डैशबोर्ड",
        nav_subscription: "सबस्क्रिप्शन",
        nav_login: "लॉगिन",
        nav_signup: "साइन अप",
        hero_title: "तुमचा ज्ञानाचा दैनंदिन स्रोत",
        hero_subtitle: "AI क्युरेशनसह अद्ययावत बातम्या मिळवा.",
        latest_news: "ताज्या बातम्या",
        trending: "ट्रेंडिंग",
        read_more: "पूर्ण वाचा",
        ai_summary: "AI सारांश",
        loading: "लोड होत आहे..."
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
