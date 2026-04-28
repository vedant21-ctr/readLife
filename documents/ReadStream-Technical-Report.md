# ReadStream — Full Technical Project Report

> Node.js · Express · MongoDB · Next.js 16 · React 19 · Google Gemini AI
> AI-Powered · Multilingual · Full-Stack · Subscription-Based · REST API

---

## 1. Project Overview

ReadStream is a production-grade full-stack news aggregation platform. Users read news, journals, and books in one place with AI summaries (Google Gemini), multi-language UI (EN/HI/MR/ES/FR), dark/light theme, and subscription tiers (Free · Premium $9 · Supporter $29). An admin panel handles user management, content, and analytics.

---

## 2. Technology Stack

| Technology | Layer | Role |
|---|---|---|
| Node.js + Express | Backend | Non-blocking API server · routing · middleware pipeline |
| MongoDB + Mongoose | Database | NoSQL flexible schema · ODM hooks · indexes · aggregation |
| JWT + bcryptjs | Auth/Security | Stateless tokens (7d) · password hashing (10 salt rounds) |
| Helmet + CORS | Security | HTTP security headers · cross-origin request policy |
| Currents API + NewsAPI | External | Live news feed + startup seeding source |
| Google Gemini AI | AI Layer | Summaries · daily briefs · recommendations · topic extraction |
| Next.js 16 + React 19 | Frontend | App Router · SSR/CSR · file-based routing · components |
| TypeScript | Frontend | Static type checking · compile-time bug detection |
| Tailwind CSS | Styling | Utility-first · no CSS files · rapid development |
| Framer Motion | Animation | Parallax hero · scroll transitions · entrance animations |
| Recharts + react-countup | UI/Charts | 7-day reading bar chart · animated stat counters |
| React Context API | State | Global auth + language state (no Redux needed) |

---

## 3. System Architecture

Decoupled client-server design. Frontend (port 3000) calls Backend (port 5001) via REST/axios. Backend orchestrates MongoDB, live news APIs, and Gemini AI. Two-layer news pipeline: startup seeder (NewsAPI→MongoDB) + live request cache (Currents API, 15-min TTL, 3-level fallback).

```
User Browser (Chrome/Safari)
        │
        ▼
Next.js Frontend — React · TypeScript  (port 3000)
        │  HTTP/axios  REST JSON
        ▼
Express Backend — Node.js · REST API   (port 5001)
        │
   ┌────┼────────────┬──────────────┐
   ▼    ▼            ▼              ▼
MongoDB  Currents API  Gemini AI   NewsAPI
(ODM)   (Live News)  (Google)    (Seeding)
```

**Figure 1 — System Architecture Overview**

| Decision | Rationale |
|---|---|
| Decoupled FE/BE | Independent deployment · separate ports · technology-agnostic |
| RESTful API | Standard HTTP verbs · consistent JSON responses · HTTP status codes |
| Stateless JWT | No server sessions → horizontally scalable · 7-day expiry |
| Two-layer news | Startup seed ensures data on launch; live cache ensures freshness |
| Graceful degradation | All external APIs (Gemini, news) fall back to mock data if unavailable |

---

## 4. Project Structure

```
readLife/
├── readstream-backend/          Node.js + Express REST API
│   ├── config/db.js             MongoDB connection via Mongoose
│   ├── controllers/             Business logic (auth, news, content, saved,
│   │                            collections, user, ai, subscription, admin)
│   ├── middleware/
│   │   ├── auth.js              JWT protect() + admin role check
│   │   └── errorHandler.js      Global 404 + error handler (hides stack in prod)
│   ├── models/                  Mongoose schemas
│   │   └── User · Content · SavedItem · Collection · Comment
│   ├── routes/                  URL → Controller mapping (9 route files)
│   ├── services/
│   │   ├── newsService.js       Startup seeder: NewsAPI → MongoDB
│   │   └── aiService.js         Google Gemini wrapper (4 functions)
│   ├── utils/generateToken.js   jwt.sign() helper
│   └── server.js                App entry point — middleware, routes, listen
│
└── readstream-frontend/         Next.js 16 App
    ├── app/                     File-based routing (App Router)
    │   └── page · news/[id] · dashboard · login · signup · subscription · payment
    ├── components/              Navbar · NewsCard · Footer + more
    ├── contexts/                AuthContext · LanguageContext (global state)
    ├── providers/               ThemeProvider (next-themes wrapper)
    └── lib/utils.ts             cn() utility (clsx + tailwind-merge)
```

---

## 5. Database Design

### 5 Mongoose Models

```
User                Content              SavedItem
────────────        ────────────         ────────────
name, email         type                 user → User
password*           (news/journal/book)  content → Content
role, googleId      title, author        savedAt
subscription{}      externalId†          unique{user,content}‡
                    likedBy[], views

Collection          Comment
────────────        ────────────
user → User         user → User
name, description   content → Content
contents[] → Content text (max 1000)
isPublic            createdAt
```
> \* select:false = never returned  
> † sparse = allows multiple nulls  
> ‡ compound unique index

**Figure 2 — Mongoose Model Relationships**

| Model | Key Fields & Design Notes |
|---|---|
| User | name, email, password(select:false), role(user/admin), googleId, language, preferences{}, history[], subscription{plan,status,startDate,renewalDate} · pre(save) bcrypt hook · matchPassword() method |
| Content | type(news/journal/book), title, author, externalId(sparse+unique), category, description, likedBy[], views, likes, topics · text index(title+desc) · compound index(type+category) |
| SavedItem | user→User, content→Content, savedAt · compound unique{user,content} prevents double-saves |
| Collection | user→User, name, contents[], isPublic · pre(save) updates updatedAt timestamp |
| Comment | user→User, content→Content, text(max 1000) · index on {content,createdAt:-1} for fast newest-first |

---

## 6. Authentication System

```
1. Client → 2. JWT Check → 3. Route → 4. Controller
                                ↓
                    MongoDB / Currents API / Gemini AI
```
**Figure 3 — Auth & Request Processing Flow**

### Signup Flow — `POST /api/auth/signup`
1. Check email not taken
2. Create User → pre(save) → bcrypt(password, 10)
3. jwt.sign({id}, SECRET, 7d)
4. Return {user, token}

### Login Flow — `POST /api/auth/login`
1. `.select("+password")`
2. bcrypt.compare(entered, hash)
3. Match → new JWT returned
4. No match → 401

Token sent as: `Authorization: Bearer <token>`

### Middleware — auth.js
```javascript
protect: extract Bearer token → jwt.verify() → User.findById() → req.user → next()
admin:   req.user.role !== "admin" → 403 Forbidden
Google:  POST /api/auth/google → find-or-create by googleId → return JWT
```

---

## 7. API Routes Reference

| Route | Method | Auth | Description |
|---|---|---|---|
| /api/auth/signup | POST | Public | Register, returns JWT |
| /api/auth/login | POST | Public | Login, returns JWT |
| /api/auth/google | POST | Public | Google OAuth find-or-create |
| /api/auth/me | GET | Private | Get current user |
| /api/news | GET | Public | News list with category filter + pagination |
| /api/news/search | GET | Public | Full-text $text search |
| /api/news/trending | GET | Public | Top 10 by view count |
| /api/news/:id/like | POST | Private | Toggle like — materializes if needed |
| /api/news/:id/view | POST | Public | Increment view counter |
| /api/journals | GET | Public | Academic journals list |
| /api/books | GET | Public | Books list |
| /api/content/:id/summary | GET | Public | Gemini AI summary |
| /api/content/:id/comments | GET/POST | Mixed | Get or post comments |
| /api/saved | GET/POST | Private | Get bookmarks · save article |
| /api/saved/content/:id | DELETE | Private | Remove bookmark by content ID |
| /api/collections | CRUD | Private | Create/read/update/delete reading lists |
| /api/user/dashboard | GET | Private | Full user stats + history |
| /api/user/preferences | PUT | Private | Update language + categories |
| /api/summarize | POST | Public | Summarize arbitrary text via Gemini |
| /api/translate | POST | Public | Translate text to target language |
| /api/daily-brief | GET | Private | AI-generated daily news briefing |
| /api/recommendations | GET | Private | Personalized AI recommendations |
| /api/subscription | POST | Private | Update subscription plan |
| /api/admin/users | GET | Admin | List all users ($regex search) |
| /api/admin/analytics | GET | Admin | Aggregated platform statistics |

---

## 8. News Service & AI Integration

### News Pipeline — Two Layers

```
Layer 1 — Startup Seeder (newsService.js, runs 2s after boot):
  fetchAndStoreNews()  → NewsAPI → MongoDB (externalId dedup)
  fetchArxivPapers()   → mock journals → MongoDB
  fetchBooks()         → mock books → MongoDB
  Fallback: no NEWS_API_KEY → inserts mock articles

Layer 2 — Live Handler (newsController.js):
  Source:      Currents API
  Cache:       Map(), 15-min TTL, key=category
  Fallback:    API fail → stale cache → mock data
  IDs:         MD5 hash of URL/title for consistent external article IDs
  Materialization: when user likes a Currents article not yet in MongoDB:
    cached article → new Content document → save to DB → update likedBy[]
```

### Google Gemini AI Service

| Function | Input | Output |
|---|---|---|
| generateSummary(content) | Article text | 3–4 sentence summary |
| generateDailyBrief(contents) | Top articles array | 2–3 sentence daily briefing |
| generateRecommendations(prefs, saved) | User preferences | Suggested categories |
| extractTopics(content) | Article text | Array of 5 key topics/tags |

**Graceful degradation:** all 4 functions check for `GOOGLE_AI_API_KEY` first and return a placeholder string if missing — the app runs fully without the AI key.

---

## 9. Frontend Architecture

```
Routing: app/ directory (Next.js App Router)

layout.tsx              Root layout — wraps all pages with providers
page.tsx → /            news/page.tsx → /news
news/[id]/page.tsx → /news/:id
dashboard/ → /dashboard
login/ · signup/ · subscription/ · payment/

"use client" required for: useState, useEffect, event handlers, context consumers

Provider chain (layout.tsx):
ThemeProvider → LanguageProvider → AuthProvider → Navbar + {children}

AuthContext:     user, loading | login(), signup(), logout()
                 Persists to localStorage; restores session on load
LanguageContext: language(en/hi/mr) | t(key) → translated string
ThemeProvider:   next-themes; attribute="class" toggles dark on <html>
```

### Key Pages

| Page | Key Implementation Details |
|---|---|
| Home | Promise.all parallel fetch · 300ms debounce search · keyboard nav(↑↓ Enter) · Framer Motion useScroll parallax hero · 65/35 layout · Load More pagination |
| News | /news?category=X filter · `<Suspense>` required for useSearchParams() · error+retry state |
| Dashboard | 3 tabs (Overview/Saved/History) · react-countup stats · Recharts 7-day bar · reading streak algo · settings modal |
| Login/Signup | Controlled form → AuthContext.login() → localStorage → router.push("/") |
| Subscription | 3-tier pricing · Premium highlighted · paid→/payment?plan=X · free→direct API |

### NewsCard Component

Most-reused component. Two variants: **standard** (border/shadow) and **editorial** (minimal/borderless). Implements **optimistic UI** for like and bookmark — updates instantly, reverts silently on API failure. Both actions require login (alert if not).

---

## 10. Security Architecture

| Layer | Measure | Detail |
|---|---|---|
| Password | bcrypt | 10 salt rounds · pre-save hook · select:false · never returned |
| Auth | JWT | HS256-signed · 7-day expiry · stored in localStorage |
| HTTP | Helmet.js | CSP · X-Frame-Options · X-Content-Type-Options · HSTS |
| CORS | cors package | Restricted to FRONTEND_URL env variable only |
| Routes | Role middleware | protect (JWT) + admin (role===admin) stacked on sensitive routes |
| Errors | errorHandler.js | Stack traces hidden in production · generic JSON error messages |
| Input | express-validator | Extendable validation pipeline on auth and content endpoints |

---

## 11. MongoDB Advanced Features

| Feature | Where Used | Purpose |
|---|---|---|
| Text Index | Content | title+description → enables `$text:{$search:...}` full-text search |
| Compound Index | Content | {type,category} → speeds filtered listing queries |
| Compound Unique | SavedItem | {user,content} unique → no duplicate bookmarks |
| Sparse Index | Content | externalId unique but allows multiple nulls (manual content) |
| Sort Index | Comment | {content,createdAt:-1} → fast newest-first retrieval |
| Pre-save Hooks | User/Collection | User: hash password · Collection: update timestamp |
| populate() | SavedItem, Comment | Replaces ObjectId with full document (like SQL JOIN) |
| Aggregation | Admin | $group→$sort→$limit→$lookup for top-saved article analytics |

```javascript
// Admin: top 10 most-saved articles
SavedItem.aggregate([
  { $group: { _id: "$content", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  { $lookup: { from: "contents", localField: "_id", foreignField: "_id", as: "article" } }
])
```

---

## 12. Key Implementation Patterns

### Pagination
```javascript
const { page = 1, limit = 25 } = req.query;
const skip = (page - 1) * limit;
Model.find().limit(limit).skip(skip)
// Returns: items, currentPage, totalPages, total
```

### Debounce — Search (300ms)
```javascript
useEffect(() => {
  const t = setTimeout(() => {
    if (q) fetchResults(q);
  }, 300);
  return () => clearTimeout(t);
}, [searchQuery]);
```

### Optimistic UI — Like/Bookmark
```javascript
const handleLike = async () => {
  // Update UI immediately
  setLiked(p => !p);
  setCount(p => liked ? p - 1 : p + 1);
  try {
    await axios.post(url);
  } catch {
    // revert on fail
    setLiked(p => !p);
    setCount(p => liked ? p + 1 : p - 1);
  }
};
```

### Reading Streak Algorithm
```javascript
let streak = 0, d = new Date();
while (true) {
  const has = history.some(h =>
    new Date(h.viewedAt).toDateString() === d.toDateString()
  );
  if (!has) break;
  streak++;
  d.setDate(d.getDate() - 1);
}
```

---

## 13. Configuration & Setup

| Variable | Where | Req? | Description |
|---|---|---|---|
| MONGODB_URI | Backend .env | Yes | MongoDB connection string |
| JWT_SECRET | Backend .env | Yes | HMAC signing key for JWT |
| JWT_EXPIRE | Backend .env | Yes | Token TTL — e.g. 7d |
| PORT | Backend .env | Yes | Server port (default 5001) |
| NEWS_API_KEY | Backend .env | No | Currents API key (mock fallback) |
| GOOGLE_AI_API_KEY | Backend .env | No | Gemini AI key (placeholder fallback) |
| GOOGLE_CLIENT_ID | Backend .env | No | Google OAuth client ID |
| FRONTEND_URL | Backend .env | No | CORS allowed origin |
| NEXT_PUBLIC_API_URL | Frontend .env.local | Yes | Backend base URL — exposed to browser |

```bash
# Start Backend
cd readstream-backend && npm install
echo "MONGODB_URI=mongodb://localhost:27017/readstream" > .env
echo "JWT_SECRET=your_secret JWT_EXPIRE=7d PORT=5001" >> .env
npm run dev   # nodemon — auto-restarts on file save

# Start Frontend (new terminal)
cd readstream-frontend && npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
npm run dev   # → http://localhost:3000
```

---

## 14. Key Viva Questions & Answers

**Q: Why MongoDB over SQL?**
A: Flexible schema suits varied content types (news/journals/books). JSON docs map naturally to JS objects. No rigid table structure or complex migrations needed.

**Q: How does JWT work?**
A: 3 parts: Header(algo) + Payload(userId) + Signature(HMAC-SHA256). Server signs on login, client stores in localStorage, sends as Bearer token. Server verifies signature — no DB lookup. Stateless.

**Q: Why bcrypt? What are salt rounds?**
A: Bcrypt adds a random salt before hashing so identical passwords produce different hashes. 10 rounds means 2^10=1024 hash iterations — intentionally slow to resist brute-force. `select:false` ensures password never leaks in API responses.

**Q: What is Express middleware?**
A: Functions in the request pipeline with access to req, res, next(). Called with app.use(). Examples: protect (JWT), helmet (security headers), morgan (logging), cors (cross-origin). Run in order of declaration.

**Q: What is CORS and why needed?**
A: Browsers block cross-origin requests by default. Backend on port 5001 must set CORS headers permitting requests from frontend on port 3000. The cors npm package handles this automatically.

**Q: React Context vs Redux?**
A: Context = built-in global state, no extra library. Used here for auth (user, login/logout) and language (t() function). Redux adds middleware, devtools, time-travel — overkill for this scale.

**Q: What is debouncing?**
A: Delays function execution until user stops triggering events. Search bar waits 300ms after last keystroke — prevents an API call on every single character typed.

**Q: What is optimistic UI?**
A: UI updates instantly before server confirms. Like button increments immediately. If API fails, state reverts. Makes app feel faster — no waiting for server round-trip.

**Q: What is materialization?**
A: Currents API articles exist only in memory cache. When a user likes one, the backend creates a permanent MongoDB Content document from cached data before updating likes. Ephemeral → durable.

**Q: What is a sparse index?**
A: MongoDB index that only covers documents where the field exists and is non-null. Used on externalId — manually added content has no external ID (null), and a regular unique index would reject multiple nulls.

**Q: SSR vs CSR in Next.js?**
A: SSR: HTML generated on server per request — better SEO, faster first paint. CSR: HTML built in browser — more interactive. `"use client"` directive switches a component to CSR. Next.js supports both.

**Q: What does Helmet do?**
A: Sets HTTP security response headers: Content-Security-Policy (XSS), X-Frame-Options (clickjacking), X-Content-Type-Options (MIME sniffing), Strict-Transport-Security (HTTPS), and others.

**Q: How does subscription work?**
A: User picks plan → POST /api/subscription {plan} → backend updates user.subscription in MongoDB with plan, status, startDate, renewalDate. Payment is mocked — no real gateway integrated.

---

## 15. Glossary of Terms

| Term | Definition |
|---|---|
| REST API | HTTP verbs (GET/POST/PUT/DELETE) for CRUD · stateless · JSON responses |
| JWT | JSON Web Token · Header.Payload.Signature · signed with HMAC-SHA256 |
| bcrypt | Password hashing with adaptive salt rounds · brute-force resistant |
| Middleware | Express pipeline function · req, res, next · applied with app.use() |
| ODM / Mongoose | Object Data Modeling · maps JS objects to MongoDB documents |
| populate() | Replaces ObjectId with full document — analogous to SQL JOIN |
| Sparse Index | MongoDB index only covering non-null field values |
| Aggregation | MongoDB pipeline: $match $group $sort $limit $lookup |
| SSR / CSR | Server-Side vs Client-Side Rendering (Next.js supports both) |
| "use client" | Next.js directive enabling browser-side React features |
| Context API | React global state without prop drilling — no Redux needed |
| Debounce | Execute function only after events pause — reduces API calls |
| Optimistic UI | Update UI before server confirms · revert on failure |
| Materialization | Converting a cached/ephemeral object into a permanent DB record |
| externalId | Third-party API article ID stored in MongoDB to prevent duplicates |
| select:false | Mongoose field option · excluded from query results by default |
| CORS | Browser cross-origin policy · server must explicitly permit origins |
| Helmet | Express middleware setting 11 HTTP security headers automatically |
| salt rounds | bcrypt iterations (2^n) · higher = slower hash · default 10 |
| Compound Index | Multi-field index · speeds queries filtering on multiple fields |

---

## 16. Project Summary

| Domain | Key Achievements & Features |
|---|---|
| Backend API | 30+ REST endpoints · JWT auth · bcrypt · Helmet · CORS · paginated responses |
| Database | 5 Mongoose models · text/compound/sparse indexes · aggregation · populate · hooks |
| News Pipeline | Startup seed (NewsAPI) + live cache (Currents API) · 15-min TTL · 3-level fallback · materialization |
| AI Integration | Gemini Pro: summaries · daily briefs · recommendations · topic extraction · graceful degradation |
| Frontend | Next.js App Router · TypeScript · Context state · Tailwind · Framer Motion parallax |
| UX Patterns | Optimistic UI · 300ms debounce · keyboard nav · streak algorithm · CountUp stats |
| Security | JWT + bcrypt + Helmet + CORS + select:false + role-based admin middleware |
| Multi-language | EN/HI/MR/ES/FR via LanguageContext · t(key) translation function · per-user preference |
| Subscriptions | Free · Premium ($9) · Supporter ($29) · stored on User model · admin upgradeable |
| Admin Panel | User list ($regex search) · manual content add · analytics (aggregation pipeline) |

---

*ReadStream — Full Technical Report · Node.js · Next.js · MongoDB · Google Gemini AI*
