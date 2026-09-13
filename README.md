# Baswara — Cloudflare Edition

Live: **https://baswara.bdrrhmnhnn.workers.dev**

Platform pembuatan undangan digital — visual builder, RSVP tracking, guest check-in, QR & OG image generator. Rewrite penuh dari Supabase/Vercel ke 100% Cloudflare.

> Repo pendahulu (Supabase + Vercel): [`VUXXE/Baswara`](https://github.com/VUXXE/Baswara)

## Fitur

- **Visual builder** — 4 template (Wedding Classic, Birthday Fun, Seminar, Other Party), sidebar editor + live preview
- **RSVP & guest check-in** — tracking kehadiran, guest list, template WhatsApp
- **QR & OG image** — QR tamu + `/api/og` generator kartu sosial dinamis (WA/FB/X)
- **Auth** — email + password via Better Auth, session di D1

## Stack

| Layer | Tech |
|-------|------|
| Framework | TanStack Start (React 19, Vite 8, file-based routing) |
| Hosting | Cloudflare Workers (`@cloudflare/vite-plugin`) |
| Database | Cloudflare D1 (SQLite) via Drizzle ORM |
| Storage | Cloudflare R2 (`R2_BUCKET` binding) |
| Auth | Better Auth (email + password, session di D1) |
| Styling | TailwindCSS v4, Framer Motion |
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
scripts/ship.sh        # One-command deploy
wrangler.jsonc         # Workers + D1_DB + R2_BUCKET bindings
```

## Setup lokal

```bash
npm install
cp .env.example .env        # isi nilainya, jangan commit
npm run dev                 # vite dev :3000 (dengan plugin Cloudflare)
```

### Variabel (`.env` lokal / `wrangler secret` untuk production)

| Var | Isi |
|-----|-----|
| `BETTER_AUTH_SECRET` | random string (min 32 char) untuk sign session |
| `BETTER_AUTH_URL` | base URL app (`http://localhost:3000` lokal) |
| `R2_PUBLIC_URL` | domain publik bucket (custom domain / `*.r2.dev`), untuk URL gambar |

## Deploy

Satu perintah untuk semuanya (bikin D1/R2 kalau belum ada, apply migrasi, generate secret, build, deploy):

```bash
npm run ship
```

Manual per langkah (kalau perlu):

```bash
npx wrangler d1 create baswara-db          # isi database_id ke wrangler.jsonc
npx wrangler r2 bucket create baswara-assets
npx wrangler d1 migrations apply baswara-db --remote   # dari folder drizzle/
npm run generate-routes
npm run deploy        # = npm run build && wrangler deploy
```

Perintah lain: `npm run preview` (wrangler dev), `npm run cf-typegen` (tipe binding Workers).

## Catatan

- Upload editor dikirim sebagai base64 ke serverFn `uploadAsset` (batas body Workers aman untuk foto).
- Meta OG (`og:url`, `og:image`) diambil dari request host — otomatis ikut custom domain tanpa ubah kode.
- Server-only code (`cloudflare:workers`, D1, Better Auth) diakses via dynamic `import()` di dalam handler agar client bundle tetap bersih — jangan import statis dari komponen.
