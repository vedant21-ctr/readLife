"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Loader2, CreditCard, X, ShieldCheck } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const features = [
        "Unlimited Article Access",
        "Ad-Free Experience",
        "Premium AI Summaries",
        "Audio Versions",
        "Exclusive 'World News'",
        "Download for Offline"
    ];

    const handleSelectPlan = (plan: string) => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (plan === 'free') {
            processSubscription('free');
            return;
        }
        router.push(`/payment?plan=${plan}`);
    };

    const processSubscription = async (plan: string) => {
        setPaymentStatus('processing');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
                { plan },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaymentStatus('success');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            console.error("Subscription failed:", error);
            alert("Failed to update subscription. Please try again.");
            setPaymentStatus('idle');
        } finally {
            if (plan === 'free') setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper py-24 px-6 text-ink relative overflow-hidden">
            <div className="container max-w-6xl mx-auto relative z-10">

                <div className="text-center mb-20 space-y-6">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-foreground bg-accent px-3 py-1 rounded-full">
                        Premium Access
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-tight">
                        Invest in Your <span className="italic text-amber-600">Knowledge</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Unlock the full potential of ReadStream. Deep analysis, AI summaries, and an ad-free reading experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                    {/* Free Tier */}
                    <div className="border border-border/60 bg-white/50 p-8 flex flex-col items-center text-center opacity-80 hover:opacity-100 transition-all hover:bg-white/80 rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest mb-4 text-sm text-muted-foreground">Free Reader</h3>
                        <div className="text-4xl font-black font-serif mb-6">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-4 mb-8 text-sm w-full text-left pl-4">
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> 5 Articles / Day</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Basic News Feed</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Limited Ads</li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('free')}
                            disabled={loading || paymentStatus === 'processing'}
                            className="w-full py-3 border border-primary font-bold uppercase text-xs hover:bg-secondary transition-colors rounded-lg disabled:opacity-50"
                        >
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="relative border-2 border-amber-500 bg-white p-10 flex flex-col items-center text-center shadow-xl shadow-amber-500/10 rounded-2xl transform md:-translate-y-6 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] rounded-full shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="font-bold uppercase tracking-widest mb-4 text-amber-600 text-sm">Editor's Choice</h3>
                        <div className="text-6xl font-black font-serif mb-2">$9<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-xs text-muted-foreground italic mb-8">Billed annually ($108/year)</p>

                        <div className="w-full h-px bg-border/50 mb-8" />

                        <ul className="space-y-4 mb-10 text-left w-full">
                            {features.map((feat) => (
                                <li key={feat} className="flex items-center gap-3 font-semibold text-sm">
                                    <div className="p-1 bg-amber-100 text-amber-700 rounded-full">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('premium')}
                            disabled={loading || paymentStatus === 'processing'}
                            className="w-full py-4 bg-amber-500 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-600 hover:scale-[1.02] transition-all rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            Start 14-Day Free Trial
                        </button>
                        <p className="text-[10px] text-muted-foreground mt-4">Cancel anytime. No questions asked.</p>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="border border-border/60 bg-white/50 p-8 flex flex-col items-center text-center opacity-80 hover:opacity-100 transition-all hover:bg-white/80 rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest mb-4 text-sm text-muted-foreground">Supporter</h3>
                        <div className="text-4xl font-black font-serif mb-6">$29<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-4 mb-8 text-sm w-full text-left pl-4">
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Everything in Premium</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Priority Support</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Direct to Editorial Board</li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('supporter')}
                            disabled={loading || paymentStatus === 'processing'}
                            className="w-full py-3 border border-primary font-bold uppercase text-xs hover:bg-secondary transition-colors rounded-lg disabled:opacity-50"
                        >
                            Become a Supporter
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
