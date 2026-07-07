import { useMediaUrl } from "@devultur/convex/react";

import { mediaKeyFromUrl } from "#/lib/media";

/**
 * Devultur delivery requires a viewer token, so a raw stored URL 404s/500s when
 * rendered directly. This rebuilds the URL with the context token injected.
 * Non-devultur URLs (e.g. Unsplash fallbacks) pass through untouched.
 */
export function useAuthedMediaUrl(url: string | null | undefined): string | null {
  const key = url ? mediaKeyFromUrl(url) : null;
  return useMediaUrl(key) ?? url ?? null;
}
