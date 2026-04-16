# 🚀 ReadStream - AI-Powered Knowledge Hub

> A modern, full-stack intelligent content aggregation platform that brings together news, academic papers, and books with AI-powered summaries and personalized recommendations. Built with Next.js + TypeScript on the frontend and Node.js on the backend.

![Made with TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Made with Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-blueviolet)

## ✨ Key Features

### Content Management
- 📰 **News Aggregation** - Real-time news from multiple reliable sources
- 📚 **Academic Papers** - Thousands of research papers and journals at your fingertips
- 📖 **Book Discovery** - Explore millions of books across all genres
- 🔍 **Global Search** - Powerful search functionality across all content types

### AI & Personalization
- 🤖 **AI Summaries** - Instant AI-generated summaries powered by Google Gemini
- 🎯 **Smart Recommendations** - Personalized content suggestions based on your reading history
- 📅 **Daily Briefing** - Tailored daily briefing with trending topics in your interests
- 💡 **Intelligent Insights** - Context-aware information extraction

### User Experience
- 💾 **Save & Organize** - Save content and organize into custom collections
- 💬 **Community Engagement** - Comment on content and discuss with other readers
- 👤 **User Profiles** - Customize preferences, reading habits, and notification settings
- 📊 **Reading Analytics** - Track your reading progress and statistics

### Admin & Moderation
- 📊 **Admin Dashboard** - Comprehensive analytics and platform statistics
- 👥 **User Management** - Monitor users and manage platform health
- 📈 **Performance Metrics** - Real-time performance monitoring

## 🛠️ Tech Stack

### Frontend (TypeScript + Next.js)
- **Next.js 14** - Modern React framework with App Router and Server Components
- **React 18** - Declarative UI library
- **TypeScript 5.0** - Static type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Framer Motion** - Smooth, performant animations and transitions
- **Glassmorphism UI** - Modern frosted glass design patterns
- **ESLint** - Code quality and consistency

### Backend (Node.js)
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Lightweight and flexible web framework
- **MongoDB Atlas** - Scalable NoSQL cloud database
- **Mongoose** - Elegant MongoDB object modeling
- **JWT (JSON Web Tokens)** - Secure authentication mechanism
- **Google Gemini AI** - Advanced AI capabilities for content summarization
- **Bcrypt** - Secure password hashing
- **Nodemon** - Development auto-reload

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn package manager
- **MongoDB Atlas** account (free tier available at [mongodb.com/cloud](https://www.mongodb.com/cloud))
- **Google AI Studio** API key (free at [aistudio.google.com](https://aistudio.google.com))
- Git installed on your machine

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/vedant21-ctr/readLife.git
cd readLife
```

#### 2. Backend Configuration
```bash
cd readstream-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials (MongoDB URI, API keys, etc.)
nano .env
```

#### 3. Frontend Configuration (TypeScript)
```bash
cd ../readstream-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API endpoint if needed
nano .env.local
```

#### 4. Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd readstream-backend
npm run dev
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend Server (TypeScript + Next.js):**
```bash
cd readstream-frontend
npm run dev
# Frontend runs on http://localhost:3000
```

#### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 🔑 Environment Variables

### Backend Configuration (.env)
```env
# Server Configuration
PORT=5001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/readlife?retryWrites=true

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# AI Service
GOOGLE_AI_API_KEY=your-google-gemini-api-key

# CORS & Frontend
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Configuration (.env.local)
```env
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Optional: Analytics, third-party services can be added here
```

**Note:** Never commit `.env` files to version control. They should be in `.gitignore`.

## 📁 Project Structure

```
readLife/
├── readstream-backend/              # Express.js backend API
│   ├── config/                      # Database configuration
│   ├── controllers/                 # Request handlers & business logic
│   ├── middleware/                  # Custom middleware (auth, error handling)
│   ├── models/                      # Mongoose schemas & models
│   ├── routes/                      # API endpoint definitions
│   ├── services/                    # Core business logic & utilities
│   ├── utils/                       # Helper functions
│   ├── server.js                   # Express server entry point
│   ├── package.json                # Dependencies
│   └── nodemon.json                # Development configuration
│
├── readstream-frontend/             # Next.js + TypeScript frontend
│   ├── app/                        # Next.js App Router directory
│   │   ├── layout.tsx              # Root layout component
│   │   ├── page.tsx                # Home page
│   │   ├── login/                  # Authentication pages
│   │   ├── signup/                 # User registration
│   │   ├── news/                   # News feed
│   │   ├── trending/               # Trending content
│   │   ├── dashboard/              # User dashboard
│   │   ├── payment/                # Payment & subscription
│   │   └── subscription/           # Subscription management
│   ├── components/                 # Reusable React components (TypeScript)
│   │   ├── Navbar.tsx             # Navigation component
│   │   ├── NewsCard.tsx           # News article card
│   │   ├── HotNewsSlider.tsx      # Carousel component
│   │   ├── SmoothScroll.tsx       # Scroll utilities
│   │   └── ui/                    # UI components
│   ├── contexts/                   # React Context (TypeScript)
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── LanguageContext.tsx    # Localization state
│   ├── lib/                        # Utilities & helpers (TypeScript)
│   │   ├── api.ts                 # API client
│   │   ├── auth.ts                # Authentication utilities
│   │   └── utils.ts               # General utilities
│   ├── providers/                  # Context providers
│   ├── public/                     # Static assets
│   ├── globals.css                # Global styles
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── next.config.ts             # Next.js configuration
│   ├── eslint.config.mjs          # ESLint rules
│   └── package.json               # Dependencies
│
└── README.md                        # This file
```

## 🎯 API Endpoints

### Authentication (`/api/auth`)
```
POST   /auth/signup              - Register a new user account
POST   /auth/login               - Login and receive JWT token
GET    /auth/me                  - Get current authenticated user
```

### News Content (`/api/news`)
```
GET    /news                     - Fetch news articles with pagination
GET    /news/:id                 - Get detailed news article
GET    /news/search              - Search news by keywords
```

### User Features (`/api/saved`, `/api/collections`)
```
GET    /saved                    - Retrieve all saved items
POST   /saved                    - Save a new item
DELETE /saved/:id               - Remove a saved item

GET    /collections              - Get user's collections
POST   /collections              - Create a new collection
PUT    /collections/:id          - Update collection
DELETE /collections/:id          - Delete collection
```

### AI Features (`/api/ai`)
```
POST   /ai/summarize             - Generate AI summary for content
GET    /ai/recommendations       - Get personalized recommendations
GET    /ai/daily-brief           - Get daily AI briefing
```

### Admin (`/api/admin`)
```
GET    /admin/users              - Get all users (admin only)
GET    /admin/analytics          - Get platform analytics (admin only)
GET    /admin/stats              - Get system statistics (admin only)
```

## 🤖 AI Features

### Content Summarization
- Utilizes **Google Gemini AI** to generate concise, accurate summaries
- Produces 3-4 sentence abstracts capturing key information
- Handles multiple content formats: articles, papers, and book descriptions
- Instant processing with caching to optimize API usage

### Personalized Daily Briefing
- AI-generated daily digest tailored to user preferences
- Aggregates trending topics from reading history
- Summarizes multiple content pieces into cohesive briefing
- Delivered at user-configured time

### Intelligent Recommendations
- ML-powered suggestion engine analyzing user behavior
- Considers saved items, reading patterns, and engagement metrics
- Adapts to evolving user interests over time
- Surfaces high-quality, relevant content

## 🛠️ Development Workflow

### Frontend Development (TypeScript)
```bash
# Start dev server with hot reload
cd readstream-frontend
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run start
```

### Backend Development
```bash
# Start with auto-reload (nodemon)
cd readstream-backend
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### TypeScript Configuration
- Strict mode enabled for type safety
- ESLint configured for consistent code style
- Source maps for easier debugging
- Path aliases configured for clean imports

## 🎨 Design System

### Visual Design
- **Glassmorphism** - Modern frosted glass effect for contemporary UI
- **Color Palette** - Clean neutrals (white, gray, soft black) with indigo accents
- **Accent Color** - Indigo (#6366f1) for interactive elements and CTAs
- **Typography** - Inter font family for optimal readability
- **Spacing** - Consistent 8px grid system for harmonious layouts

### Frontend Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS breakpoints
- **Smooth Animations** - Framer Motion for polished interactions
- **Skeleton Loading** - UI placeholders for better perceived performance
- **Accessibility** - WCAG compliance for inclusive user experience

### Interactive Elements on Pages
| Component | Tech Stack | Notes |
|-----------|-----------|-------|
| Navigation | React + TypeScript | Persistent header with mobile menu |
| News Cards | React + Tailwind | Hover effects with Framer Motion |
| Carousels | Framer Motion | Smooth transitions between slides |
| Modals | React + TypeScript | Accessible dialog components |
| Comments | React + TypeScript | Real-time feedback interface |

## 🔐 Security Features

### Authentication & Authorization
- 🔑 **JWT Tokens** - Industry-standard JSON Web Token authentication
- 🔒 **Password Security** - Bcrypt hashing with salt rounds for secure password storage
- 🛡️ **Protected Routes** - Middleware-based route protection both frontend and backend
- 👤 **Role-Based Access Control** - Admin-only endpoints with permission verification

### Data Protection
- 🚫 **CORS Configuration** - Restricted cross-origin requests for API security
- ✅ **Input Validation** - Comprehensive validation on all user inputs
- 🛡️ **MongoDB Injection Prevention** - Sanitized queries and parameterized statements
- 🔐 **Environment Secrets** - Sensitive keys never exposed in codebase

### Best Practices
- Rate limiting on sensitive endpoints (planned)
- HTTPS enforcement in production deployments
- Regular security audits and dependency updates
- Error handling without revealing sensitive information

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. **Push to GitHub** - Ensure code is committed and pushed
2. **Import in Vercel** - Go to [vercel.com](https://vercel.com), import repository
3. **Configure Environment**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.render.com/api
   ```
4. **Deploy** - Vercel automatically deploys on each push

### Backend Deployment (Render or Railway)
1. **Push to GitHub** - Ensure code is committed and pushed
2. **Create Web Service** - Create new service on Render/Railway
3. **Configure Environment** - Add all variables from `.env`
4. **Deploy** - Choose branch and deploy
5. **Verify** - Test API endpoints from deployed URL

### Production Checklist
- [ ] Update API URLs in environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Review security settings
- [ ] Test all features in production
- [ ] Set up CI/CD pipeline

## ⚡ Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Backend Response Time | < 100ms | ✅ |
| AI Summary Generation | 2-3 seconds | ✅ |
| Page Load Time | < 1 second | ✅ |
| TypeScript Build Time | < 30s | ✅ |
| Database Query Time | < 50ms | ✅ |

### Optimization Techniques
- Next.js Server Components for reduced client JS
- API response caching strategies
- Database indexing on frequently queried fields
- Image optimization via Next.js Image component
- Code splitting and lazy loading

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port
lsof -i :5001  # backend
lsof -i :3000  # frontend

# Kill process
kill -9 <PID>
```

**MongoDB Connection Failed**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is active

**TypeScript Errors**
```bash
cd readstream-frontend
npm run type-check
```

**API Not Responding**
- Verify backend is running: `curl http://localhost:5001/api`
- Check CORS settings in backend
- Review browser console for errors

**Build Failures**
- Clear node modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Review build logs for specific errors

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, features, or documentation improvements, your help is appreciated.

### How to Contribute
1. **Fork the repository** - Click the fork button on GitHub
2. **Create a branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Edit files and commit with clear messages
4. **Push to branch** - `git push origin feature/amazing-feature`
5. **Open Pull Request** - Describe your changes and link related issues

### Development Guidelines
- Follow existing code style and patterns
- Use TypeScript for all frontend components
- Write meaningful commit messages
- Add comments for complex logic
- Test changes before submitting PR
- Update documentation as needed

### Reporting Issues
Please open an issue on GitHub including:
- Problem description and steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error messages if applicable

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vedant S**

- GitHub: [@vedant21-ctr](https://github.com/vedant21-ctr)

## � Resources & Documentation

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type-safe JavaScript
- [Express.js API](https://expressjs.com/) - Backend framework
- [MongoDB Docs](https://docs.mongodb.com/) - Database documentation
- [Google Gemini API](https://ai.google.dev/) - AI features

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [RESTful API Best Practices](https://restfulapi.net/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Useful Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Git](https://git-scm.com/) - Version control
