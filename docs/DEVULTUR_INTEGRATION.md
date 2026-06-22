# Devultur Integration

Packages: `@devultur/core`, `@devultur/react`, `@devultur/server` (v0.2.1)
Config: `src/lib/media.ts` — `createMediaRouter({ apiKey, baseUrl })`

## Environment

```
# apps/web/.env.local
VITE_DEVULTUR_API_KEY=<prod key>
VITE_DEVULTUR_API_URL=https://devultur-api.crdemar.workers.dev
```

## Status

### Done

#### 1. UploadZone in LessonForm (admin)

File: `src/routes/admin/_layout/courses/$slug/lessons.tsx`

- `UploadZone` from `@devultur/react` with render props UI
- Upload flow: `media.createUploadUrl()` → presigned URL + key → direct upload to R2
- Post-upload: `media.transcode(key)` + `media.requestCaptions(key, ["es-CO", "en"])`
- Polling: `getTranscodeStatus()` + `getCaptionsStatus()` every 5s until completed
- UI states: idle → uploading (progress bar) → processing (transcode/captions) → ready
- Saves `videoId` (R2 key) + `mediaStatus` to Convex on form submit
- Accept: mp4, quicktime, webm (max 2GB)

#### Schema changes (convex/schema.ts)

New optional fields on `lessons` table:
- `mediaStatus`: "processing" | "ready" | "error"
- `hlsPlaylistUrl`, `thumbnailUrl`, `captionLocales`, `mediaError`
- Index: `by_videoId` for lookup by video key

#### Backend (convex/lessons.ts)

- `create` and `update` accept optional `mediaStatus`
- `updateMediaStatus` internal mutation (for future webhook use)

#### Form architecture migration

All admin forms migrated to TanStack Form + Zod validation:
- **Course create/edit**: `FormField` with auto-advance, `SmartSubmit`, slug hint
- **Blog create/edit**: Unified into `BlogPostEditor` component with Zustand store
- **Content editor**: `useMemo` for contentMap, unified `startEdit`, focus on preview click
- **All bilingual forms**: ES-only input, auto-translate via Mistral on save (no dual EN fields)

### Pending

#### 2. LessonForm re-make

- Migrate to TanStack Form + Zod (currently raw useState)
- Remove dual ES/EN inputs, auto-translate on save
- Keep UploadZone + polling integration

#### 3. VideoPlayer in course detail (student)

File: `src/routes/courses/$slug.tsx` (or new lesson detail route)

- Add `VideoPlayer` from `@devultur/react` with HLS src
- Wire captions (es-CO, en) from Devultur media URLs
- Use `media.getMediaUrl()` for playlist and VTT URLs

#### 4. ProgressProvider

File: `src/routes/__root.tsx`

- Wrap app with `ProgressProvider` from `@devultur/react`
- Connect to kmakeup's Convex backend (not Devultur's)
- Wire `onSave`, `onLoad`, `onMarkComplete`, `onReset` to Convex mutations/queries
- Uses existing `progress` table in schema

#### 5. Image uploads (thumbnails)

File: admin course edit form

- Add `UploadZone` for course thumbnail
- Accept: jpeg, png, webp
- Store resulting URL via `media.getMediaUrl(key)`

## Architecture Notes

- `media.createUploadUrl()` calls the Devultur API, not R2 directly
- Transcode is async; video not playable until FFmpeg finishes on Fly.io
- Captions are async; subtitles appear once AssemblyAI completes
- **Webhooks are stubs** — polling via `getTranscodeStatus()`/`getCaptionsStatus()` is the current approach
- Progress tracking uses kmakeup's Convex, not Devultur's
- `MediaRouter` (v0.2.1) exposes `transcode()`, `getTranscodeStatus()`, `requestCaptions()`, `getCaptionsStatus()`, `getMediaUrl()`, `issueToken()` directly — no need for separate `ManagedClient`
- Pipeline verified end-to-end in prod: upload 15MB mp4 → R2 → HLS 720p via Fly.io → captions es-CO via AssemblyAI
