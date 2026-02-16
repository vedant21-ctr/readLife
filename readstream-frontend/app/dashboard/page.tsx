"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, BookOpen, Bookmark, Clock, User, ExternalLink, Loader2, BarChart2, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [dashboardUser, setDashboardUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [preferences, setPreferences] = useState({ language: 'en', categories: [] });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?.token) {
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setDashboardUser(res.data);
                    // Init prefs
                    setPreferences({
                        language: res.data.language || 'en',
                        categories: res.data.preferences?.categories || []
                    });
                } catch (error) {
                    console.error("Failed to fetch dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (user) {
            setDashboardUser(user);
            fetchDashboardData();
        }
    }, [user]);

    const handleUpdateSettings = async () => {
        if (!user) return;
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/user/preferences`,
                { language: preferences.language, categories: preferences.categories },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert("Settings updated!");
            setIsSettingsOpen(false);
            // Could re-fetch user data here
        } catch (error) {
            console.error(error);
            alert("Failed to update settings");
        }
    };

    // Calculate Analytics
    const analytics = useMemo(() => {
        if (!dashboardUser?.history) return { chartData: [], streak: 0 };

        const history = dashboardUser.history;
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString();
        }).reverse();

        const chartData = last7Days.map(date => ({
            name: date.slice(0, 5), // mm/dd
            fullName: date,
            reads: history.filter((h: any) => new Date(h.viewedAt).toLocaleDateString() === date).length
        }));

        // Calculate Streak (Simplified)
        let streak = 0;
        const today = new Date().toLocaleDateString();
        // check today
        if (history.some((h: any) => new Date(h.viewedAt).toLocaleDateString() === today)) {
            streak++;
            // check yesterday, etc.
            for (let i = 1; i < 365; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString();
                if (history.some((h: any) => new Date(h.viewedAt).toLocaleDateString() === dateStr)) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        return { chartData, streak };
    }, [dashboardUser]);

    if (!user) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md space-y-6"
                >
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif">Welcome Back</h2>
                    <p className="text-muted-foreground">Log in to view your personalized dashboard, reading stats, and saved collection.</p>
                    <div className="pt-4">
                        <Link href="/login" className="px-8 py-3 bg-foreground text-background font-bold uppercase tracking-widest rounded-full hover:bg-amber-600 hover:text-white transition-all shadow-lg">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const displayUser = dashboardUser || user;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">

            {/* Header */}
            <div className="bg-secondary/30 border-b border-border/50 pt-20 pb-12 px-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                            <div className="text-4xl font-black text-amber-500">{displayUser.name.charAt(0).toUpperCase()}</div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight">{displayUser.name}</h1>
                            <p className="text-muted-foreground font-serif italic text-lg">{displayUser.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border/50 rounded-lg font-bold text-sm hover:bg-muted transition-colors shadow-sm"
                        >
                            <Settings className="w-4 h-4" /> Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-1 space-y-2">
                        {[
                            { id: "overview", icon: BarChart2, label: "Overview" },
                            { id: "bookmarks", icon: Bookmark, label: "Saved Articles" },
                            { id: "history", icon: Clock, label: "Reading History" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm",
                                    activeTab === item.id
                                        ? "bg-foreground text-background shadow-md"
                                        : "bg-card hover:bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-4 h-4" /> {item.label}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <>
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-card p-6 rounded-2xl shadow-sm border border-border-soft relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Reads</h3>
                                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="text-5xl font-serif font-black text-foreground relative z-10">
                                                <CountUp end={displayUser.history?.length || 0} duration={2.5} />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-card p-6 rounded-2xl shadow-sm border border-border-soft relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Current Streak</h3>
                                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2 relative z-10">
                                                <span className="text-5xl font-serif font-black text-foreground">
                                                    <CountUp end={analytics.streak} duration={2.5} />
                                                </span>
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">days</span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-card p-6 rounded-2xl shadow-sm border border-border-soft relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Saved Items</h3>
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                                                    <Bookmark className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="text-5xl font-serif font-black text-foreground relative z-10">
                                                <CountUp end={displayUser.bookmarks?.length || 0} duration={2.5} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Activity Chart */}
                                    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-soft">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-serif font-bold">Reading Activity</h3>
                                            <select className="text-xs font-bold uppercase tracking-widest bg-secondary/50 border-none rounded-lg px-3 py-1 text-muted-foreground outline-none">
                                                <option>Last 7 Days</option>
                                                <option>Last 30 Days</option>
                                            </select>
                                        </div>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analytics.chartData} barSize={32}>
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                                                        dy={10}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                                                        cursor={{ fill: 'var(--secondary)' }}
                                                    />
                                                    <Bar dataKey="reads" radius={[6, 6, 6, 6]}>
                                                        {analytics.chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === 6 ? '#F59E0B' : '#E5E7EB'} className="transition-all duration-300 hover:opacity-80" />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Saved Preview */}
                                    {displayUser.bookmarks?.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-serif font-bold">Recently Saved</h3>
                                                <button onClick={() => setActiveTab('bookmarks')} className="text-xs font-bold uppercase text-amber-600 hover:underline">View All</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {displayUser.bookmarks.slice(0, 2).map((item: any) => {
                                                    const article = item.content || item;
                                                    if (!article) return null;

                                                    return (
                                                        <div key={item._id || item.articleId} className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:shadow-md transition-all">
                                                            {article.imageUrl && (
                                                                <div className="w-20 h-20 bg-muted rounded-lg relative overflow-hidden flex-shrink-0">
                                                                    <Image src={article.imageUrl} alt="" fill className="object-cover" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <Link href={`/news/${article._id || article.externalId}`} className="font-serif font-bold line-clamp-2 hover:text-amber-600 transition-colors">
                                                                    {article.title}
                                                                </Link>
                                                                <p className="text-xs text-muted-foreground mt-2">Saved recently</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* BOOKMARKS TAB */}
                            {activeTab === "bookmarks" && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-6">Your Collection</h2>
                                    {(!displayUser.bookmarks || displayUser.bookmarks.length === 0) ? (
                                        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
                                            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                            <p className="text-muted-foreground font-serif italic text-lg">Your collection is empty.</p>
                                            <Link href="/news" className="text-amber-600 hover:underline font-bold text-sm mt-4 inline-block">Start Reading</Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {displayUser.bookmarks.map((item: any, i: number) => {
                                                const article = item.content || item;
                                                if (!article) return null;

                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:shadow-lg transition-all group"
                                                    >
                                                        <div className="h-24 w-32 bg-muted flex-shrink-0 relative overflow-hidden rounded-lg">
                                                            {article.imageUrl ? (
                                                                <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-between py-1">
                                                            <Link href={`/news/${article._id || article.externalId}`} className="font-serif font-bold text-lg hover:text-amber-600 transition-colors">
                                                                {article.title}
                                                            </Link>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                                                    {new Date(item.savedAt || new Date()).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* HISTORY TAB */}
                            {activeTab === "history" && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-6">Reading History</h2>
                                    <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
                                        {displayUser.history?.map((item: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                                            >
                                                <div>
                                                    <Link href={item.url || '#'} className="font-serif font-bold text-lg hover:text-amber-600 transition-colors">
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Read on {new Date(item.viewedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Link href={item.url || '#'} className="text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h3 className="font-serif font-bold text-xl">Preferences</h3>
                                <button onClick={() => setIsSettingsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Language</label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                        className="w-full p-3 bg-secondary rounded-xl border-none focus:ring-2 focus:ring-amber-500/20 outline-none font-serif"
                                    >
                                        <option value="en">English (Default)</option>
                                        <option value="hi">Hindi</option>
                                        <option value="mr">Marathi</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-4 block">Favorite Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Technology', 'Business', 'Science', 'Health', 'Sports', 'politics'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    const current = preferences.categories as string[];
                                                    const up = current.includes(cat)
                                                        ? current.filter(c => c !== cat)
                                                        : [...current, cat];
                                                    setPreferences({ ...preferences, categories: up as any });
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors",
                                                    (preferences.categories as string[]).includes(cat)
                                                        ? "bg-amber-500 text-white border-amber-500"
                                                        : "bg-secondary text-muted-foreground border-transparent hover:bg-muted"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
                                <button
                                    onClick={handleUpdateSettings}
                                    className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-amber-600 hover:text-white transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
