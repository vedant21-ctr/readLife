"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import NewsCard from "@/components/NewsCard";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Academic", "Human & Environment", "Sports", "Political", "Music", "Financial Market"];

export default function NewsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || "All";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?category=${activeCategory === 'All' ? '' : activeCategory.toLowerCase()}`);
                if (!res.ok) throw new Error('API Error');
                const data = await res.json();
                const articles = Array.isArray(data) ? data : (data.articles || []);
                if (articles.length === 0 && !data.message) throw new Error('No articles found');
                setNews(articles);
            } catch (error) {
                console.error("Failed to fetch news:", error);
                setError("Unable to load live news. Please check your internet connection or API Key configuration.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-paper text-ink pb-20">

            {/* Header */}
            <header className="bg-secondary/30 border-b-2 border-primary py-12 mb-12">
                <div className="container px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight mb-4">
                        News Archive
                    </h1>
                    <p className="font-serif italic text-muted-foreground text-lg">
                        Explore the latest stories across all categories.
                    </p>
                </div>
            </header>

            <div className="container px-4">

                {/* Category Filter */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-b-2 border-primary pb-4 mb-12 items-center justify-center">
                    <span className="font-bold text-lg mr-4 bg-accent px-2">SECTIONS:</span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "text-sm font-bold uppercase tracking-wider hover:text-accent-foreground hover:bg-black/5 px-2 py-1 transition-all",
                                activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {error ? (
                    <div className="p-12 border-2 border-dashed border-destructive text-center bg-destructive/10 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-destructive mb-2">Could Not Load News</h3>
                        <p className="text-muted-foreground mb-6 font-serif">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase hover:bg-black/80 transition-transform hover:scale-105">
                            Retry Connection
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-muted animate-pulse border-2 border-transparent" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <NewsCard key={item._id} article={item} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
