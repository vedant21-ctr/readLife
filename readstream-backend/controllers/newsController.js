import axios from 'axios';
import crypto from 'crypto';
import Content from '../models/Content.js';

// In-memory cache for API responses
const newsCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// In-memory store for individual articles
const articleStore = new Map();

// Helper: Generate consistent ID
const generateId = (item) => {
    return item.id || crypto.createHash('md5').update(item.url || item.title).digest('hex');
};

const CURRENTS_API_KEY = process.env.NEWS_API_KEY || 's-l5Oh_uyzznIZsAq-_FCSJdwv55-ZQ_GpB1Pr_mT_wn5y_X';

// Mock Data Generator
const getMockNews = (category) => {
    const categories = ['technology', 'environment', 'business', 'science', 'health', 'politics', 'sports', 'entertainment'];
    const titles = [
        "The Future of Quantum Computing: Beyond Qubits",
        "Global Markets React to New Trade Policies",
        "Breakthrough in Renewable Energy Storage",
        "Mars Colonization: A Timeline for 2030",
        "New Artificial Intelligence Regulations Proposed",
        "Championship Finals: Underdog Team Takes the Trophy",
        "Hollywood's Shift to Streaming-First Releases",
        "Urban Planning: The Rise of Smart Cities",
        "Genetic Editing: Ethical Implications Discussed",
        "Electric Aviation: The Next Frontier in Travel",
        "Cryptocurrency Regulations Tighten Globally",
        "Ocean Cleanup Project Reaches Major Milestone",
        "Virtual Reality in Education: A New Era",
        "Sustainable Fashion: Trends for 2026",
        "Robotics in Healthcare: Assisting Surgeons",
        "The Return of Vinyl: Music Industry Trends",
        "Space Tourism: Who Can Afford the Ticket?",
        "Cybersecurity Threats in the Age of IoT",
        "Mental Health Awareness in the Workplace",
        "The Gig Economy: Rights and Regulations"
    ];

    const images = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000", // Tech
        "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000", // Business
        "https://images.unsplash.com/photo-1569163139599-0f4517e36b51?auto=format&fit=crop&q=80&w=1000", // Environment
        "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=1000", // Space
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000", // Health
        "https://images.unsplash.com/photo-1529101091760-61df6be5d187?auto=format&fit=crop&q=80&w=1000", // Politics
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000", // Sports
        "https://images.unsplash.com/photo-1499364615650-ec3872094569?auto=format&fit=crop&q=80&w=1000", // Entertainment
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", // Networking
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"  // Chips
    ];

    const mockArticles = titles.map((title, index) => {
        const cat = categories[index % categories.length];
        return {
            title: title,
            description: `This is a comprehensive report on ${title.toLowerCase()}. Experts analyze the impact, trends, and future predictions regarding this significant development in the field of ${cat}. The world watches as changes unfold continuously.`,
            imageUrl: images[index % images.length],
            publishedAt: new Date(Date.now() - (index * 3600000)).toISOString(), // Staggered times
            author: "ReadStream Editorial",
            url: `/mock/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, // Unique URL for unique ID generation
            category: cat
        };
    });

    // Filter if a specific category was requested (and it wasn't 'all' or 'general')
    // But for "richness", let's return ALL if the category isn't strictly matching to ensure UI is full.
    // Or do a soft filter.
    let filtered = mockArticles;
    if (category && category !== 'general' && category !== 'all') {
        const strictMatches = mockArticles.filter(a => a.category === category);
        if (strictMatches.length > 0) filtered = strictMatches;
    }

    return filtered.map(art => {
        const id = generateId(art);
        const normalized = {
            _id: id,
            ...art,
            content: art.description.repeat(3), // Make content longer
            source: art.author
        };
        articleStore.set(id, normalized);
        return normalized;
    });
};

// @desc    Get all news (Currents API)
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
    const { category } = req.query;

    try {
        console.log(`Fetching News for category: ${category || 'All'}`);

        // Map frontend categories to Currents categories
        const catMap = {
            'academic': 'academia',
            'human & environment': 'world',
            'political': 'politics',
            'financial market': 'finance',
            'music': 'entertainment',
            'all': 'general'
        };

        const apiCategory = catMap[category?.toLowerCase()] || category?.toLowerCase() || 'general';
        const cacheKey = apiCategory;

        // Check cache
        if (newsCache.has(cacheKey)) {
            const { data, timestamp } = newsCache.get(cacheKey);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log(`Serving from cache for category: ${apiCategory}`);
                return res.json(data);
            }
        }

        const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${CURRENTS_API_KEY}&category=${apiCategory}&language=en`;

        try {
            // Request with timeout
            const response = await axios.get(url, { timeout: 8000 });

            if (response.data.status !== 'ok') {
                throw new Error('Currents API Error');
            }

            const articles = response.data.news.map(art => {
                const id = generateId(art);

                const normalized = {
                    _id: id, // This is the external ID (MD5 hash)
                    title: art.title,
                    description: art.description,
                    content: art.description,
                    imageUrl: (art.image && art.image !== 'None') ? art.image : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000',
                    publishedAt: art.published,
                    source: art.author || 'Currents',
                    author: "Staff", // Currents puts source in 'author' field mostly
                    url: art.url,
                    category: art.category && art.category.length > 0 ? art.category[0] : 'General'
                };

                articleStore.set(id, normalized);
                return normalized;
            });

            // Update cache
            newsCache.set(cacheKey, { data: articles, timestamp: Date.now() });

            return res.json(articles);

        } catch (apiError) {
            console.warn(`API Request failed (${apiError.message}). Serving mock data.`);

            // If API fails, check if we have STALE cache first
            if (newsCache.has(cacheKey)) {
                console.log(`Serving STALE cache for category: ${apiCategory}`);
                return res.json(newsCache.get(cacheKey).data);
            }

            // Fallback to mock data
            const mockData = getMockNews(apiCategory);
            return res.json(mockData);
        }

    } catch (error) {
        console.error("Critical Error in getNews:", error.message);
        res.status(500).json({ message: "Failed to fetch news." });
    }
};

// @desc    Get single news article
export const getNewsById = async (req, res) => {
    const { id } = req.params;

    // 1. Try In-Memory Store
    let article = articleStore.get(id);
    if (article) return res.json(article);

    // 2. Try Cache Loop
    for (const { data } of newsCache.values()) {
        const found = data.find(a => a._id === id);
        if (found) return res.json(found);
    }

    // 3. Try DB (Materialized content)
    try {
        const dbContent = await Content.findOne({ externalId: id });
        if (dbContent) return res.json(dbContent);
    } catch (err) {
        console.error("DB Error:", err);
    }

    res.status(404).json({ message: "Article not found." });
};

// @desc    Increment article view count
// @route   POST /api/news/:id/view
// @access  Public
export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if content exists in DB, if so increment.
        const content = await Content.findOne({ externalId: id });
        if (content) {
            content.views = (content.views || 0) + 1;
            await content.save();
        }
        res.status(200).json({ message: "View counted" });
    } catch (error) {
        res.status(200).json({ message: "View counted (error ignored)" });
    }
};

// @desc    Search news
// @route   GET /api/news/search
// @access  Public
export const searchNews = async (req, res) => {
    const { q, limit } = req.query;
    if (!q) return res.json([]);

    const query = q.toLowerCase();
    const results = [];

    // Search in cache
    for (const { data } of newsCache.values()) {
        // Filter by title starting with query for that "directory" feel,
        // or title/description including it.
        // We'll prioritize "Starts With" by sorting, but include all matches.
        const matches = data.filter(a =>
            a.title.toLowerCase().includes(query) ||
            (a.description && a.description.toLowerCase().includes(query))
        );
        results.push(...matches);
    }

    // Dedup by ID
    let unique = Array.from(new Map(results.map(item => [item._id, item])).values());

    // Sort alphabetically by title
    unique.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        // Exact startsWith matches come first (optional polish, but let's stick to pure alpha as requested)
        return titleA.localeCompare(titleB);
    });

    // Limit results if requested (e.g., dropdown needs 5)
    const resultLimit = limit ? parseInt(limit) : 20;

    res.json(unique.slice(0, resultLimit));
};

// @desc    Get recommended news
// @route   GET /api/news/recommendations
// @access  Public
export const getRecommendedNews = async (req, res) => {
    // Return random articles from cache
    const allArticles = [];
    for (const { data } of newsCache.values()) {
        allArticles.push(...data);
    }

    // Shuffle and pick 5
    const shuffled = allArticles.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 5));
};

// @desc    Get trending news (Top 10 by Views/Rank)
// @route   GET /api/news/trending
// @access  Public
export const getTrendingNews = async (req, res) => {
    // Collect all articles from cache
    const allArticles = [];
    for (const { data } of newsCache.values()) {
        allArticles.push(...data);
    }

    // If empty cache (server restart), generate mock
    if (allArticles.length === 0) {
        const mock = getMockNews('general');
        allArticles.push(...mock);
    }

    // Dedup by ID
    let unique = Array.from(new Map(allArticles.map(item => [item._id, item])).values());

    // Materialize/Sync with DB views if possible (omitted for speed, relying on mock rank simulation)
    // Sort by 'views' (if present) or random rank for demo
    // For a real "Trending" feel, we can use a mix of date and random factor if views are low
    unique.sort((a, b) => {
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        if (viewsA !== viewsB) return viewsB - viewsA;
        return 0.5 - Math.random(); // Random fallback
    });

    res.json(unique.slice(0, 10));
};

// @desc    Get latest news (Top 15 by Date)
// @route   GET /api/news/latest
// @access  Public
export const getLatestNews = async (req, res) => {
    const { page = 1, limit = 15 } = req.query;
    const skip = (page - 1) * limit;

    // Collect all articles
    const allArticles = [];
    for (const { data } of newsCache.values()) {
        allArticles.push(...data);
    }

    if (allArticles.length === 0) {
        const mock = getMockNews('general');
        allArticles.push(...mock);
    }

    let unique = Array.from(new Map(allArticles.map(item => [item._id, item])).values());

    // Sort by date (desc)
    unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const paginated = unique.slice(skip, skip + parseInt(limit));
    res.json(paginated);
};

// @desc    Like a news article
// @route   POST /api/news/:id/like
// @access  Private
export const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        let content = await Content.findOne({ externalId: id });

        if (!content) {
            // Materialize from store
            const article = articleStore.get(id);
            if (!article) {
                // Try finding in cache if not in store (rare but possible)
                let found = null;
                for (const { data } of newsCache.values()) {
                    found = data.find(a => a._id === id);
                    if (found) break;
                }
                if (!found) return res.status(404).json({ message: "Article not found" });

                // Use found article
                content = new Content({
                    title: found.title,
                    description: found.description,
                    content: found.content || found.description,
                    externalId: id,
                    imageUrl: found.imageUrl,
                    source: found.source,
                    url: found.url,
                    type: 'news',
                    category: found.category,
                    publishedAt: found.publishedAt,
                    likes: 0,
                    likedBy: [],
                    views: 0
                });
            } else {
                content = new Content({
                    title: article.title,
                    description: article.description,
                    content: article.content || article.description,
                    externalId: id,
                    imageUrl: article.imageUrl,
                    source: article.source,
                    url: article.url,
                    type: 'news',
                    category: article.category,
                    publishedAt: article.publishedAt,
                    likes: 0,
                    likedBy: [],
                    views: 0
                });
            }
        }

        // Check if already liked
        const isLiked = content.likedBy.includes(userId);

        if (isLiked) {
            content.likedBy = content.likedBy.filter(uid => uid.toString() !== userId.toString());
            content.likes = Math.max(0, content.likes - 1);
        } else {
            content.likedBy.push(userId);
            content.likes += 1;
        }

        await content.save();

        res.json({ likes: content.likes, liked: !isLiked });

    } catch (error) {
        console.error("Like Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
