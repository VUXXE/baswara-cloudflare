# AGENTS.md — Vuxxe Project

## TanStack CLI Command Used

```bash
node $(npm root -g)/@tanstack/cli/dist/index.js create my-tanstack-app \
  --framework React \
  --package-manager pnpm \
  --no-examples \
  --non-interactive \
  --agent \
  --no-git \
  --target-dir ./tsc-scratch/my-tanstack-app
```

> Note: In this Termux environment, the `tanstack` global binary cannot be called directly via `npx` or shell (the shebang `#!/usr/bin/env` path doesn't resolve). The workaround is to invoke the CLI through `node $(npm root -g)/@tanstack/cli/dist/index.js`. This is equivalent to running `npx @tanstack/cli@latest create ...`.

## TanStack Intent Commands Run

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

Equivalent run via node:
```bash
node $(npm root)/@tanstack/intent/dist/index.js install
node $(npm root)/@tanstack/intent/dist/index.js list
```

Intent creates AGENTS.md skill mappings at project scaffold time automatically when `--agent` flag is provided.

## Chosen Stack & Integrations

| Item | Choice |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router (file-based, `@tanstack/react-router`) |
| SSR / Server | TanStack Start via `@tanstack/react-start` (Vite-based, NOT Vinxi) |
| Styling | TailwindCSS v4 (`@tailwindcss/vite` plugin) |
| Build tool | Vite 8 |
| Package manager (intended) | pnpm |
| Package manager (actual env) | npm (pnpm unavailable in this Termux env — see gotchas) |
| Database | Supabase PostgreSQL via Prisma ORM |
| Auth | Supabase Auth + `@supabase/ssr` |
| File storage | Supabase Storage (`invitation-assets` bucket) |
| State | Zustand (`useInvitationStore`) |
| Animations | Framer Motion |

## Architecture Overview

```
src/
├── routes/
│   ├── __root.tsx         # Root layout: html/head/body shell, devtools
│   ├── index.tsx          # Landing page "/"
│   ├── login.tsx          # Auth page
│   ├── onboarding.tsx     # New project setup
│   ├── dashboard.tsx      # User project listing
│   ├── builder.tsx        # Visual invitation builder (editor + preview)
│   └── $slug.tsx          # Public guest-facing invitation + RSVP
├── router.tsx             # createRouter factory (getRouter())
├── styles.css             # Global styles + Tailwind @import
├── pages/
│   ├── Builder.tsx        # Builder UI (sidebar + preview layout)
│   └── Preview.tsx        # Invitation preview component
├── components/
│   └── editor/
│       └── EditorSidebar.tsx   # Accordion form editor
├── stores/
│   └── useInvitationStore.ts   # Zustand invitation data store
└── lib/
    ├── db.ts              # Prisma client singleton
    └── supabase/
        ├── client.ts      # Supabase browser client
        └── server.ts      # Supabase server client (uses cookies)
```

## Key Architectural Decisions

1. **`@tanstack/react-start` (not `@tanstack/start`+Vinxi)**: The latest TanStack CLI scaffolds with `@tanstack/react-start`, which is Vite-native and no longer depends on Vinxi. Prior attempts using `@tanstack/start` 1.120.x experienced a `CONSTANTS` export mismatch between `@tanstack/start-config` and `@tanstack/router-generator` due to version skew in the monorepo release cadence.

2. **File-based routing via `tsr.config.json`**: Routes are auto-generated using TanStack Router's codegen. Run `npm run generate-routes` (maps to `tsr generate`) after adding new route files.

3. **JSONB data model**: All invitation content (couples names, photos, events, etc.) is stored in a single Prisma `Invitation.data: Json` column. This avoids schema migrations for template changes.

4. **Server functions via `createServerFn`**: Data fetching and mutations use TanStack Start's `createServerFn` with `method: 'GET'` or `'POST'`. These run exclusively on the server and are called from route loaders or component event handlers.

5. **Supabase auth on server**: Uses `createSupabaseServerClient()` which reads cookies from request headers (requires `@supabase/ssr`).

## Environment Variables

Create a `.env` file in project root:

```env
# Supabase connection (transaction-mode pooler for queries)
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase connection (session-mode for migrations)
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Supabase public API credentials
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJ..."
```

> `VITE_` prefix makes variables available in the browser bundle. Server-only vars (DATABASE_URL, DIRECT_URL) should NOT have the prefix.

## Known Gotchas

1. **Termux pnpm constraint**: Global binaries installed via npm in Termux use `#!/usr/bin/env` shebangs that fail because `/usr/bin/env` doesn't exist. Use `node $(npm root -g)/package/dist/index.js` as workaround.

2. **Prisma v6 ARM64**: Must use Prisma `^6.19.3` (not v7) due to ARM64 binary incompatibility in this environment. Run migrations via `node node_modules/prisma/build/index.js db push` or the SQL editor in Supabase.

3. **TanStack version skew**: `@tanstack/start@1.120.x` (Vinxi-based) causes build failures due to `CONSTANTS` export mismatch between `@tanstack/start-config` and `@tanstack/router-generator`. Use `@tanstack/react-start` (Vite-based) instead.

4. **Route tree codegen**: After adding/renaming route files, run `npm run generate-routes` to regenerate `src/routeTree.gen.ts`.

## Deployment Notes

- Default build output: `.output/` (or `dist/` with Vite preset)
- Run `npm run build` then `npm run start` for production
- Environment variables must be set in your hosting platform (Vercel, Netlify, Railway, etc.)
- Supabase Storage bucket `invitation-assets` must have public read access enabled

## Next Steps

- [ ] Implement remaining `EditorSidebar` sections (Dresscode, Footage)
- [ ] Build WhatsApp link generator in Dashboard
- [ ] Add RSVP export (CSV download) from Builder RSVP tab
- [ ] Add slug availability check during onboarding
- [ ] Wire `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from env instead of hardcoding
