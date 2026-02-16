"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import NewsCard from "@/components/NewsCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Search, TrendingUp, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["All", "Academic", "Human & Environment", "Sports", "Political", "Music", "Financial Market"];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50 }
  }
} as const;

export default function Home() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parallax Logic for Featured Image
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const ySpring = useSpring(y1, { stiffness: 100, damping: 20 });

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          // Add limit=5 for dropdown
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/search?q=${searchQuery}&limit=5`);
          const data = await res.json();
          setSearchResults(data);
          setHighlightedIndex(-1);
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // Faster debounce for "Live" feel

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Keyboard Navigation for Search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        // Navigate
        window.location.href = `/news/${searchResults[highlightedIndex]._id}`;
      }
    }
  };

  // Fetch Main News & Latest
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, latestRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news?category=${activeCategory === 'All' ? '' : activeCategory.toLowerCase()}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/latest?limit=6`)
        ]);

        // Handle varying response structures if any
        setNews(Array.isArray(newsRes.data) ? newsRes.data : (newsRes.data.articles || []));
        setLatestNews(latestRes.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        // Fallback or empty state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  const loadMoreLatest = async () => {
    const nextPage = page + 1;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/latest?page=${nextPage}&limit=6`);
      if (res.data.length > 0) {
        setLatestNews(prev => {
          const newItems = res.data.filter((n: any) => !prev.some((p: any) => p._id === n._id));
          return [...prev, ...newItems];
        });
        setPage(nextPage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Highlight Text Helper
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-amber-100 text-amber-900 rounded-[2px] px-0.5">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">

      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative py-36 px-6 md:px-12 text-center overflow-hidden"
      >
        {/* Gradient Mesh / Ambient Light */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/40 via-background to-background blur-3xl" />
          <motion.div
            animate={{
              x: [0, 50, -50, 0],
              y: [0, 30, -30, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-96 h-96 bg-amber-300/20 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3"
          >
            <span className="h-[1px] w-12 bg-amber-500/50"></span>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-foreground/60">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <span className="h-[1px] w-12 bg-amber-500/50"></span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-serif font-black tracking-tight leading-[0.9] text-foreground"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 md:px-12 pb-24">

        {/* Category Navigation */}
        <div className="sticky top-4 z-40 mb-16 flex justify-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-background/80 backdrop-blur-md border border-border-soft px-2 py-2 rounded-full shadow-sm flex gap-1 overflow-x-auto max-w-full"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                  activeCategory === cat
                    ? "text-foreground bg-white dark:bg-zinc-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* 65/35 Trending Layout */}
        {!loading && news.length > 3 && (
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Trending Stories</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* 65% Main Feature */}
              <div className="lg:col-span-8 group cursor-pointer">
                <Link href={`/news/${news[0]._id}`}>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm mb-6 bg-secondary">
                    <motion.div style={{ y: ySpring }} className="absolute inset-0">
                      {news[0].imageUrl && (
                        <Image
                          src={news[0].imageUrl}
                          alt={news[0].title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          priority
                        />
                      )}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white rounded-full">
                        {news[0].category || "Featured"}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight mb-3 drop-shadow-lg group-hover:text-amber-200 transition-colors">
                        {news[0].title}
                      </h3>
                      <p className="text-white/80 line-clamp-2 max-w-2xl font-serif text-lg">
                        {news[0].description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 35% Ranking List */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-8">
                {news.slice(1, 4).map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="relative flex gap-6 items-start py-6 border-b border-border/40 last:border-0 group"
                  >
                    <span className="text-6xl font-serif font-black text-border/20 group-hover:text-amber-500/20 transition-colors duration-500 select-none leading-none -mt-2">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {item.category || "News"}
                        </span>
                      </div>
                      <Link href={`/news/${item._id}`}>
                        <h4 className="text-xl font-serif font-bold leading-snug group-hover:text-amber-600 transition-colors duration-300">
                          {item.title}
                        </h4>
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="text-amber-600"
                        >
                          <ArrowUpRight size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-4 self-end group">
                  View All Trending <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-soft">
              <h2 className="text-2xl font-serif font-bold">Latest Stories</h2>
            </div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
            >
              {loading ? (
                [...Array(6)].map((_, i) => <div key={i} className="h-96 bg-muted animate-pulse rounded-none" />)
              ) : latestNews.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground font-serif italic text-lg border border-dashed border-border p-8">
                  No stories currently available. Please check back later.
                </div>
              ) : (
                latestNews.map((item, i) => (
                  <motion.div key={`${item._id}-${i}`} variants={itemVariants}>
                    <NewsCard article={item} index={i} variant="editorial" />
                  </motion.div>
                ))
              )}
            </motion.div>

            <div className="mt-16 flex justify-center">
              <button
                onClick={loadMoreLatest}
                className="px-8 py-4 border border-border text-xs font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Load More Stories
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">

            {/* Live Search Widget */}
            <div className="bg-card p-1 rounded-2xl shadow-sm border border-border-soft sticky top-32 z-30">
              <div className="relative group focus-within:ring-2 focus-within:ring-amber-500/20 rounded-xl transition-all">
                <Search className="absolute left-4 top-4 text-muted-foreground w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-4 py-4 bg-secondary/30 rounded-xl border border-transparent focus:bg-background focus:outline-none font-serif placeholder:font-sans text-lg transition-all"
                />
                {isSearching && (
                  <div className="absolute right-4 top-4 animate-spin text-amber-500">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                  </div>
                )}

                {/* Dropdown Results */}
                <AnimatePresence>
                  {searchQuery.length > 0 && searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border-soft overflow-hidden z-50 p-2"
                    >
                      {searchResults.length > 0 ? (
                        <ul className="space-y-1">
                          {searchResults.map((result, idx) => (
                            <li key={result._id}>
                              <Link href={`/news/${result._id}`}>
                                <div className={cn(
                                  "p-3 rounded-lg transition-colors flex flex-col gap-1 cursor-pointer",
                                  highlightedIndex === idx ? "bg-amber-50 dark:bg-amber-900/20" : "hover:bg-secondary/50"
                                )}>
                                  <span className="font-serif font-bold text-sm text-foreground line-clamp-1">
                                    {getHighlightedText(result.title, searchQuery)}
                                  </span>
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex justify-between">
                                    {result.category || 'News'}
                                    {highlightedIndex === idx && <span className="text-amber-600">Enter to read</span>}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        !isSearching && (
                          <div className="p-4 text-center text-muted-foreground text-sm">
                            No matches found for "{searchQuery}"
                          </div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Promo Card */}
            <div className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 text-center space-y-6">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-black mb-2">ReadStream Premium</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Unlock unlimited access to our expert analysis, ad-free experience, and exclusive reports.
                </p>
                <button className="w-full py-4 bg-amber-500 text-foreground font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-lg glow">
                  Upgrade Now
                </button>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
