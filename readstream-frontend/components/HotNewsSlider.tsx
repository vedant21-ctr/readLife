"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, ArrowRight } from "lucide-react";

interface HotNewsItem {
    _id: string;
    title: string;
    imageUrl?: string;
    category?: string;
}

export default function HotNewsSlider({ news }: { news: HotNewsItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    if (!news || news.length === 0) return null;

    const currentNews = news[currentIndex];

    return (
        <div className="border-l-2 border-primary pl-6 py-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black font-serif uppercase tracking-widest border-b-4 border-accent inline-block">
                    Hot News
                </h2>
                <div className="flex flex-col gap-1">
                    <button onClick={prevSlide} className="p-1 hover:bg-accent hover:text-accent-foreground transition-colors border border-primary">
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={nextSlide} className="p-1 hover:bg-accent hover:text-accent-foreground transition-colors border border-primary">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative group flex-1 min-h-[300px] mb-4">
                {currentNews.imageUrl && (
                    <div className="relative w-full h-64 mb-4 border-2 border-primary">
                        <Image
                            src={currentNews.imageUrl}
                            alt={currentNews.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-0 right-0 bg-accent text-accent-foreground font-black px-3 py-1 text-lg border-b-2 border-l-2 border-primary">
                            0{currentIndex + 1}
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {currentNews.category || 'Trending'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold leading-tight group-hover:underline decoration-accent decoration-2 underline-offset-4">
                        <Link href={`/news/${currentNews._id}`}>
                            {currentNews.title}
                        </Link>
                    </h3>
                </div>
            </div>

            <div className="pt-4 border-t border-muted/30">
                <Link href="/news" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-accent-foreground transition-colors">
                    See All Hot News <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
