# ReadLife — UML & Architecture Diagrams

> ER Diagram · Sequence Diagram · Use Case Diagram · Class Diagram

---

## 1. Advanced ER Diagram
**Entity-Relationship Model — ReadLife Database Design**

Shows entities: User, Content, Comment, Collection, UserContent and their relationships.
UserContent acts as a junction table linking Users to Content for bookmarks and history.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ReadLife - Advanced ER Diagram                   │
│                                                                     │
│                              ┌──────────────────┐                  │
│                              │  (E) Collection  │                  │
│                              │──────────────────│                  │
│                              │ • collection_id  │                  │
│                              │   (PK)           │                  │
│                              │ name             │                  │
│                              │ description      │                  │
│                              └────────┬─────────┘                  │
│                                       │ contains                   │
│                                       │                            │
│  ┌──────────────────┐         ┌───────▼──────────┐                 │
│  │    (E) User      │         │   (E) Content    │                 │
│  │──────────────────│         │──────────────────│                 │
│  │ • user_id (PK)   │         │ • content_id(PK) │                 │
│  │ name             │         │ type             │                 │
│  │ email            │ Derived:│ title            │                 │
│  │ password         │─activityScore              │                 │
│  │ {multi}          │         │ summary          │                 │
│  │ preferences      │         │ publishedAt      │                 │
│  └──────┬───────────┘         └──────┬───────────┘                 │
│         │                            │                             │
│         │ writes      interacts  has │ linked                      │
│         │                            │                             │
│  ┌──────▼───────────┐    ┌───────────▼──────────┐                  │
│  │   (E) Comment    │    │  (E) UserContent     │                  │
│  │──────────────────│    │──────────────────────│                  │
│  │ • comment_id(PK) │    │ • id (PK)            │                  │
│  │ text             │    │ user_id (FK)         │                  │
│  │ createdAt        │    │ content_id (FK)      │                  │
│  └──────────────────┘    │ type(bookmark/history│                  │
│                          └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Entities & Relationships

| Entity | Primary Key | Key Attributes | Relationships |
|---|---|---|---|
| User | user_id (PK) | name, email, password, {multi} preferences | writes Comments, interacts via UserContent |
| Content | content_id (PK) | type, title, summary, publishedAt | contained in Collection, linked via UserContent |
| Comment | comment_id (PK) | text, createdAt | written by User, belongs to Content |
| Collection | collection_id (PK) | name, description | contains Content |
| UserContent | id (PK) | user_id (FK), content_id (FK), type (bookmark/history) | junction table — links User ↔ Content |

### Key Design Notes
- **UserContent** is a junction/bridge entity — it represents the many-to-many relationship between User and Content
- `type` field on UserContent distinguishes between `bookmark` and `history` interactions
- `activityScore` is a **derived attribute** — calculated from user's reading history, not stored directly
- `{multi} preferences` — multi-valued attribute (user can have multiple preference categories)
- Collection → Content is a **one-to-many** relationship (one collection holds many content items)

---

## 2. UML Sequence Diagram
**AI Summary Flow — User → Frontend → Backend → DB → Gemini AI**

Illustrates the step-by-step interaction when a user requests an AI-generated article summary.
Backend fetches content from DB, sends to Gemini API, and returns the summary to the UI.

```
User        Frontend UI      Backend API       Database       Gemini AI
 │               │                │                │               │
 │ Request       │                │                │               │
 │ Summary ─────►│                │                │               │
 │               │ Send API       │                │               │
 │               │ Request ──────►│                │               │
 │               │                │                │               │
 │               │         ╔══════╧══════╗         │               │
 │               │         ║ Fetch       ║         │               │
 │               │         ║ Content     ║         │               │
 │               │         ╚══════╤══════╝         │               │
 │               │                │ Query          │               │
 │               │                │ Content ──────►│               │
 │               │                │◄─ Return       │               │
 │               │                │   Content Data─┘               │
 │               │                │                                │
 │               │         ╔══════╧══════╗                         │
 │               │         ║ AI          ║                         │
 │               │         ║ Processing  ║                         │
 │               │         ╚══════╤══════╝                         │
 │               │                │ Generate Summary ─────────────►│
 │               │                │◄────────────── Return Summary──┘
 │               │                │                                │
 │               │◄── Send        │                                │
 │               │    Response ───┘                                │
 │◄── Display    │                                                  │
 │    Summary ───┘                                                  │
```

### Step-by-Step Flow

| Step | Actor | Action |
|---|---|---|
| 1 | User | Clicks "Summarize with AI" on an article |
| 2 | Frontend UI | Sends `GET /api/content/:id/summary` to Backend API |
| 3 | Backend API | Checks if `content.summary` already exists in DB |
| 4 | Backend API | If not cached → queries MongoDB for full content data |
| 5 | Database | Returns content document (title, description) |
| 6 | Backend API | Calls `generateSummary(content)` in aiService.js |
| 7 | aiService.js | Sends prompt to Google Gemini API (`gemini-pro` model) |
| 8 | Gemini AI | Generates 3–4 sentence summary, returns text |
| 9 | Backend API | Saves summary back to Content document in DB |
| 10 | Backend API | Returns `{ summary }` JSON to Frontend |
| 11 | Frontend UI | Displays summary to User |

---

## 3. UML Use Case Diagram
**System Actors & Use Cases — Admin and User Interactions**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ReadLife System                                │
│                                                                         │
│  ┌───────┐    ╭──────────────────╮                                      │
│  │       │───►│  View Analytics  │                                      │
│  │ Admin │    ╰──────────────────╯                                      │
│  │       │───►╭──────────────────╮                                      │
│  └───────┘    │  Manage Content  │                                      │
│               ╰──────────────────╯                                      │
│                                                                         │
│               ╭──────────────────╮  «include»  ╭──────────────╮        │
│           ┌──►│  Browse Content  │────────────►│ View Details │        │
│           │   ╰──────────────────╯  «include»  ╰──────────────╯        │
│           │                                                             │
│           │   ╭──────────────────╮                                      │
│           ├──►│  Search Content  │                                      │
│  ┌──────┐ │   ╰──────────────────╯                                      │
│  │      │ │                                                             │
│  │ User │ │   ╭──────────────────╮  «extend»  ╭───────────────╮        │
│  │      │ ├──►│ Bookmark Content │───────────►│ Write Comment │        │
│  └──────┘ │   ╰──────────────────╯            ╰───────┬───────╯        │
│           │                                           │ «extend»        │
│           │                               ╭──────────▼──────────╮      │
│           │                               │ Generate AI Summary │      │
│           │                               ╰──────────┬──────────╯      │
│           │                                          │                  │
│           │                          «include» ──────┤                  │
│           │                    ╭──────────────╮      │ «include»        │
│           │                    │ Call Gemini  │◄─────┤                  │
│           │                    │     API      │      │                  │
│           │                    ╰──────────────╯  ╭───▼──────────────╮  │
│           │                                      │ Fetch Content    │  │
│           │                                      │     Data         │  │
│           │                                      ╰──────────────────╯  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Actors

| Actor | Role | Use Cases |
|---|---|---|
| Admin | Platform administrator | View Analytics, Manage Content |
| User | Registered/guest reader | Browse, Search, Bookmark, Comment, AI Summary |

### Use Case Descriptions

| Use Case | Actor | Type | Description |
|---|---|---|---|
| View Analytics | Admin | Primary | View platform stats — total users, content, saves |
| Manage Content | Admin | Primary | Add/edit/delete articles, journals, books |
| Browse Content | User | Primary | View news feed with category filters |
| View Details | System | «include» | Always triggered when browsing — loads full article |
| Search Content | User | Primary | Full-text search across articles |
| Bookmark Content | User | Primary | Save article to personal collection |
| Write Comment | User | «extend» | Optional extension of Bookmark — add a comment |
| Generate AI Summary | User | «extend» | Optional — request Gemini AI summary of article |
| Call Gemini API | System | «include» | Always called when AI Summary is requested |
| Fetch Content Data | System | «include» | Always called to retrieve article before summarizing |

### UML Relationship Types Used
- **«include»** — mandatory sub-flow (always happens)
- **«extend»** — optional extension (happens under certain conditions)

---

## 4. Enhanced Class Diagram
**Class Relationships — Controllers, Models & Services**

FrontendApp uses AuthController and ContentController. AuthController creates/manages User.
ContentController uses AIService.generateSummary() and fetches Content model.

```
                    ┌─────────────────────────┐
                    │      (C) FrontendApp    │
                    │─────────────────────────│
                    │ • fetchData(): void     │
                    └────────────┬────────────┘
                         uses ◄──┴──► uses
                        ▼                   ▼
        ┌───────────────────────┐   ┌───────────────────────────┐
        │   (C) AuthController  │   │  (C) ContentController    │
        │───────────────────────│   │───────────────────────────│
        │ • signup(name:String, │   │ • getContent(userId:      │
        │   email:String,       │   │   String): Content        │
        │   password:String)    │   │ • getSummary(contentId:   │
        │   : boolean           │   │   String): String         │
        │ • login(email:String, │   └──────────┬────────────────┘
        │   password:String)    │              │ uses
        │   : boolean           │              ▼
        └──────────┬────────────┘   ┌───────────────────────────┐
                   │ creates/manages│      (C) AIService        │
                   ▼                │───────────────────────────│
        ┌──────────────────────┐    │ • generateSummary(        │
        │      (C) User        │    │   content: Content)       │
        │──────────────────────│    │   : String                │
        │ ○ name: String       │    └──────────────────────────-┘
        │ ○ email: String      │              │ processes
        │ □ password: String   │              ▼
        │ • matchPassword(     │    ┌───────────────────────────┐
        │   password:String)   │◄───│      (C) Content          │
        │   : boolean          │fetches───────────────────────  │
        └──────────────────────┘    │ ○ title: String           │
                                    │ ○ type: String            │
                                    │ ○ summary: String         │
                                    └───────────────────────────┘
```

### Class Descriptions

| Class | Type | Responsibility |
|---|---|---|
| FrontendApp | Component | Next.js frontend — calls backend via fetchData() |
| AuthController | Controller | Handles signup/login — creates and manages User documents |
| ContentController | Controller | Fetches content, triggers AI summary generation |
| User | Model | Mongoose schema — stores user data, matchPassword() method |
| AIService | Service | Wraps Google Gemini API — generateSummary() function |
| Content | Model | Mongoose schema — stores article/journal/book data |

### Relationships

| From | To | Relationship | Description |
|---|---|---|---|
| FrontendApp | AuthController | uses | Frontend calls auth endpoints |
| FrontendApp | ContentController | uses | Frontend calls content endpoints |
| AuthController | User | creates/manages | Creates User on signup, finds on login |
| ContentController | AIService | uses | Calls generateSummary() for AI summaries |
| ContentController | Content | fetches | Queries Content model from MongoDB |
| AIService | Content | processes | Receives Content object, returns summary string |

### Visibility Symbols (UML)
- `•` (filled circle) = **public** method/attribute
- `○` (open circle) = **protected** attribute
- `□` (square) = **private** attribute (e.g., password)

---

## Diagram Summary

| Diagram | Type | What It Shows |
|---|---|---|
| ER Diagram | Entity-Relationship | Database entities, attributes, and relationships |
| Sequence Diagram | UML Behavioral | Time-ordered message flow for AI Summary feature |
| Use Case Diagram | UML Behavioral | System actors (Admin/User) and their interactions |
| Class Diagram | UML Structural | Classes, methods, attributes, and relationships |
