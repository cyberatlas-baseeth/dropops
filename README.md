# DropOps 🚀

**Kripto airdrop projelerini takip etmek için modern bir web uygulaması.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

## ✨ Özellikler

- 🔐 **MetaMask ile Giriş** - Sign-In with Ethereum, gas ücreti yok
- 📊 **Kanban Dashboard** - 3 sütunlu airdrop takibi (To-Do / In Progress / Completed)
- ✅ **Adım Takibi** - Her airdrop için checklist ve ilerleme çubuğu
- 📝 **Günlük Görevler** - Daily tasks ve to-do list
- 💰 **Finansal Takip** - Maliyet, kazanç ve P/L hesaplaması
- 🌾 **Farming Monitörü** - Farming puanı takibi
- 📋 **Waitlist** - NFT mint ve proje waitlist takibi
- 🌙 **Dark/Light Mode** - Otomatik tema desteği

## 🛠️ Teknoloji Stack

| Teknoloji | Açıklama |
|-----------|----------|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Tip güvenliği |
| [TailwindCSS 4](https://tailwindcss.com/) | Utility-first CSS |
| [Supabase](https://supabase.com/) | PostgreSQL veritabanı |
| [ethers.js](https://docs.ethers.org/) | Ethereum wallet bağlantısı |

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Supabase Kurulumu

1. [Supabase](https://supabase.com/) hesabı oluştur
2. Yeni proje oluştur
3. SQL Editor'da [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) içindeki sorguları çalıştır

### 3. Environment Variables

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── login/              # Giriş sayfası
│   └── (dashboard)/        # Korumalı dashboard
│       ├── page.tsx        # Ana sayfa (Airdrops)
│       ├── airdrop/[id]/   # Airdrop detay
│       ├── tasks/          # Görevler
│       ├── finance/        # Finansal takip
│       ├── monitor-farming/# Farming monitörü
│       └── waitlist/       # Waitlist
├── components/             # React componentleri
│   ├── airdrops/           # Airdrop kartları, modaller
│   ├── auth/               # Login componentleri
│   ├── layout/             # Topbar
│   └── ui/                 # Button, Input, Modal
├── context/                # React Context (Wallet)
├── lib/                    # Utilities
│   ├── supabase/           # Supabase client
│   └── wallet/             # Wallet config
└── types/                  # TypeScript tipleri
```

## 📜 Lisans

MIT License
