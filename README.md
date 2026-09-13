# Baswara — Cloudflare Edition

Live: **https://baswara.bdrrhmnhnn.workers.dev**

Platform pembuatan undangan digital (wedding, birthday, seminar, party) — visual builder, RSVP tracking, guest check-in, QR & OG image generator. Rewrite penuh dari Supabase/Vercel ke 100% Cloudflare.

> Repo pendahulu (Supabase + Vercel): [`VUXXE/Baswara`](https://github.com/VUXXE/Baswara)

## Stack

| Layer    | Tech |
|----------|------|
| Framework | TanStack Start (React 19, Vite 8, file-based routing) |
| Hosting   | Cloudflare Workers (`@cloudflare/vite-plugin`) |
| Database  | Cloudflare D1 (SQLite) via Drizzle ORM |
| Storage   | Cloudflare R2 (`R2_BUCKET` binding) |
| Auth      | Better Auth (email + password, session di D1) |
| Styling   | TailwindCSS v4, Framer Motion |
| OG images | `workers-og` (Satori + resvg WASM, jalan di Workers) |

## Struktur

```
app/
├── routes/            # File-based routes (tanstack router codegen)
│   ├── api.auth.$.tsx # Better Auth API handler (GET+POST /api/auth/*)
│   ├── api.og.tsx     # OG image generator (/api/og?groom=&bride=&...)
│   ├── $slug.tsx      # Undangan publik + meta OG/WhatsApp
│   ├── builder.tsx    # Visual builder (auth + D1)
│   ├── dashboard*.tsx # Daftar project, check-in tamu, RSVP
│   └── login.tsx / onboarding.tsx
├── lib/
│   ├── auth.ts        # Better Auth instance (per-request, lazy)
│   ├── auth-client.ts # better-auth/react client
│   ├── session.ts     # fetchUser serverFn (client-safe wrapper)
│   ├── db.ts          # Drizzle D1 client
│   ├── schema.ts      # Tabel auth + invitations + rsvps
│   └── serverFns.ts   # RSVP, guest list, check-in, delete, uploadAsset (R2)
├── components/editor/ # Sidebar builder (upload via R2)
└── templates/         # WeddingClassic, BirthdayFun, Seminar, OtherParty
drizzle/               # SQL migration D1 (drizzle-kit generate)
wrangler.jsonc         # Workers + D1_DB + R2_BUCKET bindings
```

## Setup lokal

```bash
npm install
cp .env.example .dev.vars   # isi kredensial di bawah
npm run dev                 # vite dev :3000 (dengan plugin Cloudflare)
```

### Variabel (`.dev.vars` lokal / dashboard Workers untuk production)

| Var | Isi |
|-----|-----|
| `BETTER_AUTH_SECRET` | random string (min 32 char) untuk sign session |
| `BETTER_AUTH_URL` | base URL app (`http://localhost:3000` lokal) |
| `R2_PUBLIC_URL` | domain publik bucket (custom domain / `*.r2.dev`), untuk URL gambar |

## Database & deploy

Satu perintah untuk semuanya (bikin D1/R2 kalau belum ada, apply migrasi, generate secret, build, deploy):

```bash
npm run ship
```

Manual per langkah (kalau perlu):

```bash
# 1. Buat D1 + R2, lalu isi database_id di wrangler.jsonc
npx wrangler d1 create baswara-db
npx wrangler r2 bucket create baswara-assets

# 2. Apply migrasi
npx wrangler d1 migrations apply baswara-db   # dari folder drizzle/

# 3. Generate route + build + deploy
npm run generate-routes
npm run deploy        # = npm run build && wrangler deploy
```

Perintah lain: `npm run preview` (wrangler dev), `npm run cf-typegen` (tipe binding Workers).

## Catatan migrasi

- Auth lama (Supabase) tidak terbawa — user harus register ulang; data `Invitation`/`Rsvp` lama perlu export-import manual bila ingin dipertahankan.
- Upload editor dikirim sebagai base64 ke serverFn `uploadAsset` (batas body Workers ±100MB, aman untuk foto).
- URL OG (`/api/og`) dan `siteUrl` di `$slug.tsx` masih menunjuk domain Vercel lama — ganti ke domain Cloudflare setelah deploy.
