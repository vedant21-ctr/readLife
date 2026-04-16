"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Loader2, CreditCard, ShieldCheck, Wallet, Landmark, Smartphone, ChevronDown, Lock } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function PaymentForm() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "premium";

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'emi' | 'upi' | 'paypal'>('card');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [emiMonth, setEmiMonth] = useState('3');

    const price = plan === 'premium' ? 9.00 : 29.00;
    const yearlyPrice = price * 12;

    const processPayment = async () => {
        setPaymentStatus('processing');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
                    { plan },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setPaymentStatus('success');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Subscription failed:", error);
            alert("Failed to process payment. Please try again.");
            setPaymentStatus('idle');
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-paper">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-16 flex flex-col items-center justify-center text-center space-y-8 bg-card rounded-3xl shadow-2xl border border-border"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner"
                    >
                        <Check className="w-12 h-12" />
                    </motion.div>
                    <div>
                        <h3 className="text-4xl font-serif font-black mb-4">Payment Successful!</h3>
                        <p className="text-lg text-muted-foreground">Welcome to ReadStream {plan.charAt(0).toUpperCase() + plan.slice(1)}.</p>
                        <p className="text-sm mt-4 text-muted-foreground animate-pulse">Redirecting to your dashboard...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-paper py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Checkout Form */}
                <div className="lg:col-span-7 space-y-8">
                    <div>
                        <h1 className="text-3xl font-serif font-black tracking-tight mb-2">Secure Checkout</h1>
                        <p className="text-muted-foreground">Choose your preferred payment method below.</p>
                    </div>

                    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        {/* Payment Tabs */}
                        <div className="flex border-b border-border overflow-x-auto overflow-y-hidden">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 py-4 px-6 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-muted-foreground hover:bg-secondary'}`}
                            >
                                <CreditCard size={16} /> Credit/Debit
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('emi')}
                                className={`flex-1 py-4 px-6 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'emi' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-muted-foreground hover:bg-secondary'}`}
                            >
                                <Landmark size={16} /> EMI (Easy Installments)
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('upi')}
                                className={`flex-1 py-4 px-6 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-muted-foreground hover:bg-secondary'}`}
                            >
                                <Smartphone size={16} /> UPI
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex-1 py-4 px-6 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-muted-foreground hover:bg-secondary'}`}
                            >
                                <Wallet size={16} /> PayPal
                            </button>
                        </div>

                        {/* Payment Details Area */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {paymentMethod === 'card' && (
                                    <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Card Number</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border rounded-xl font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-xl font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">CVC / CVV</label>
                                                <div className="relative">
                                                    <input type="password" placeholder="***" className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-xl font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Name on Card</label>
                                            <input type="text" placeholder="John Doe" className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-xl font-sans text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                                        </div>
                                    </motion.div>
                                )}

                                {paymentMethod === 'emi' && (
                                    <motion.div key="emi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                        <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-medium">
                                            Select an EMI plan to pay in easy monthly installments. Available on all major credit cards.
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select EMI Tenure</label>
                                            
                                            <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${emiMonth === '3' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-border hover:bg-secondary/50'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <input type="radio" name="emi" checked={emiMonth === '3'} onChange={() => setEmiMonth('3')} className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
                                                        <span className="font-bold text-lg">3 Months EMI</span>
                                                    </div>
                                                    <span className="font-serif font-black">${(yearlyPrice / 3).toFixed(2)}/mo</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2 pl-7">Total: ${yearlyPrice.toFixed(2)} at 0% interest.</p>
                                            </label>

                                            <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${emiMonth === '6' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-border hover:bg-secondary/50'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <input type="radio" name="emi" checked={emiMonth === '6'} onChange={() => setEmiMonth('6')} className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
                                                        <span className="font-bold text-lg">6 Months EMI</span>
                                                    </div>
                                                    <span className="font-serif font-black">${(yearlyPrice / 6).toFixed(2)}/mo</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2 pl-7">Total: ${yearlyPrice.toFixed(2)} at 0% interest.</p>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 text-center py-8">
                                        <Smartphone className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                        <div className="space-y-2 max-w-sm mx-auto">
                                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider text-left block">Enter UPI ID</label>
                                            <input type="text" placeholder="username@upi" className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-xl font-sans text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-center" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-4">You will receive a payment request on your UPI app.</p>
                                    </motion.div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <motion.div key="paypal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-12 flex flex-col items-center justify-center space-y-6">
                                        <Wallet className="w-16 h-16 text-[#00457C] opacity-80" />
                                        <p className="text-muted-foreground text-center max-w-sm">You will be securely redirected to PayPal to complete your purchase, then automatically returned here.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground bg-green-50/50 border border-green-100 p-4 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span>Guaranteed safe and secure checkout. We never store your full card details. 256-bit SSL encryption.</span>
                    </div>

                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5">
                    <div className="bg-foreground text-background rounded-3xl p-8 sticky top-32 shadow-2xl">
                        <h2 className="text-xl font-serif font-black mb-8 border-b border-border/20 pb-4">Order Summary</h2>

                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg capitalize">ReadStream {plan}</h3>
                                    <p className="text-sm text-white/50">Annual Subscription (12 months)</p>
                                </div>
                                <span className="font-serif text-xl font-bold">${yearlyPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-amber-400">
                                <span>Annual Discount Applied</span>
                                <span>-15%</span>
                            </div>
                        </div>

                        <div className="border-t border-border/20 pt-6 mb-8 space-y-4">
                            <div className="flex justify-between items-center text-white/70">
                                <span>Subtotal</span>
                                <span>${yearlyPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/70">
                                <span>Taxes & Fees</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-serif font-black mt-4">
                                <span>Total Due</span>
                                <span>${yearlyPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={processPayment}
                            disabled={paymentStatus === 'processing'}
                            className="w-full py-5 bg-amber-500 text-foreground font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {paymentStatus === 'processing' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                                </>
                            ) : (
                                `Confirm Payment of $${yearlyPrice.toFixed(2)}`
                            )}
                        </button>
                        
                        <p className="text-center text-[10px] text-white/40 mt-6 max-w-xs mx-auto">
                            By confirming your payment, you agree to our Terms of Service and Privacy Policy. Subscriptions auto-renew.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>}>
            <PaymentForm />
        </Suspense>
    );
}
