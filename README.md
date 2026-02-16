# 🚀 ReadStream - AI-Powered Knowledge Hub

> An intelligent content aggregation platform that brings together news, academic papers, and books with AI-powered summaries and personalized recommendations.

![Made with Next.js](https://img.shields.io/badge/Next.js-14-black)
![Made with Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-blue)

## ✨ Features

- 📰 **News Aggregation** - Stay updated with latest news from multiple sources
- 📚 **Academic Papers** - Access thousands of research papers and journals
- 📖 **Book Discovery** - Find and explore books across all genres
- 🤖 **AI Summaries** - Get instant AI-generated summaries using Google Gemini
- 💾 **Save & Organize** - Save content and organize into collections
- 📅 **Daily Briefing** - Personalized AI-generated daily content briefing
- 💬 **Comments** - Engage with content through comments
- 🔍 **Search** - Global search across all content
- 👤 **User Profiles** - Customize preferences and reading habits
- 📊 **Admin Dashboard** - Analytics and user management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Glassmorphism UI** - Modern, clean design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Google Gemini AI** - AI-powered features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Google AI Studio API key (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vedant21-ctr/ReadStream.git
cd ReadStream
```

2. **Setup Backend**
```bash
cd readstream-backend
npm install

# Create .env file
cp .env.example .env
# Add your MongoDB URI and API keys
```

3. **Setup Frontend**
```bash
cd readstream-frontend
npm install
```

4. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd readstream-backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd readstream-frontend
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GOOGLE_AI_API_KEY=your_google_ai_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📁 Project Structure

```
ReadStream/
├── readstream-backend/          # Express.js backend
│   ├── config/                  # Database configuration
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Custom middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   └── server.js               # Entry point
│
├── readstream-frontend/         # Next.js frontend
│   ├── app/                    # Next.js app directory
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── news/              # News page
│   │   ├── journals/          # Journals page
│   │   ├── books/             # Books page
│   │   ├── saved/             # Saved items
│   │   ├── collections/       # Collections
│   │   ├── daily-brief/       # Daily briefing
│   │   ├── profile/           # User profile
│   │   ├── admin/             # Admin dashboard
│   │   └── content/[id]/      # Content detail
│   ├── components/            # Reusable components
│   └── lib/                   # Utilities & API client
│
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Content
- `GET /api/news` - Get news articles
- `GET /api/journals` - Get academic papers
- `GET /api/books` - Search books
- `GET /api/content/:id` - Get content details
- `GET /api/content/:id/summary` - Get AI summary

### User Features
- `GET /api/saved` - Get saved items
- `POST /api/saved` - Save content
- `GET /api/collections` - Get collections
- `POST /api/collections` - Create collection
- `GET /api/daily-brief` - Get daily briefing
- `GET /api/recommendations` - Get AI recommendations

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform statistics

## 🤖 AI Features

### Content Summarization
Uses Google Gemini AI to generate concise 3-4 sentence summaries of any content.

### Daily Briefing
AI-generated personalized briefing based on user preferences and reading history.

### Recommendations
Intelligent content recommendations based on saved items and user behavior.

## 🎨 Design System

- **Glassmorphism** - Modern frosted glass effect
- **Neutral Colors** - Clean white, gray, and soft black
- **Accent Color** - Indigo (#6366f1)
- **Typography** - Inter font family
- **Animations** - Smooth Framer Motion transitions

## 📱 Features by Page

| Page | Features |
|------|----------|
| Home | Hero section, features showcase, CTA |
| News | Browse news with search & pagination |
| Journals | Academic papers with filters |
| Books | Book search and discovery |
| Content Detail | Full article, AI summary, comments |
| Saved | View saved content with filters |
| Collections | Organize content into collections |
| Daily Brief | AI-generated personalized briefing |
| Profile | User settings & preferences |
| Admin | Analytics & user management |

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- MongoDB injection prevention

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service in Render
3. Add environment variables
4. Deploy!

## 📊 Performance

- Backend response time: < 100ms
- AI summary generation: 2-3 seconds
- Page load time: < 1 second
- Optimized database queries with indexes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vedant S**

- GitHub: [@vedant21-ctr](https://github.com/vedant21-ctr)

## 🙏 Acknowledgments

- Google Gemini AI for AI features
- MongoDB Atlas for database hosting
- Vercel for frontend hosting
- Render for backend hosting

---

**Made with ❤️ by Vedant S**

⭐ Star this repo if you find it helpful!
