import { type DevulturMedia, type MediaUrlOptions, publicUrl } from "@devultur/core";

export const mediaBaseUrl = import.meta.env.VITE_DEVULTUR_API_URL || "https://devultur-api.crdemar.workers.dev";

/**
 * URL pública estable de una imagen: sin token, cacheable, og-safe. La usamos donde guardamos un
 * string (siteContent de la landing) o en SSR/meta (og:image), no una `DevulturMedia`. En kmakeup
 * las imágenes (thumbnails, covers, landing) son públicas por invariante; el schema las tipa con
 * visibilidad general, así que afirmamos `"public"` acá.
 */
export const publicImageUrl = (media: DevulturMedia, options?: Omit<MediaUrlOptions, "token">): string =>
  publicUrl(mediaBaseUrl, media as DevulturMedia<"public">, options);

/**
 * Reconstruye la `DevulturMedia<"public">` desde una URL pública que nosotros produjimos
 * (`{base}/v1/media/public/{kind}/{id}/{filename}`). Devuelve `null` para cualquier otra cosa
 * (una URL externa tipo Unsplash, o vacío). Solo lo necesita siteContent, que persiste el string
 * de la URL en vez de la referencia; el resto de la app guarda la `DevulturMedia` directo.
 */
export function mediaFromPublicUrl(url: string | null | undefined): DevulturMedia<"public"> | null {
  if (!url) return null;
  const prefix = `${mediaBaseUrl}/v1/media/`;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length).split("?")[0];
  const [visibility, kind, id, ...rest] = path.split("/");
  if (visibility !== "public" || !id) return null;
  if (kind !== "image" && kind !== "video" && kind !== "file") return null;
  return { id, kind, visibility: "public", filename: rest.join("/") || undefined };
}
