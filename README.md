# LibraryHub - Library Management System

A modern, full-stack library management system built with Next.js 16, featuring role-based access control, book catalog management, borrowing workflows, AI-powered book summaries, and natural language book search.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS + shadcn/ui + Lucide Icons |
| Auth | Auth.js v5 (Credentials + Google OAuth) |
| ORM | Prisma 7 |
| Validation | React Hook Form + Zod |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |
| Notifications | Sonner |

## Features

- **Authentication** - Email/password and Google OAuth login with JWT sessions
- **Role-Based Access** - Three roles: Admin, Librarian, Member with server-enforced permissions
- **Dashboard** - Role-aware statistics (total books, members, checked-out, overdue) and recent borrowing activity
- **Book Catalog** - CRUD operations, cover images, debounced search by title/author/genre/ISBN
- **AI Semantic Search** - Natural language book discovery powered by Gemini
- **AI Summaries** - Gemini-powered book summaries cached in the database
- **Borrowing System** - Checkout/return with automatic availability tracking, 14-day due dates, and overdue detection
- **Member Management** - Admin-only invite system with token-based registration and role assignment
- **Dark Mode** - System-aware theme toggle via next-themes
- **Responsive** - Mobile-friendly with collapsible sidebar

## Roles

| Capability | Admin | Librarian | Member |
|---|---|---|---|
| Browse & search books | Yes | Yes | Yes |
| AI-powered book search | Yes | Yes | Yes |
| Check out / return own books | Yes | Yes | Yes |
| Return any user's books | Yes | Yes | No |
| Create / edit / delete books | Yes | Yes | No |
| Generate AI summaries | Yes | Yes | No |
| View all borrowing records | Yes | Yes | No |
| Manage members & invites | Yes | No | No |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g., [Neon](https://neon.tech))
- A [Gemini API key](https://aistudio.google.com/apikey) (optional, for AI summaries)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd library-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your `DATABASE_URL`, `NEXTAUTH_SECRET`, and optionally `GEMINI_API_KEY`.

4. **Push the database schema**
   ```bash
   npx prisma db push
   ```

5. **Seed the database** (optional - adds 25 books and 3 test users)
   ```bash
   npx prisma db seed
   ```

6. **Start the dev server**
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

### Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | admin123 |
| Librarian | librarian@library.com | librarian123 |
| Member | member@library.com | member123 |

If you register without seed data, the first user automatically becomes Admin.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | Yes |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Yes |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | No |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | No |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:seed` | Seed the database with sample data |

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com/new)
3. Add environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `GEMINI_API_KEY`)
4. Set `NEXTAUTH_URL` to your Vercel domain
5. Deploy
