# Devultur Integration

Packages: `@devultur/core`, `@devultur/react`, `@devultur/server` (v0.2.12)
Config: `src/lib/media.ts` — `createMediaRouter({ apiKey, baseUrl })`

## Environment

```
# apps/web/.env.local
VITE_DEVULTUR_API_KEY=<prod key>
VITE_DEVULTUR_API_URL=https://devultur-api.crdemar.workers.dev
```

## Status

### Done

#### 1. LessonForm with full video pipeline (admin)

File: `src/routes/admin/_layout/courses/$slug/lessons.tsx`

**Upload flow:**
- `UploadZone` from `@devultur/react` with render props UI
- `media.createUploadUrl()` → presigned URL + key → direct upload to R2
- Collapses to chip after upload (single video per lesson)
- Accept: mp4, quicktime, webm (max 2GB)

**Processing:**
- `useVideoProcessing` hook handles transcode + captions lifecycle
- Polling every 5s until both transcode and captions complete
- For existing lessons with `mediaStatus === "ready"`, URLs built directly via `videoHlsPlaylistPath` + `captionPath`

**Video playback:**
- `VideoPlayer` from `@devultur/react` with built-in DefaultControls (v0.2.5+)
- Imperative ref (`VideoPlayerRef`) for seek/play from transcript cues
- Auth via `?token=` query param on playlist URL + `token` prop for segments/captions
- Themed with kmakeup brand colors via `--dvltr-*` CSS custom properties

**Captions & transcript:**
- `CaptionOverlay` (SDK v0.2.10+) renders subtitles as positioned div overlay
- `TranscriptPanel` (SDK v0.2.12) with active cue highlighting, auto-scroll, click-to-seek
- Locale toggle (ES/EN) for switching between subtitle tracks
- VTT download per locale

**AI metadata generation:**
- Auto-generates title + description from es-CO transcript via `api.ai.generateLessonMetadata` (Mistral)
- Triggers automatically when captions first become available
- Sparkles button for manual re-generation
- Fields are editable after generation

**Slug generation:**
- Format: `{course-prefix}-{sequence}-{title-slug}-{timestamp}`
- Course prefix: initials of course slug (e.g., `curso-de-prueba` → `cdp`)
- Sequence: padStart 4 digits (0001, 0002, ...)
- Generated on save

**Auto-save draft:**
- On upload complete, saves lesson as draft with fallback title "Lección sin nombrar"
- Sets `mediaStatus: "processing"`, updates to `"ready"` when pipeline completes

**Form architecture:**
- TanStack Form + Zod validation (title min 3 chars)
- `FormField` with auto-advance (title → description → submit)
- `SmartSubmit` with empty field hints
- ES-only input, auto-translate via Mistral on save
- Duration extracted client-side from video file metadata

#### 2. Schema (convex/schema.ts)

Fields on `lessons` table:
- `slug`: optional string
- `mediaStatus`: "processing" | "ready" | "error"
- `hlsPlaylistUrl`, `thumbnailUrl`, `captionLocales`, `captionTranscriptId`, `mediaError`
- Index: `by_videoId` for lookup by video key

#### 3. Backend (convex/lessons.ts)

- `create` and `update` accept `slug`, `mediaStatus`, `captionLocales`, `captionTranscriptId`
- `updateMediaStatus` internal mutation (for future webhook use)

#### 4. AI actions (convex/ai.ts)

- `generateLessonMetadata` — transcript → title + description via Mistral
- `translateText` — ES → EN translation
- `capitalizeTitle` — Spanish title capitalization

#### 5. Form architecture migration

All admin forms migrated to TanStack Form + Zod validation:
- **Course create/edit**: `FormField` with auto-advance, `SmartSubmit`, slug hint in error slot
- **Blog create/edit**: Unified into `BlogPostEditor` component with Zustand store
- **Lesson create/edit**: TanStack Form + video pipeline + AI metadata
- **Content editor**: `useMemo` for contentMap, unified `startEdit`, focus on preview click
- **All bilingual forms**: ES-only input, auto-translate via Mistral on save

#### 6. VideoPlayer theming (packages/ui/src/styles/globals.css)

```css
[data-dvltr-controls] {
  --dvltr-accent: var(--peach);
  --dvltr-text: #f6f3ee;
  --dvltr-bar-bg: linear-gradient(transparent, rgba(43, 38, 38, 0.75));
  --dvltr-menu-bg: rgba(43, 38, 38, 0.9);
  --dvltr-track-bg: rgba(246, 243, 238, 0.25);
  --dvltr-thumb: #fff;
  --dvltr-thumb-width: 4px;
  --dvltr-thumb-height: 12px;
  --dvltr-thumb-shadow: -3px 0 4px 0 rgba(0, 0, 0, 0.4);
}
```

### Pending

#### VideoPlayer in course detail (student)

File: `src/routes/courses/$slug.tsx` (or new lesson detail route)

- `VideoPlayer` with `issueToken()` JWT for student auth (not API key)
- Wire `onProgress` to save watch position via Convex
- `initialTime` from saved progress for resume playback

#### ProgressProvider

File: `src/routes/__root.tsx`

- Wrap app with `ProgressProvider` from `@devultur/react`
- Connect to kmakeup's Convex backend
- Wire `onSave`, `onLoad`, `onMarkComplete`, `onReset` to Convex mutations/queries
- Uses existing `progress` table in schema

#### Image uploads (thumbnails)

File: admin course edit form

- `UploadZone` for course thumbnail
- Accept: jpeg, png, webp
- Store resulting URL via `media.getMediaUrl(key)`

## Architecture Notes

- `media.createUploadUrl()` calls the Devultur API, not R2 directly
- Transcode is async via Fly.io; `useVideoProcessing` hook polls until complete
- Captions: Groq Whisper for transcription (v0.2.12+), Mistral Small for translation
- Captions are synchronous in v0.2.12+ (POST does all work, returns "completed")
- `CaptionOverlay` replaces native `<track>` elements (HLS.js compatibility)
- **Webhooks are stubs** — polling is the supported approach
- `VideoPlayer` accepts `ref` prop (React 19, no forwardRef) for imperative control
- All control styles use `@layer dvltr` for Tailwind v4 cascade compatibility
- Theming via `--dvltr-*` CSS custom properties + `[data-dvltr-*]` selectors
- Pipeline verified end-to-end: upload mp4 → R2 → HLS 720p via Fly.io → captions es-CO/en via Groq + Mistral → VTT to R2

## SDK versions changelog (kmakeup-relevant)

| Version | Key changes |
|---------|-------------|
| v0.2.1 | MediaRouter exposes transcode/captions/issueToken directly |
| v0.2.3 | `useVideoProcessing` hook, `extractId()`, transcode returns duration |
| v0.2.5 | VideoPlayer default controls, multi-locale caption translation |
| v0.2.6 | Imperative ref, `startTime` → `initialTime`, SeekBar thin bar |
| v0.2.7 | CSS custom properties for theming, `[data-dvltr-*]` selectors |
| v0.2.8 | `@layer dvltr` for Tailwind v4 compat |
| v0.2.9 | Fullscreen fix, caption display fix, SpeedButton, keyboard shortcuts |
| v0.2.10 | CaptionOverlay replaces native tracks, `--dvltr-thumb` property |
| v0.2.11 | QualityButton for HLS adaptive streaming |
| v0.2.12 | Groq + Mistral captions, TranscriptPanel component, `progressInterval` |
