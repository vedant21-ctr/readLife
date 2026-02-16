"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, User, Share2, Bookmark, Sparkles, ArrowLeft, Globe, PlayCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ArticlePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [summarizing, setSummarizing] = useState(false);
    const [articleLanguage, setArticleLanguage] = useState('en'); // 'en', 'hi', 'mr'
    const [isSaved, setIsSaved] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`);
                const data = await res.json();
                setArticle(data);

                // Record History if logged in
                if (user && user.token) {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/user/history`,
                        {
                            articleId: data._id,
                            title: data.title,
                            url: `/news/${data._id}`
                        },
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                }

            } catch (error) {
                console.error("Failed to fetch article:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id, user]);

    useEffect(() => {
        if (user && article) {
            // Check if article is already saved
            // user.bookmarks might be IDs or objects depending on population
            // simpler check:
            const checkSaved = async () => {
                try {
                    // Check if bookmark exists in user context or fetch
                    // For now, rely on user context being refreshed or check manually?
                    // Let's assume user object carries bookmarks which are IDs or Objects.
                    // A robust way might be valid, but querying the API is safest if we want to be sure.
                    // But for now, let's skip the API call for "check saved" to avoid spamming, 
                    // unless we want to be precise.
                    // A better way: fetch '/api/saved?contentId=...' ? No such filter.
                    // Let's rely on user.bookmarks if it exists.
                    if (user.bookmarks && Array.isArray(user.bookmarks)) {
                        const isBookmarked = user.bookmarks.some((b: any) =>
                            (typeof b === 'string' && b === article._id) ||
                            (b.content && (b.content === article._id || b.content._id === article._id)) ||
                            (b._id === article._id) // unlikely but possible
                        );
                        setIsSaved(isBookmarked);
                    }
                } catch (e) {
                    console.log("Error checking saved status", e);
                }
            };
            checkSaved();
        }
    }, [user, article]);

    const handleSummarize = async () => {
        setSummarizing(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/summarize`, {
                text: article.content || article.description
            });
            setSummary(res.data.summary);
        } catch (error) {
            console.error("Failed to summarize:", error);
        } finally {
            setSummarizing(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert("Please login to save articles.");
            return;
        }

        const previousSaved = isSaved;
        setIsSaved(!isSaved);

        try {
            if (!previousSaved) {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/saved`,
                    {
                        contentId: article._id,
                        article: article
                    },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                // alert("Article saved to your collection.");
            } else {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/saved/content/${article._id}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                // alert("Article removed from collection.");
            }
        } catch (error) {
            console.error("Failed to toggle save:", error);
            setIsSaved(previousSaved);
            alert("Action failed.");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-serif text-xl animate-pulse">Loading amazing content...</div>;
    }

    if (!article) {
        return <div className="min-h-screen flex items-center justify-center font-serif text-xl">Article not found</div>;
    }

    return (
        <article className="min-h-screen bg-paper text-ink pb-20 relative">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-amber-500 origin-0 z-50"
                style={{ scaleX }}
            />

            {/* Article Header Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-neutral-900">
                {article.imageUrl ? (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 bg-neutral-800">
                        No Image Available
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 text-white">
                    <div className="container max-w-4xl mx-auto">
                        <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-white/80 hover:text-accent mb-6 transition-colors border border-white/30 px-3 py-1 bg-black/20 backdrop-blur-sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-black uppercase tracking-widest">
                                {article.category || 'News'}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-300 font-sans">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black leading-tight mb-6 text-shadow-sm">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{article.author || 'ReadStream Staff'}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">3 min read</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 -mt-8 relative z-10">

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)] mb-12">
                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 border border-primary hover:bg-secondary transition-colors font-bold text-sm"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaved}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 border border-primary transition-colors font-bold text-sm",
                                isSaved ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                            )}
                        >
                            <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} /> {isSaved ? "Saved" : "Save"}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 border-l border-primary pl-4">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer uppercase"
                            value={articleLanguage}
                            onChange={(e) => setArticleLanguage(e.target.value)}
                        >
                            <option value="en">English (Original)</option>
                            <option value="hi">Hindi (Translated)</option>
                            <option value="mr">Marathi (Translated)</option>
                        </select>
                    </div>
                </div>

                {/* Layout: Content + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Article Content */}
                    <div className="lg:col-span-8">

                        {/* AI Summary Box */}
                        <div className="mb-10 p-6 bg-secondary/80 border-t-4 border-accent relative">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Sparkles className="w-24 h-24" />
                            </div>
                            <h3 className="font-black font-serif text-xl mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                In a Nutshell
                            </h3>

                            {!summary ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground font-serif italic mb-4">
                                        Too long? Let our AI summarize this for you in seconds.
                                    </p>
                                    <button
                                        onClick={handleSummarize}
                                        disabled={summarizing}
                                        className="px-6 py-2 bg-primary text-primary-foreground font-bold hover:bg-accent hover:text-accent-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                    >
                                        {summarizing ? "Generating Summary..." : "Summarize Article"}
                                    </button>
                                </div>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert font-serif animate-in fade-in slide-in-from-bottom-2">
                                    <p className="leading-relaxed border-l-2 border-accent pl-4 italic">
                                        {summary}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-loose text-ink/90">
                            <p className="first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-accent-foreground">
                                {article.content || article.description}
                            </p>
                            <p>
                                [This is a placeholder for the full article content. If this were a real production app connected to a paid news feed, you would see the complete 800-1200 word story here, formatted beautifully with headers, blockquotes, and inline images.]
                            </p>
                            <blockquote>
                                "The design of information is effectively the design of understanding." - Richard Saul Wurman
                            </blockquote>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            {/* Related Articles Hook */}
                            <div className="mt-16 pt-12 border-t border-border-soft">
                                <h4 className="font-serif font-black text-2xl mb-8">Related Stories</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="aspect-[3/2] bg-neutral-200 mb-4 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-neutral-300 animate-pulse" />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Technology</p>
                                            <h5 className="font-serif font-bold text-lg group-hover:text-amber-600 transition-colors">
                                                The Next Big Thing in Tech is Already Here
                                            </h5>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="border-2 border-primary p-6 bg-white">
                            <h4 className="font-bold uppercase tracking-widest mb-4 border-b-2 border-accent pb-2 inline-block">Author</h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-muted rounded-none border border-primary"></div>
                                <div>
                                    <p className="font-serif font-bold text-lg">{article.author || 'Staff Writer'}</p>
                                    <p className="text-xs text-muted-foreground uppercase">Senior Editor</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground italic font-serif">
                                Providing in-depth analysis and breaking news coverage for ReadStream since 2024.
                            </p>
                            <button className="w-full mt-4 py-2 border border-primary text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
                                Follow Author
                            </button>
                        </div>

                        <div className="bg-primary text-primary-foreground p-6">
                            <h4 className="font-bold uppercase tracking-widest mb-2 text-accent">Listen to Article</h4>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-full hover:scale-105 transition-transform">
                                    <PlayCircle className="w-6 h-6" />
                                </button>
                                <div>
                                    <p className="font-bold text-lg">Audio Version</p>
                                    <p className="text-xs opacity-70">Generated by AI Voice</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </article>
    );
}
