"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Search, Sun, Moon, Globe, User, LogOut, X, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">

                {/* Brand */}
                <Link href="/" className="mr-6 flex items-center space-x-2 group">
                    <span className="text-3xl font-serif font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-amber-500">
                        ReadStream<span className="text-amber-500">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-muted-foreground">
                    {[
                        { href: "/", label: t('nav_home') },
                        { href: "/news", label: t('nav_news') },
                        { href: "/trending", label: "Trending" },
                        { href: "/subscription", label: t('nav_subscription') },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative hover:text-foreground transition-colors duration-200 group py-2"
                        >
                            {link.label}
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    ))}
                    {user && (
                        <Link href="/dashboard" className="relative hover:text-foreground transition-colors duration-200 group py-2">
                            {t('nav_dashboard')}
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    )}
                </div>

                {/* Actions Group */}
                <div className="flex items-center space-x-6">

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}

                    {/* Language Selector */}
                    <div className="relative group hidden sm:block">
                        <button className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Globe size={20} />
                            <span className="uppercase text-xs font-bold ml-1">{language}</span>
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-32 bg-background border border-border shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right duration-200">
                            <button onClick={() => setLanguage('en')} className="block w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors">English</button>
                            <button onClick={() => setLanguage('hi')} className="block w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors">Hindi</button>
                            <button onClick={() => setLanguage('mr')} className="block w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors">Marathi</button>
                        </div>
                    </div>

                    {/* User Auth */}
                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center font-bold border border-amber-200 dark:border-amber-800">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right duration-200 z-50">
                                <div className="px-5 py-4 border-b border-border bg-muted/30">
                                    <p className="text-sm font-bold text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <div className="p-2">
                                    <Link href="/profile" className="flex w-full items-center px-3 py-2 hover:bg-muted rounded-md text-sm font-medium transition-colors">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </Link>
                                    <button onClick={logout} className="flex w-full items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 rounded-md text-sm font-medium transition-colors">
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login" className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                                {t('nav_login')}
                            </Link>
                            <Link href="/signup" className="px-5 py-2 text-sm font-bold bg-foreground text-background rounded-full hover:bg-amber-500 hover:text-white transition-colors duration-300 shadow-md">
                                {t('nav_signup')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-background overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <Link href="/" className="block text-lg font-serif font-bold text-foreground/80 hover:text-amber-500">{t('nav_home')}</Link>
                            <Link href="/news" className="block text-lg font-serif font-bold text-foreground/80 hover:text-amber-500">{t('nav_news')}</Link>
                            <Link href="/subscription" className="block text-lg font-serif font-bold text-foreground/80 hover:text-amber-500">{t('nav_subscription')}</Link>
                            {user && <Link href="/dashboard" className="block text-lg font-serif font-bold text-foreground/80 hover:text-amber-500">{t('nav_dashboard')}</Link>}
                            {!user && (
                                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
                                    <Link href="/login" className="w-full py-3 text-center border border-border rounded-lg font-bold hover:bg-muted transition-colors">{t('nav_login')}</Link>
                                    <Link href="/signup" className="w-full py-3 text-center bg-foreground text-background rounded-lg font-bold hover:bg-amber-500 transition-colors">{t('nav_signup')}</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
