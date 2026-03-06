# SaaS Starter Kit

A minimal, production-ready SaaS starter built with React, Vite, Tailwind CSS, TypeScript, and Supabase.

## Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth & DB:** Supabase (Auth, Postgres, RLS)
- **State:** TanStack React Query
- **Routing:** React Router v6

## Getting Started

```bash
cp .env.example .env
# Fill in your Supabase credentials
npm install
npm run dev
```

## Structure

```
src/
├── core/           # Auth, routing, Supabase client, hooks
├── components/ui/  # shadcn/ui components
├── modules/        # Feature modules (add yours here)
│   └── example/    # Example module with CRUD page
├── lib/            # Utilities
├── App.tsx         # Root router
├── main.tsx        # Entry point
└── index.css       # Design tokens
```

## Features

- Supabase Auth (email/password)
- Protected routes with loading states
- Admin role check via `user_roles` table
- Design system with semantic tokens (light/dark)
- shadcn/ui component library
- TanStack Query for data fetching
- Responsive, mobile-first layout

## Adding a Module

1. Create `src/modules/your-feature/`
2. Add page components
3. Register routes in `App.tsx`

## License

MIT
