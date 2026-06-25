import { createContext, createElement, useContext } from "react";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";

const DraftModeContext = createContext(false);
const PreviewModeContext = createContext(false);
const FieldClickContext = createContext<((key: string) => void) | null>(null);
const SiteContentContext = createContext<Map<string, any> | null>(null);

export const DraftModeProvider = DraftModeContext.Provider;
export const PreviewModeProvider = PreviewModeContext.Provider;
export const FieldClickProvider = FieldClickContext.Provider;
export const usePreviewMode = () => useContext(PreviewModeContext);
export const useFieldClick = () => useContext(FieldClickContext);

interface SiteContentProviderProps {
  children: React.ReactNode;
  serverData?: Array<any>;
}

export function SiteContentProvider({ children, serverData }: SiteContentProviderProps) {
  const { data: items } = useQuery(convexQuery(api.siteContent.listAll, {}));
  const data = items ?? serverData;
  const contentMap = data ? new Map(data.map((c: any) => [c.key, c])) : null;

  return createElement(SiteContentContext.Provider, { value: contentMap }, children);
}

export function useSiteContentReady(): boolean {
  return useContext(SiteContentContext) !== null;
}

export function useSiteContent(_prefix: string) {
  const { i18n } = useTranslation();
  const locale = i18n.language as "es" | "en";
  const isDraft = useContext(DraftModeContext);
  const isPreview = useContext(PreviewModeContext);
  const onFieldClick = useContext(FieldClickContext);
  const contentMap = useContext(SiteContentContext);

  function resolve(key: string, fallback: string): string {
    if (!contentMap) return fallback;
    const item = contentMap.get(key);
    if (!item) return fallback;
    const value = isDraft && item.draftValue ? item.draftValue : item.value;
    return value[locale] || value.es || fallback;
  }

  function t(key: string, fallback: string): any {
    const text = resolve(key, fallback);

    if (isPreview && onFieldClick && !key.endsWith(".image")) {
      return createElement(
        "span",
        {
          "data-field-key": key,
          className:
            "cursor-pointer hover:ring-1 hover:ring-foreground/20 hover:ring-offset-2 rounded-sm transition-shadow",
          onClick: (e: any) => {
            e.stopPropagation();
            e.preventDefault();
            onFieldClick(key);
          },
        },
        text,
      );
    }

    return text;
  }

  return { t, isLoaded: contentMap !== null };
}
