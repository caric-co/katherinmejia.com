# Handoff — KMakeup Platform MVP

## Project State (as of latest push)

**Repo:** https://github.com/caric-co/katherinmejia.com (private, org: caric-co)
**Stack:** TanStack Start + Convex + Better Auth + shadcn/ui (Base UI) + Tailwind v4 + Novel + Mistral AI + Motion + Biome
**Monorepo:** Turborepo + pnpm (`pnpm dev` with TUI)

### Running the project
```bash
pnpm dev          # starts all apps with turbo TUI
# Web: http://localhost:3000
# Quote: http://localhost:5173
# Convex: watching in background
```

### Credentials
- **Admin (real login):** `demar_admin@kmakeup.com` / `KMakeup2024!` (role: admin)
- Seed users (`admin@kmakeup.com`, `student@test.com`) exist in Convex `users` table but have no Better Auth credentials

### Convex deployments
- **Dev:** `steady-albatross-389` (caric-co org)
- **Prod:** `coordinated-caribou-61` (caric-co org)
- Env vars (both): `BETTER_AUTH_SECRET`, `SITE_URL`, `MISTRAL_API_KEY`

### Vercel deployments
- **Web:** `katherinmejia.vercel.app` (root dir: `apps/web`, framework: TanStack Start)
- **Quote:** `quote-kmakeup.vercel.app` (root dir: `apps/initial-quote`, framework: TanStack Start)
- Web env vars: `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`, `VITE_SITE_URL`
- Auto-deploy on push to `main`

---

## Architecture

```
katherinmejia.com/
├── apps/
│   ├── web/                 TanStack Start (port 3000)
│   │   ├── src/routes/
│   │   │   ├── index.tsx              Landing page (preloader + 7 sections)
│   │   │   ├── auth/login.tsx         Email/Google/Apple login (TanStack Form + Zod)
│   │   │   ├── auth/register.tsx      Signup (TanStack Form + Zod + auto-advance)
│   │   │   ├── auth/forgot-password.tsx
│   │   │   ├── courses/index.tsx      Public catalog (SEO meta tags)
│   │   │   ├── courses/$slug.tsx      Course detail + syllabus (SEO meta tags)
│   │   │   ├── blog/index.tsx         Public blog listing (SEO meta tags)
│   │   │   ├── blog/$slug.tsx         Blog post detail (SSR SEO, HTML rendering)
│   │   │   └── admin/_layout.tsx      Admin sidebar (role-guarded, collapsible, progress bar)
│   │   │       ├── index.tsx          Dashboard
│   │   │       ├── courses/index.tsx  Course DataTable (search, status filter, multi-sort)
│   │   │       ├── courses/new.tsx    Create course (bilingual slugs, COP input, AI translate)
│   │   │       ├── courses/$slug.tsx  Edit course (AI translate)
│   │   │       ├── courses/$slug/lessons.tsx  Lesson management (inline edit, reorder, AI translate)
│   │   │       ├── users/index.tsx    User DataTable (search, filters, soft delete, multi-sort)
│   │   │       ├── users/$id.tsx      User detail + grant/revoke access
│   │   │       ├── blog/index.tsx     Blog DataTable (search, status filter, multi-sort)
│   │   │       ├── blog/new.tsx       Notion-style editor (Novel + AI, draft/publish flow)
│   │   │       ├── blog/$slug.tsx     Blog edit page (Novel + AI)
│   │   │       ├── content.tsx        Split-view site content editor + live preview
│   │   │       ├── content-preview.tsx Standalone landing preview
│   │   │       └── invitations.tsx    Invitation links
│   │   ├── src/components/
│   │   │   ├── landing/              8 components (nav, hero, services, about, courses, testimonials, contact, footer)
│   │   │   │   ├── preloader.tsx     Animated preloader (curtain split reveal)
│   │   │   │   └── landing-preview.tsx Live preview with skeleton loading
│   │   │   ├── editor/blog-editor.tsx Novel rich text editor (initialHtml support)
│   │   │   ├── form-field.tsx        TanStack Form + shadcn field (auto-advance, pulse animation)
│   │   │   └── smart-submit.tsx      Submit button (tooltip, hint, pulse animation)
│   │   ├── src/lib/
│   │   │   ├── auth-client.ts        Better Auth client
│   │   │   ├── auth-server.ts        Better Auth server handler
│   │   │   ├── env.ts                Env validation
│   │   │   ├── i18n.ts              i18next ES/EN
│   │   │   ├── use-site-content.ts   SiteContentProvider + draft/preview mode
│   │   │   └── form-primitives.tsx   useAutoAdvance, usePulse, useSubmitPulse, triggerPulse
│   │   ├── src/locales/
│   │   │   ├── es.json              Spanish translations (nav, hero, auth, common)
│   │   │   └── en.json              English translations
│   │   └── public/
│   │       ├── favicon.svg           K serif favicon
│   │       ├── robots.txt            Allow all + sitemap
│   │       └── sitemap.xml           Static sitemap (/, /courses, /blog)
│   │
│   ├── backend/              Convex (apps/backend/convex/)
│   │   └── convex/
│   │       ├── schema.ts     9 tables (users has status field, siteContent has draftValue)
│   │       ├── auth.ts       Better Auth + email/password + databaseHooks (user sync)
│   │       ├── http.ts       HTTP routes for auth
│   │       ├── ai.ts         Mistral AI (translate, translateText, excerpt, improve, review, capitalize)
│   │       ├── courses.ts    CRUD + bilingual slug lookup + lessonCount
│   │       ├── lessons.ts    CRUD + reorder
│   │       ├── users.ts      CRUD + setStatus (active/blocked/deleted) + role + upsertFromAuth
│   │       ├── purchases.ts  Grant/revoke access
│   │       ├── invitations.ts Code gen + redeem
│   │       ├── blogPosts.ts  CRUD + bilingual slugs + publish/unpublish
│   │       ├── siteContent.ts listAll, listByPrefix, saveDraft, publishAll, discardDrafts
│   │       ├── access.ts     hasAccess (admin→sub→purchase→free)
│   │       └── seed.ts       Test data (3 courses, 4 lessons, 2 users, 31 siteContent entries)
│   │
│   └── initial-quote/        Quote app (port 5173, TanStack Start)
│       └── 5 routes: /, /quote, /plan, /pricing, /video-costs
│
├── packages/
│   ├── ui/                   25 shadcn components (base-lyra, evamuah.com theme, + Progress, DataTable)
│   ├── config/               Shared TypeScript configs
│   └── utils/                cn(), formatCOP/USD, formatDate
│
├── biome.json                Linter + formatter + import sorting config
├── .husky/pre-commit         Husky hook: lint-staged + turbo typecheck
│
└── docs/                     PRD, TECH_STACK, ARCHITECTURE, DESIGN, PRODUCT, DATA_TABLE, research
```

---

## Key Features Built This Session

### Form Primitives (reusable across all forms)
- **FormField** — TanStack Form + shadcn Input with validation, error display, auto-advance
- **SmartSubmit** — disabled tooltip (lists empty fields), animated hint on ready, pulse animation
- **useAutoAdvance** — 700ms debounce auto-focus to next field or submit, Enter/arrow key handling
- **usePulse / useSubmitPulse** — Framer Motion scale animation registry for fields and buttons
- **Form pattern:** Zod schema → onChange validation → auto-advance → SmartSubmit → toast feedback

### Site Content Editor
- **Split-view:** editor panel (left) + live landing preview (right)
- **Draft/publish system:** saveDraft → preview changes → publishAll or discardDrafts
- **Clickable preview:** click any text/image in preview → editor scrolls to and focuses that field with pulse animation
- **Pulse animation:** fields scale-pulse (motion) on enter-edit, including preview clicks
- **Pristine guard:** save button disabled when value hasn't changed
- **Editable labels:** all section labels (Sobre mí, Cursos) are editable via siteContent with i18n fallback
- **AI auto-translate:** write in Spanish, auto-translates to English on save
- **Server-side data:** landing page fetches siteContent via ConvexHttpClient in loader (no flash)

### Preloader
- **3-phase animation:** wordmark fade (1s) → line + subtitle (0.8s) → curtain split reveal (0.8s)
- **sessionStorage:** only shows once per browser session
- **Masks Convex latency:** content loads behind the preloader

### Auth Improvements
- **Better Auth → Convex sync:** databaseHooks.user.create.after creates record in users table
- **Name/lastName split:** register form asks separately, hook splits for Convex table
- **Role guard:** admin panel checks users.role, nav hides Admin link for non-admins
- **i18n errors:** auth error messages follow locale (es/en)
- **Session skeleton:** nav shows pulse skeleton while session resolves (no flash)

### SEO
- **Server-side meta tags:** blog posts, courses, landing page via ConvexHttpClient in loaders
- **Open Graph + Twitter cards:** title, description, image for all public pages
- **JSON-LD:** Person schema on landing page
- **robots.txt + sitemap.xml**

### Admin DataTables (Notion-style)
- **DataTable component** — TanStack Table with multi-sort, pagination, column visibility toggle
- **Notion-style toolbar** — search (left) + filter selects (right desktop) + Sheet (mobile) + filter chips
- **Multi-sort** — columns stack sort criteria with priority numbers (1, 2, 3...)
- **Column visibility** — hide via column header dropdown, restore via Settings2 toggle in actions header
- **Sticky layout** — header columns sticky top, table body scrolls, pagination anchored at bottom
- **Fixed column widths** — `size` prop prevents layout shift on header interaction
- **Soft delete** — users have `status: active | blocked | deleted`, deleted filtered from queries
- **Applied to** — users, blog, courses tables (see `docs/DATA_TABLE.md`)

### Code Quality (Biome + Husky)
- **Biome** — single tool for linting, formatting, and import sorting (replaces ESLint + Prettier)
- **Import sorting groups:** react → third-party → @repo/@convex/@kmakeup → aliases (#/) → relative paths (blank lines between groups)
- **Husky pre-commit hook:** lint-staged (Biome check --write on staged files) + turbo typecheck (tsc --noEmit)
- **0 type errors** across web + quote apps (all pre-existing errors fixed)
- **Base UI migration:** all `asChild` props replaced with `render` prop (Base UI pattern, not Radix)
- **SSR hydration fixes:** preloader sessionStorage check moved to useEffect, devtools use isMounted state

### Deploy
- **Nitro plugin** for Vercel TanStack Start preset
- **ssr.noExternal: true** (production only) to bundle all deps in server output
- **Devtools client-only:** isMounted state guard to prevent SSR hydration mismatch
- **Progress bar:** route transition indicator in admin panel (shadcn Progress)

---

## Convex Schema (9 tables)

| Table | Key Fields | Slugs |
|-------|-----------|-------|
| users | email, name, lastName, role, status (active/blocked/deleted), authProvider, locale | — |
| courses | title {es,en}, description, slug {es,en}, price, status, thumbnailUrl | bilingual indexed |
| lessons | courseId, title {es,en}, videoId, duration, order, isFree | — |
| progress | userId, lessonId, watchedSeconds, completed | — |
| purchases | userId, courseId, provider, grantedBy, status | — |
| subscriptions | userId, plan, status, provider, periods | — |
| invitationLinks | courseId, code, maxUses, usedCount, expiresAt | — |
| siteContent | key, value {es,en}, draftValue {es,en}, type | — |
| blogPosts | title {es,en}, slug {es,en}, content, excerpt, status | bilingual indexed |

---

## MVP Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Scaffolding | ✅ | Monorepo, packages, configs |
| 2. Auth | ✅ | Better Auth email/password, login/register (TanStack Form), role guard, user sync |
| 3. Landing | ✅ | 7 sections, preloader, server-side content, SEO, i18n ES/EN |
| 4. Schema + Admin | ✅ | 9 tables, collapsible sidebar, progress bar, role-guarded |
| 5. Course CRUD | ✅ | List, create, edit, lessons (inline edit, reorder), AI translate, COP input |
| 6. Catalog | ✅ | Public listing with real DB data, detail with syllabus + SEO |
| 7. Video Player | ❌ | Needs Bunny Stream or R2+FFmpeg (not started) |
| 8. User Mgmt | ✅ | DataTable, detail, status (active/blocked/deleted), role toggle, grant/revoke access |
| 9. Blog + Content | ✅ | Novel WYSIWYG, AI features, blog edit page, split-view content editor with live preview |
| 10. Analytics | ❌ | PostHog + Sentry (not started) |
| 11. Deploy | ✅ | Vercel (web + quote), Convex prod, auto-deploy on push |
| 12. Code Quality | ✅ | Biome lint/format/imports, Husky pre-commit, 0 type errors |

---

## What's Next

### Remaining MVP:
1. **Video Player (Phase 7)** — decide Bunny Stream vs R2+FFmpeg, implement hls.js player with progress tracking
2. **Analytics (Phase 10)** — PostHog + Sentry setup
3. **Form migration** — remaining forms (course create/edit, blog, contact, forgot-password) to TanStack Form + Zod

### Post-MVP:
4. **UploadThing integration** — file uploads for course thumbnails, blog images, portfolio
5. **Bold.co / Wompi payments** — purchase flow for courses + subscriptions
6. **Resend emails** — transactional (welcome, password reset, purchase confirmation)
7. **Dynamic sitemap** — server function that generates sitemap from published courses/blog posts
8. **Bot social (Phase 3 future)** — WhatsApp/Instagram/Facebook via Meta API
