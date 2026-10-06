# SmartAssist AI – Full-Stack Intelligent Student Chatbot

A production-ready, full-stack AI chatbot application crafted specifically for college students. SmartAssist AI serves academic, programming, project, career, interview, resume, and study planning needs with contextual intelligence, automated category detection, follow-up suggestions, chat history persistence, and an administrative analytics dashboard.

---

## 🚀 Key Features

### 1. Student-Focused Intelligence
- **Automatic Category Detection:** Analyzes queries into 7 distinct categories: `Academic`, `Programming`, `Project`, `Resume`, `Interview`, `Career`, or `General`.
- **Context-Aware Memory:** Maintains multi-turn conversation context.
- **Suggested Follow-Up Prompts:** Generates 2–3 contextual questions below every response to keep students engaged and learning.
- **Syntax Highlighting & Code Blocks:** Formatted code blocks with language indicators and one-click copy buttons.
- **Markdown & Math Formatting:** Renders headers, lists, tables, and step-by-step technical guidance.

### 2. 6 Quick-Action Student Shortcuts
- 📚 **Ask Academic Question:** Calculus, Physics, Algorithms, Science, and Homework.
- 💻 **Coding Help:** React, Node.js, Python, Java, Bug fixes, and APIs.
- 🚀 **Project Ideas:** High-impact resume projects for software internships.
- 📄 **Resume Help:** ATS-optimized formatting and Google X-Y-Z bullet points.
- 🎯 **Interview Preparation:** STAR method behavioral answers and technical rounds.
- 📅 **Study Plan:** Spaced repetition, active recall, and Pomodoro schedules.

### 3. User & Chat History Management
- **Persistent Storage:** MongoDB with resilient local datastore fallback.
- **Saved / Pinned Chats:** Pin important conversations to keep them at the top.
- **Search:** Instant keyword search across all past conversations.
- **Conversation Controls:** Inline rename, delete conversation, and single-message deletion.
- **Exporting Options:** Export chat transcripts to PDF (print-optimized), Markdown (`.md`), or Plain Text (`.txt`).
- **Guest Access:** Allows up to 5 free messages for unauthenticated guests before prompting for account creation.

### 4. Admin Dashboard & Analytics
- Total registered students, total conversations, and total messages sent.
- Category distribution charts.
- Daily usage trends.
- Recent conversation logs.
- Strict role-based authorization check.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React-Markdown, Remark-GFM
- **Backend:** Node.js, Express.js, JWT, BcryptJS, Express-Rate-Limit
- **Database:** MongoDB (via Mongoose) with automatic resilient local file-backed persistence fallback
- **AI Service:** Dedicated abstraction layer supporting OpenAI, Google Gemini, and a built-in intelligent student domain engine

---

## 📁 Project Architecture

```
CHATBOT/
├── client/                     # Frontend React + Tailwind CSS
│   ├── src/
│   │   ├── api/                # API client (JWT & Guest ID handler)
│   │   ├── context/            # AuthContext, ChatContext, ThemeContext
│   │   ├── components/         # ChatWindow, Sidebar, Header, QuickActions, MessageBubble
│   │   │   ├── Common/         # CodeBlock, CategoryBadge
│   │   │   └── Modals/         # AuthModal, SettingsModal, ProfileModal, AdminDashboardModal, ExportModal
│   │   ├── index.css           # Tailwind directives & design tokens
│   │   ├── App.jsx             # Main application orchestrator
│   │   └── main.jsx
│   ├── index.html              # HTML shell with Google Fonts & Print styles
│   ├── tailwind.config.js      # Dark mode & custom theme config
│   └── vite.config.js          # Vite config with backend proxy
├── server/                     # Backend Node.js + Express
│   ├── config/                 # db.js (MongoDB + fallback), config.js
│   ├── controllers/            # authController, chatController, userController, adminController
│   ├── middleware/             # auth.js (JWT & role checks), rateLimiter.js
│   ├── models/                 # User.js, Conversation.js, Message.js
│   ├── routes/                 # authRoutes, chatRoutes, userRoutes, adminRoutes
│   ├── services/               # aiService.js (category engine, LLM abstraction & fallback)
│   ├── data/                   # Resilient store data directory
│   ├── index.js                # Server entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
├── test-api.js                 # Automated end-to-end API verification suite
└── package.json                # Root scripts
```

---

## ⚙️ Environment Variables

A `.env.example` file is included in `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartassist
JWT_SECRET=smartassist_super_secret_jwt_key_2026_student_bot
NODE_ENV=development

# Optional LLM API Keys (Falls back cleanly to built-in student AI engine if not set)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
```

---

## 🏃 Running the Application Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start Backend Server
```bash
cd server
npm install
node index.js
```
The server will start on `http://localhost:5000`.

### 2. Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 🧪 Testing Instructions

An automated test suite is provided to verify all authentication flows, chat interactions, category detection, regeneration, rate limiting, and admin endpoints:

```bash
node test-api.js
```

### Verified Test Suite:
1. `GET /health` – Server health status
2. `POST /auth/signup` – Register new user
3. `POST /auth/signup` – Duplicate email validation (409 conflict)
4. `POST /auth/login` – Login with correct credentials
5. `POST /auth/login` – Wrong credentials rejection (401)
6. `GET /auth/me` – Profile verification with JWT
7. `POST /api/chat/new` – Create new conversation
8. `POST /api/chat/:chatId/message` – Category detection (`Academic`)
9. `POST /api/chat/:chatId/message` – Category detection (`Programming`)
10. `POST /api/chat/:chatId/regenerate` – Re-run AI response
11. `PUT /api/chat/:chatId` – Rename and pin conversation
12. `GET /api/chat/search` – Search history by keyword
13. `PUT & GET /api/user/settings` – Update and fetch theme & language preferences
14. `POST /auth/signup (Admin)` – Register administrator account
15. `GET /api/admin/stats` – Access admin analytics dashboard
16. `GET /api/admin/stats (Student)` – Enforce 403 Forbidden for non-admins
17. Guest Mode – Enforces 5-message limit with signup prompts

---

## 📚 API Reference

### Authentication Routes

#### `POST /auth/signup`
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "securepassword123",
    "isAdmin": false
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "...",
      "email": "student@university.edu",
      "isAdmin": false,
      "preferences": { "theme": "light", "language": "English" }
    }
  }
  ```

#### `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "securepassword123"
  }
  ```

#### `GET /auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** Current user object.

---

### Chat Routes

#### `POST /api/chat/new`
- **Body:** `{ "title": "Calculus II Revision" }`
- **Response (201):** Created conversation object.

#### `POST /api/chat/:chatId/message`
- **Body:**
  ```json
  {
    "message": "Explain the difference between useMemo and useCallback in React with code"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "userMessage": { "role": "user", "content": "..." },
    "aiMessage": {
      "role": "ai",
      "content": "...",
      "category": "Programming",
      "followUpSuggestions": [
        "When does useCallback cause performance issues?",
        "Can you show a React profiling example?"
      ]
    },
    "conversation": { ... },
    "guestRemaining": 4
  }
  ```

#### `POST /api/chat/:chatId/regenerate`
- Re-executes generation for the latest user prompt in the conversation.

#### `GET /api/chats`
- Returns all conversations for the authenticated user (or guest session).

#### `GET /api/chat/:chatId`
- Returns the conversation and its full message history.

#### `PUT /api/chat/:chatId`
- Body: `{ "title": "New Title", "isPinned": true }`

#### `DELETE /api/chat/:chatId`
- Deletes conversation and all its associated messages.

#### `DELETE /api/chat/:chatId/message/:messageId`
- Deletes an individual message from the conversation.

#### `GET /api/chat/search?q=<keyword>`
- Searches conversation titles and message snippets matching the query.

---

### User Settings Routes

#### `GET /api/user/settings`
- Returns user preferences (`theme`, `language`).

#### `PUT /api/user/settings`
- Updates user preferences (`theme`: `"light" | "dark"`, `language`: `"English" | ...`).

---

### Admin Routes

#### `GET /api/admin/stats`
- Protected route (Admin only).
- Returns:
  - `totalUsers`
  - `totalConversations`
  - `totalMessages`
  - `avgMessagesPerConversation`
  - `categories` (frequency count per category)
  - `dailyTrends` (messages per day)
  - `recentConversations` (recent 10 chats)

---

## 🔒 Security Best Practices Implemented
- Passwords salted and hashed with `bcryptjs` (never stored in plain text).
- Secure JWT-based authentication.
- API Rate limiting (60 requests/15m for chat, 300 requests/15m for API).
- Strict role-based authorization for administrative routes.
- Sanitized input queries to prevent injection.
- Zero client-side API key exposure (all LLM communications are handled strictly by the backend AI service).
