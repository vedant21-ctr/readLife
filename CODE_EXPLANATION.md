# ReadStream - Architecture & Technical Reference

## Table of Contents
1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)  
3. [Key Patterns](#key-patterns)
4. [Core Concepts](#core-concepts)

---

## Backend Architecture

### Express.js Server & Middleware

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
```

**Key Components:**
- `dotenv` loads environment variables
- `cors()` enables cross-origin requests
- `express.json()` parses JSON request bodies
- File-based routing structure mirrors `/api/*` endpoints

### Database Connection

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    process.exit(1);
  }
};
```

### Authentication with JWT

```javascript
// middleware/auth.js
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

Key pattern: Bearer tokens in Authorization header, JWT verification on protected routes.

### Data Models

User schema with password hashing:
```javascript
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**Collections**: User, Content, Collection, SavedItem, Comment with appropriate indexing and validation.

### AI Integration

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateSummary = async (content) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

Uses Google Gemini API for content summarization.

---

## Frontend Architecture

### Next.js App Router (TypeScript)

```typescript
'use client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return <button onClick={() => router.push('/news')}>Navigate</button>;
}
```

File structure: `app/[route]/page.tsx` maps to URLs. `'use client'` directive enables client-side rendering.

### State Management & Data Fetching

```typescript
import { useState, useEffect } from 'react';

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/endpoint', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

- `useState` manages component state
- `useEffect` handles side effects and data fetching
- Token stored in localStorage and passed in request headers

### API Client

```typescript
// lib/api.ts
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token');
  const headers = { 
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) throw new Error('Request failed');
  return response.json();
};
```

Centralized API handling with automatic token injection.

### Form Handling

```typescript
const [form, setForm] = useState({ email: '', password: '' });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    localStorage.setItem('token', result.token);
  } catch (error) {
    console.error(error);
  }
};
```

Controlled components with spread operators for immutable state updates.

### UI & Animations

Uses Tailwind CSS for styling and Framer Motion for animations:
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

## Key Patterns

### Error Handling

**Backend**: Try-catch with appropriate HTTP status codes
```javascript
try {
  const result = await operation();
  res.json(result);
} catch (error) {
  res.status(400).json({ message: error.message });
}
```

**Frontend**: Error boundary with try-catch-finally
```javascript
try {
  setLoading(true);
  const data = await fetch();
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

### Async/Await Pattern

Preferred over Promise chains for readability:
```javascript
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
};
```

### Middleware Pattern

Express middleware executes in sequence, passing control with `next()`:
```javascript
app.use(authMiddleware);
app.use(corsMiddleware);
app.get('/route', routeHandler);
```

### Component Composition

Parent passes props to child components:
```typescript
<NewsCard title={item.title} content={item.content} />
```

---

## Core Concepts

### Authentication Flow

1. User signs up/logs in
2. Server validates credentials and generates JWT
3. Frontend stores token in localStorage
4. Subsequent requests include token in Authorization header
5. Protected routes verify token with auth middleware

### Database Schema Structure

- **User**: name, email, password (hashed), role
- **Content**: title, description, source, category
- **Collection**: userId, name, contentIds
- **SavedItem**: userId, contentId, savedDate
- **Comment**: userId, contentId, text, timestamp

### HTTP Status Codes

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `404 Not Found` - Resource doesn't exist
- `500 Server Error` - Internal error

### JavaScript Features Used

| Feature | Purpose |
|---------|---------|
| ES6 Modules | Code organization |
| `async/await` | Asynchronous operations |
| Destructuring | Extract object/array values |
| Spread operator `...` | Copy & merge objects/arrays |
| Arrow functions | Concise function syntax |
| Template literals | String interpolation |
| Optional chaining `?.` | Safe property access |
| Nullish coalescing `??` | Default value handling |

### REST API Endpoints

```
GET    /api/news          - Fetch all news
POST   /api/news          - Create news (admin)
GET    /api/user/profile  - Get user profile
POST   /api/collections   - Create collection
GET    /api/saved         - Get saved items
```

---

## Development Setup

```bash
# Backend
cd readstream-backend
npm install
npm run dev  # Requires .env with PORT, MONGODB_URI, JWT_SECRET

# Frontend
cd readstream-frontend
npm install
npm run dev  # Requires .env.local with NEXT_PUBLIC_API_URL
```

All API communication assumes backend running on port 5001, frontend on port 3000.
JWT_SECRET=your_secret
GOOGLE_AI_API_KEY=your_key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 📝 Summary

**Backend Stack:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI
- RESTful API

**Frontend Stack:**
- Next.js 14 (React 18)
- TypeScript
- Framer Motion
- Fetch API
- LocalStorage

**Key Concepts:**
- Async/Await
- Promises
- REST API
- JWT
- React Hooks
- State Management
- Error Handling
- Middleware
- Authentication
- Database Models

---

**Remember:** Focus on understanding concepts, not memorizing code. Be able to explain WHY you used something, not just WHAT it does.

Good luck with your interview! 🎉
