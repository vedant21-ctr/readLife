"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface NewsCardProps {
    article: {
        _id: string;
        title: string;
        description?: string;
        imageUrl?: string;
        category?: string;
        publishedAt: string;
        source?: string;
        author?: string;
        likes?: number;
    };
    featured?: boolean;
    index?: number;
    variant?: 'standard' | 'editorial';
}

export default function NewsCard({ article, featured = false, index = 0, variant = 'standard' }: NewsCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likes || 0);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to like articles.");
            return;
        }

        const previousLiked = isLiked;
        // const previousCount = likesCount; // Unused, but kept for logic if needed

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/news/${article._id}/like`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setLikesCount(res.data.likes);
            setIsLiked(res.data.liked);
        } catch (error) {
            setIsLiked(previousLiked);
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1); // Revert logic simplified
            console.error("Like failed:", error);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to save articles.");
            return;
        }

        const previousSaved = isSaved;
        setIsSaved(!isSaved);

        try {
            if (!isSaved) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/saved`, {
                    contentId: article._id,
                    article: article
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/saved/content/${article._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
        } catch (error) {
            setIsSaved(previousSaved);
            console.error(isSaved ? "Unsave failed:" : "Save failed:", error);
        }
    };

    const isEditorial = variant === 'editorial';

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={isEditorial ? { y: -4 } : { y: -12 }}
            className={cn(
                "group flex flex-col transition-all duration-500 ease-out",
                isEditorial
                    ? "bg-transparent border-none shadow-none hover:shadow-none"
                    : "bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/20 border border-border-soft",
                featured ? "md:col-span-2 md:row-span-2" : "h-full"
            )}
        >
            <div className={cn(
                "relative overflow-hidden bg-muted",
                featured ? "aspect-[16/9]" : "aspect-[3/2]",
                isEditorial ? "rounded-none mb-4" : ""
            )}>
                {article.imageUrl ? (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground font-serif italic text-xl bg-secondary">
                        No Image
                    </div>
                )}

                {!isEditorial && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                            {article.category || 'News'}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className={cn("flex flex-1 flex-col", isEditorial ? "p-0" : "p-6")}>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                    <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <span className="w-1 h-1 bg-amber-500 rounded-full" />
                    <span>{article.category || article.source || 'News'}</span>
                </div>

                <Link href={`/news/${article._id}`} className="block">
                    <h3 className={cn(
                        "font-serif font-bold leading-tight transition-all duration-300 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500",
                        featured ? "text-2xl md:text-4xl" : "text-xl",
                        isEditorial ? "text-2xl" : "text-xl"
                    )}>
                        {article.title}
                    </h3>
                </Link>

                <p className={cn(
                    "text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4",
                    featured ? "text-lg" : ""
                )}>
                    {article.description}
                </p>

                <div className={cn("mt-auto flex items-center justify-between pt-4", isEditorial ? "border-t border-border/40" : "border-t border-border/40")}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> 3 min
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10",
                                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            )}
                        >
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            <span className="text-xs font-bold">{likesCount > 0 ? likesCount : ''}</span>
                        </button>
                        <button
                            onClick={handleBookmark}
                            className={cn(
                                "transition-colors p-1 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/10",
                                isSaved ? "text-amber-600" : "text-muted-foreground hover:text-amber-600"
                            )}
                        >
                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
