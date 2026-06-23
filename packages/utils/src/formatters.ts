import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | number, pattern = "d MMM yyyy"): string {
  return format(date, pattern, { locale: es });
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCOPInput(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("es-CO");
}

export function parseCOPInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ""), 10) || 0;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function withToken(url: string, token: string | null | undefined): string {
  if (!token) return url;
  return `${url}${url.includes("?") ? "&" : "?"}token=${token}`;
}
