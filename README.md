# DropOps 🚀

**A modern web application for tracking crypto airdrop projects.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

## ✨ Features

- 🔐 **MetaMask Login** - Sign-In with Ethereum, no gas fees
- 📊 **Kanban Dashboard** - 3-column airdrop tracking (To-Do / In Progress / Completed)
- ✅ **Step Tracking** - Checklist and progress bar for each airdrop
- 📝 **Daily Tasks** - Daily tasks and to-do list management
- 💰 **Financial Tracking** - Cost, reward and P/L calculation
- 🌾 **Farming Monitor** - Farming points tracking
- 📋 **Waitlist** - NFT mint and project waitlist tracking
- 🌙 **Dark/Light Mode** - Automatic theme support

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [TailwindCSS 4](https://tailwindcss.com/) | Utility-first CSS |
| [Supabase](https://supabase.com/) | PostgreSQL database |
| [ethers.js](https://docs.ethers.org/) | Ethereum wallet connection |

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a [Supabase](https://supabase.com/) account
2. Create a new project
3. Run the SQL queries from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) in the SQL Editor

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── login/              # Login page
│   └── (dashboard)/        # Protected dashboard
│       ├── page.tsx        # Main page (Airdrops)
│       ├── airdrop/[id]/   # Airdrop detail
│       ├── tasks/          # Tasks
│       ├── finance/        # Financial tracking
│       ├── monitor-farming/# Farming monitor
│       └── waitlist/       # Waitlist
├── components/             # React components
│   ├── airdrops/           # Airdrop cards, modals
│   ├── auth/               # Login components
│   ├── layout/             # Topbar
│   └── ui/                 # Button, Input, Modal
├── context/                # React Context (Wallet)
├── lib/                    # Utilities
│   ├── supabase/           # Supabase client
│   └── wallet/             # Wallet config
└── types/                  # TypeScript types
```

## 📜 License

MIT License
