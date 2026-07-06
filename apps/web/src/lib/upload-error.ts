import { DevulturApiError } from "@devultur/core";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const rounded = size >= 10 ? Math.round(size) : Math.round(size * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

/**
 * Turns an upload/transcode error into a user-facing Spanish message.
 *
 * Since devultur 0.5.13, a limit rejection throws `DevulturApiError` with a
 * structured `code` (and `limit` in bytes for size caps) instead of silently
 * succeeding. Branch on the code, never on the human-readable string.
 */
export function uploadErrorMessage(error: Error): string {
  if (error instanceof DevulturApiError) {
    switch (error.code) {
      case "file_too_large":
        return error.limit
          ? `El archivo supera el límite del plan (máx ${formatBytes(error.limit)}).`
          : "El archivo supera el límite del plan.";
      case "storage_limit_reached":
        return "Alcanzaste el almacenamiento de tu plan. Borra media o sube de plan.";
      case "video_minutes_limit_reached":
        return "Alcanzaste los minutos de video de tu plan. Sube de plan para procesar más.";
      default:
        return error.message;
    }
  }
  return error.message;
}
