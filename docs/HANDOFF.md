# Handoff — KMakeup Platform MVP

## Project State (as of commit 37922a3)

**Repo:** https://github.com/caric-co/katherinmejia.com (private, org: caric-co)
**Stack:** TanStack Start + Convex + Better Auth + shadcn/ui (base-lyra) + Tailwind v4 + Novel + Mistral AI
**Monorepo:** Turborepo + pnpm (`pnpm dev` with TUI)

### Running the project
```bash
pnpm dev          # starts all apps with turbo TUI
# Web: http://localhost:3000
# Quote: http://localhost:5173
# Convex: watching in background
```

### Test users
- Admin: `admin@kmakeup.com` / `test1234` (role: admin)
- Student: `student@test.com` / `test1234` (role: student)

### Convex deployment
- Dev: `steady-albatross-389` (caric-co org)
- `.env.local` in apps/web and apps/backend
- Env vars set: `BETTER_AUTH_SECRET`, `SITE_URL=http://localhost:3000`, `MISTRAL_API_KEY`

---

## Architecture

```
katherinmejia.com/
├── apps/
│   ├── web/                 TanStack Start (port 3000)
│   │   ├── src/routes/
│   │   │   ├── index.tsx              Landing page (7 sections)
│   │   │   ├── auth/login.tsx         Email/Google/Apple login
│   │   │   ├── auth/register.tsx      Signup
│   │   │   ├── auth/forgot-password.tsx
│   │   │   ├── courses/index.tsx      Public catalog
│   │   │   ├── courses/$slug.tsx      Course detail + syllabus
│   │   │   ├── blog/index.tsx         Public blog listing
│   │   │   ├── blog/$slug.tsx         Blog post detail
│   │   │   └── admin/_layout.tsx      Admin sidebar (auth guarded)
│   │   │       ├── index.tsx          Dashboard
│   │   │       ├── courses/index.tsx  Course list
│   │   │       ├── courses/new.tsx    Create course (bilingual slugs, COP input)
│   │   │       ├── courses/$slug.tsx  Edit course
│   │   │       ├── courses/$slug/lessons.tsx  Lesson management
│   │   │       ├── users/index.tsx    User list + block
│   │   │       ├── users/$id.tsx      User detail + grant/revoke access
│   │   │       ├── blog/index.tsx     Blog list + publish/unpublish
│   │   │       ├── blog/new.tsx       Notion-style editor with Novel + AI
│   │   │       ├── content.tsx        Site content editor
│   │   │       └── invitations.tsx    Invitation links
│   │   ├── src/components/
│   │   │   ├── landing/              7 sections (nav, hero, services, about, courses, testimonials, contact, footer)
│   │   │   └── editor/blog-editor.tsx Novel rich text editor
│   │   └── src/lib/
│   │       ├── auth-client.ts         Better Auth client
│   │       ├── auth-server.ts         Better Auth server handler
│   │       ├── env.ts                 Env validation
│   │       └── i18n.ts               i18next ES/EN
│   │
│   ├── backend/              Convex (apps/backend/convex/)
│   │   └── convex/
│   │       ├── schema.ts     9 tables with bilingual slugs
│   │       ├── auth.ts       Better Auth + email/password
│   │       ├── http.ts       HTTP routes for auth
│   │       ├── ai.ts         Mistral AI (translate, excerpt, improve, review, capitalize)
│   │       ├── courses.ts    CRUD + bilingual slug lookup
│   │       ├── lessons.ts    CRUD + reorder
│   │       ├── users.ts      CRUD + block + role
│   │       ├── purchases.ts  Grant/revoke access
│   │       ├── invitations.ts Code gen + redeem
│   │       ├── blogPosts.ts  CRUD + bilingual slugs
│   │       ├── siteContent.ts Upsert by key
│   │       ├── access.ts     hasAccess (admin→sub→purchase→free)
│   │       └── seed.ts       Test data (3 courses, 4 lessons, 2 users)
│   │
│   └── initial-quote/        Quote app (port 5173, TanStack Start)
│       └── 5 routes: /, /quote, /plan, /pricing, /video-costs
│
├── packages/
│   ├── ui/                   24 shadcn components (base-lyra, evamuah.com theme)
│   ├── config/               Shared TypeScript configs
│   └── utils/                cn(), formatCOP/USD, formatDate
│
├── docs/                     PRD, TECH_STACK, ARCHITECTURE, research
├── DESIGN.md                 Full design system (evamuah.com reference)
└── PRODUCT.md                Project overview
```

---

## Convex Schema (9 tables)

| Table | Key Fields | Slugs |
|-------|-----------|-------|
| users | email, name, role, isBlocked, authProvider, locale | — |
| courses | title {es,en}, description, slug {es,en}, price, status, thumbnailUrl | bilingual indexed |
| lessons | courseId, title {es,en}, videoId, duration, order, isFree | — |
| progress | userId, lessonId, watchedSeconds, completed | — |
| purchases | userId, courseId, provider, grantedBy, status | — |
| subscriptions | userId, plan, status, provider, periods | — |
| invitationLinks | courseId, code, maxUses, usedCount, expiresAt | — |
| siteContent | key, value {es,en}, type | — |
| blogPosts | title {es,en}, slug {es,en}, content, excerpt, status | bilingual indexed |

---

## MVP Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Scaffolding | ✅ | Monorepo, packages, configs |
| 2. Auth | ✅ | Better Auth email/password, login/register/forgot, auth guard |
| 3. Landing | ✅ | 7 sections, hero full-bleed, nav session-aware, i18n ES/EN |
| 4. Schema + Admin | ✅ | 9 tables, sidebar layout, all pages |
| 5. Course CRUD | ✅ | List, create, edit (slug-based), lessons, bilingual slugs, COP currency input |
| 6. Catalog | ✅ | Public listing with images, detail with syllabus + sidebar |
| 7. Video Player | ❌ | Needs Bunny Stream or R2+FFmpeg (not started) |
| 8. User Mgmt | ✅ | List, detail, block, role toggle, grant/revoke course access |
| 9. Blog + Content | ✅ | Novel WYSIWYG, Mistral AI (translate, excerpt, improve, review, capitalize), site content editor |
| 10. Analytics | ❌ | PostHog + Sentry (not started) |

---

## AI Features (Mistral Small, via apps/backend/convex/ai.ts)

| Action | Usage | Tokens |
|--------|-------|--------|
| capitalizeTitle | Auto on title blur | ~86 |
| generateExcerpt | Sparkles button | ~170 |
| translateToEnglish | Vista previa button (title + excerpt + content) | ~290 |
| improveText | Wand button (rewrites content) | ~200-400 |
| reviewText | Message button (spelling, tone, coherence, overall) | ~200-400 |

---

## Design System (DESIGN.md)

- **Reference:** evamuah.com (Awwwards Honorable Mention)
- **Theme:** warm cream #F6F3EE, dark brown #2B2626, Playfair Display + Inter
- **Key rules:** No-Box-Border (tonal layering), 8% border opacity, pill buttons, bottom-border inputs, flat (no shadows)
- **Components:** 24 shadcn base-lyra with overrides (pill buttons/badges, rounded-md inputs, sharp cards)

---

## What's Next

### Immediate (remaining MVP):
1. **Course editing improvements** — lesson management needs work, course edit form could use same Novel editor for descriptions
2. **Video Player (Phase 7)** — decide Bunny Stream vs R2+FFmpeg, implement hls.js player with progress tracking
3. **Analytics (Phase 10)** — PostHog + Sentry setup (~30min)
4. **Site content editor** — connect landing page to siteContent table for live editing

### Post-MVP:
5. **UploadThing integration** — file uploads for course thumbnails, blog images, portfolio
6. **Bold.co / Wompi payments** — purchase flow for courses + subscriptions
7. **Resend emails** — transactional (welcome, password reset, purchase confirmation)
8. **Deploy to Vercel** — production deployment
9. **Bot social (Phase 3 future)** — WhatsApp/Instagram/Facebook via Meta API
