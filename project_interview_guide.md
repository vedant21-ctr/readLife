# ReadStream - Project Interview Guide

## 🚀 Project Overview
**ReadStream** is an intelligent content aggregation platform that brings together news, academic papers, and books into a single, unified interface. It uses **Google Gemini AI** to provide instant summaries, making it easier for users to digest large amounts of information.

**Elevator Pitch:** "ReadStream is a 'Spotify for Knowledge'—a unified hub where I can track news, search research papers, and discover books, all enhanced with AI-powered summarization to save time."

---

## 🛠️ Technology Stack

### **Frontend (Client-Side)**
*   **Framework:** **Next.js 14** (App Router) - Chosen for its server-side rendering (SSR) capabilities, SEO benefits, and robust routing system.
*   **Language:** **TypeScript** - Ensures type safety, reducing bugs and making the codebase easier to maintain.
*   **Styling:** **CSS Modules** & **Vanilla CSS** - _(Critical Point)_ We initially used Tailwind but migrated to **CSS Modules** to have absolute control over the "Cosmic Glass" layout and avoid utility class conflicts, ensuring pixel-perfect alignment.
*   **Animations:** **Framer Motion** - Used for complex animations like the floating entry effects and smooth transitions on the landing page.
*   **Icons:** **Lucide React** - Lightweight, consistent icon set.

### **Backend (Server-Side)**
*   **Runtime:** **Node.js** - Javascript runtime for scalable network applications.
*   **Framework:** **Express.js** - Minimalist web framework to handle RESTful API routes.
*   **Database:** **MongoDB** (via **Mongoose**) - NoSQL database chosen for its flexibility in storing unstructured data like disparate content types (articles, books, papers).
*   **Authentication:** **JWT (JSON Web Tokens)** - Stateless authentication flow.
*   **AI Integration:** **Google GoogleGenerativeAI (Gemini)** - powered by the `@google/generative-ai` SDK.

---

## 🏗️ System Architecture

The application follows a standard **Client-Server Architecture**:

1.  **Client (Next.js)**: Handles the UI, user interactions, and fetching data. It runs on port `3000`.
2.  **Server (Express)**: Exposes a REST API at `http://127.0.0.1:5001/api`.
3.  **Database (MongoDB)**: Stores `Users`, `Content`, and `UserPreferences`.

**Data Flow:**
1.  User requests "News" -> Frontend calls `GET /api/content?type=news` -> Backend queries MongoDB -> Returns JSON -> Frontend renders UI.
2.  User clicks "Summarize" -> Frontend calls `POST /api/ai/summarize` -> Backend calls Gemini API -> Returns summary -> UI displays it.

---

## ✨ Key Features & Implementation Details

### 1. **"Cosmic Glass" Design System**
*   **Concept:** A premium, dark-mode-first aesthetic inspired by nebula colors (Deep Indigo, Violet, Cyan).
*   **Implementation:** We created a `globals.css` with CSS variables (`--bg-deep`, `--glass-bg`) and utility classes (`.glass-panel`) to reuse the frosted glass effect everywhere.
*   **Why?** To provide a unique, modern, and immersive reading experience that stands out from generic dashboards.

### 2. **Authentication (Auth)**
*   **Flow:** Users sign up/login. The backend validates credentials and issues a **JWT**.
*   **Storage:** The frontend stores this token (typically in `localStorage` or cookies) and attaches it to the `Authorization` header (`Bearer <token>`) for subsequent requests to protected routes.

### 3. **AI Summarization**
*   **Feature:** Users can get a concise summary of long articles.
*   **How it works:** We send the article content/text to the **Gemini Pro** model via the backend. We use a specific prompt: *"Summarize this article in 3 bullet points..."* to ensure consistent output.

### 4. **Content Aggregation**
*   **Unified Model:** In MongoDB, we have a generic `Content` schema that can store different types (`news`, `journal`, `book`) with fields like `title`, `source`, `url`, `author`.
*   **Performance:** We use database indexing on the `type` field to ensure fast filtering.

---

## ❓ Common Interview Questions & Answers

**Q: Why did you switch from Tailwind to CSS Modules?**
**A:** "While Tailwind is great for speed, we encountered specific specificity conflicts and alignment issues with our complex 'Cosmic Glass' layout. Switching to CSS Modules allowed us to write standard CSS Grid/Flexbox code (`page.module.css`), giving us granular control over the responsive grid and ensuring the UI was pixel-perfect and stable."

**Q: How do you handle expensive AI API calls?**
**A:** "Currently, we call the API on-demand. In a production environment, we would implement **Caching** (e.g., trying to find if a summary for this URL already exists in our database) before calling Gemini, to save costs and reduce latency."

**Q: How is the project structured?**
**A:**
*   `/app`: Next.js App Router pages (`page.tsx` is Home, `/news/page.tsx` is News feed).
*   `/components`: Reusable UI parts (`Navbar`, `ContentCard`).
*   `/lib`: Helper functions (`api.ts` for backend calls).
*   `globals.css`: The central theme definition file.

**Q: What was the hardest bug you fixed?**
**A:** "We had a persistent issue where the PostCSS configuration was incorrectly trying to load uninstalled plugins, breaking the build. We had to simplify the `postcss.config.js` to strictly use `tailwindcss` (before we migrated away) and `autoprefixer`, and ensure our dependencies in `package.json` matched the configuration."

---

## 📂 Key Files to Show

1.  **`app/page.tsx` & `app/page.module.css`**: The implementation of the Landing Page and the CSS Modules migration.
2.  **`app/globals.css`**: The definition of the "Cosmic Glass" theme variables.
3.  **`lib/api.ts`**: The central networking layer for API calls.
4.  **Backend `server.js`**: The entry point for the API key and database connection.
