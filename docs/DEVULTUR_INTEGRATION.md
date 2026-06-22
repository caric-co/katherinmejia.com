# Devultur Integration

Packages installed: `@devultur/core`, `@devultur/react`, `@devultur/server` (v0.1.0)
Config: `src/lib/media.ts` with `createMediaRouter({ apiKey, baseUrl })`

## Environment

```
# apps/web/.env.local
VITE_DEVULTUR_API_KEY=<prod key from convex run --prod seed:createTestProject>
VITE_DEVULTUR_API_URL=https://devultur-api.crdemar.workers.dev
```

## Pending

### 1. UploadZone in LessonForm (admin)

File: `src/routes/admin/_layout/courses/$slug/lessons.tsx`

- Add `UploadZone` from `@devultur/react`
- On upload complete, trigger `media.transcode()` + `media.requestCaptions()`
- Show upload progress and transcode status
- Replace `videoId: "pending-upload"` with actual R2 key
- Accept: mp4, quicktime, webm

### 2. VideoPlayer in course detail (student)

File: `src/routes/courses/$slug.tsx` (or new lesson detail route)

- Add `VideoPlayer` from `@devultur/react` with HLS src
- Wire captions (es-CO, en) from Devultur media URLs
- Use `media.getMediaUrl()` for playlist and VTT URLs

### 3. ProgressProvider

File: `src/routes/__root.tsx`

- Wrap app with `ProgressProvider` from `@devultur/react`
- Connect to kmakeup's own Convex backend (not Devultur's)
- Wire `onSave`, `onLoad`, `onMarkComplete`, `onReset` to Convex mutations/queries
- Requires `progress` table in kmakeup's Convex schema

### 4. Image uploads (thumbnails)

File: admin course edit form

- Add `UploadZone` for course thumbnail
- Accept: jpeg, png, webp
- Store resulting URL via `media.getMediaUrl(key)`

## Notes

- `media.createUploadUrl()` calls the Devultur API, not R2 directly
- Transcode is async; video not playable until FFmpeg finishes on Fly.io
- Captions are async; subtitles appear once AssemblyAI completes
- Progress tracking uses kmakeup's Convex, not Devultur's
- Full integration guide: devultur repo `docs/internal/kmakeup-integration.md`
