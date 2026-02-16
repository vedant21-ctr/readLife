"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import NewsCard from "@/components/NewsCard";
import { Loader2 } from "lucide-react";

export default function TrendingPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/trending`);
                setNews(res.data);
            } catch (error) {
                console.error("Failed to fetch trending news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background px-6 md:px-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto"
            >
                <header className="mb-16 text-center border-b border-border-soft pb-12">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-600 mb-4 block">
                        Most Read
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight text-foreground mb-6">
                        Trending Stories
                    </h1>
                    <p className="text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
                        The most impactful stories shaping the world today, curated by ReadStream.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-amber-500 w-10 h-10" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {news.map((article, index) => (
                            <NewsCard
                                key={article._id}
                                article={article}
                                index={index}
                                variant="editorial"
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
