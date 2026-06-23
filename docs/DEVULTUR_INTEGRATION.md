# Devultur Integration

Packages: `@devultur/core`, `@devultur/react`, `@devultur/server` (v0.2.20)
Config: `src/lib/media.ts` — `createMediaRouter({ baseUrl })` (no API key client-side)

## Environment

```
# apps/web/.env.local
VITE_DEVULTUR_API_URL=https://devultur-api.crdemar.workers.dev

# Convex (server-side only)
DEVULTUR_API_KEY=<prod key> (set via npx convex env set)
```

## Architecture

### Security: Convex bridge (no API key in browser)

All authenticated Devultur operations go through Convex actions. The API key lives server-side only.

**Bridge file:** `apps/backend/convex/devultur.ts`
- `issueViewerToken` — short-lived JWT for video/media access
- `createUploadUrl` — presigned URL for file uploads
- `deleteVideo` — cascade delete (raw + HLS + thumbnails + VTTs)
- `deleteMedia` — single file delete
- `requestCaptions` — trigger transcription + translation

**Client hook:** `apps/web/src/hooks/use-devultur.ts`
- `useDevultur()` returns `{ token, uploadUrl, deleteMedia, deleteVideo }`
- Token shared via Zustand store (`stores/devultur-store.ts`) — issued once, not per-component
- `media.extractKey(url)` for extracting R2 keys from media URLs

**Client media config:** `apps/web/src/lib/media.ts`
- Only `baseUrl` — used for `getMediaUrl()` URL construction
- No API key, no auth methods

## Status

### Done

#### Video pipeline (admin lesson editor)

File: `components/lesson-form.tsx` (extracted from lessons route)

- `UploadZone` → `useVideoProcessing` hook → `VideoPlayer` with `ref`
- Auto-save as draft on upload with fallback title
- AI metadata generation from transcript (title + description via Mistral)
- `TranscriptPanel` (SDK) with locale toggle, active cue highlighting, seek-on-click
- Sentence-based captions with two-line stacking (v0.2.19+)
- Video duration extracted client-side
- R2 cleanup on lesson delete and video replace

#### Image uploads

- `ImageUpload` component: `onUploadUrl` + `onDelete` + `token` props
- Course thumbnails (create + edit)
- Blog cover images (create + edit)
- Blog inline images via `/image` slash command
- R2 cleanup on image remove (confirm dialog)

#### Form architecture

All admin forms on TanStack Form + Zod:
- **Course create/edit**: `FormField` + shared `DescriptionField`/`PriceField` + `SmartSubmit`
- **Lesson create/edit**: TanStack Form + video pipeline + AI metadata
- **Blog create/edit**: `BlogPostEditor` with Zustand store
- **Content editor**: inline CMS with draft/publish
- ES-only input, auto-translate via Mistral on save

#### VideoPlayer theming

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
  --dvltr-buffered: rgba(246, 243, 238, 0.4);
}
```

#### Shared utilities (`@repo/utils`)

`slugify`, `formatDuration`, `formatDurationShort`, `formatCOPInput`, `parseCOPInput`, `getVideoDuration`, `withToken`

### Pending

#### Student video player

- `VideoPlayer` with `issueToken()` JWT for student auth
- `onProgress` with `progressInterval` for saving watch position
- `initialTime` from saved progress for resume

#### ProgressProvider

- Wrap app with `ProgressProvider` from `@devultur/react`
- Connect to Convex `progress` table

## SDK versions (kmakeup-relevant)

| Version | Key changes |
|---------|-------------|
| v0.2.5 | Default controls, caption translation |
| v0.2.7 | CSS custom properties, `[data-dvltr-*]` selectors |
| v0.2.8 | `@layer dvltr` for Tailwind v4 |
| v0.2.9 | Fullscreen fix, SpeedButton, keyboard shortcuts |
| v0.2.10 | CaptionOverlay, `--dvltr-thumb` |
| v0.2.11 | QualityButton for HLS adaptive |
| v0.2.12 | TranscriptPanel, `progressInterval`, Groq + Mistral captions |
| v0.2.17 | Convex bridge (`createDevulturClient`), R2 project isolation |
| v0.2.18 | `apiKey` optional on `createMediaRouter` |
| v0.2.19 | Sentence captions, two-line stacking, buffer indicator |
| v0.2.20 | `extractKey()` inverse of `getMediaUrl()` |
