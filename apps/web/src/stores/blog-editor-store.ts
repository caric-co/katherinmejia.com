import type { DevulturMedia } from "@devultur/core";
import { create } from "zustand";

interface BlogEditorState {
  titleEs: string;
  contentEs: string;
  contentHtml: string;
  excerptEs: string;
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  cover: DevulturMedia | null;

  view: "editor" | "preview";
  previewLang: "es" | "en";
  generatingExcerpt: boolean;
  translating: boolean;
  capitalizing: boolean;
  saving: boolean;
  error: string;
  tokensUsed: number;

  setTitleEs: (v: string) => void;
  setContentEs: (v: string) => void;
  setContentHtml: (v: string) => void;
  setExcerptEs: (v: string) => void;
  setTitleEn: (v: string) => void;
  setExcerptEn: (v: string) => void;
  setContentEn: (v: string) => void;
  setCover: (v: DevulturMedia | null) => void;

  setView: (v: "editor" | "preview") => void;
  setPreviewLang: (v: "es" | "en") => void;
  setGeneratingExcerpt: (v: boolean) => void;
  setTranslating: (v: boolean) => void;
  setCapitalizing: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  setError: (v: string) => void;
  addTokens: (n: number) => void;

  init: (data: {
    titleEs: string;
    titleEn: string;
    excerptEs: string;
    excerptEn: string;
    contentHtml: string;
    contentEn: string;
    cover?: DevulturMedia | null;
  }) => void;
  reset: () => void;
}

const initialState = {
  titleEs: "",
  contentEs: "",
  contentHtml: "",
  excerptEs: "",
  titleEn: "",
  excerptEn: "",
  contentEn: "",
  cover: null as DevulturMedia | null,

  view: "editor" as const,
  previewLang: "es" as const,
  generatingExcerpt: false,
  translating: false,
  capitalizing: false,
  saving: false,
  error: "",
  tokensUsed: 0,
};

export const useBlogEditorStore = create<BlogEditorState>((set) => ({
  ...initialState,

  setTitleEs: (v) => set({ titleEs: v }),
  setContentEs: (v) => set({ contentEs: v }),
  setContentHtml: (v) => set({ contentHtml: v }),
  setExcerptEs: (v) => set({ excerptEs: v }),
  setTitleEn: (v) => set({ titleEn: v }),
  setExcerptEn: (v) => set({ excerptEn: v }),
  setContentEn: (v) => set({ contentEn: v }),
  setCover: (v) => set({ cover: v }),

  setView: (v) => set({ view: v }),
  setPreviewLang: (v) => set({ previewLang: v }),
  setGeneratingExcerpt: (v) => set({ generatingExcerpt: v }),
  setTranslating: (v) => set({ translating: v }),
  setCapitalizing: (v) => set({ capitalizing: v }),
  setSaving: (v) => set({ saving: v }),
  setError: (v) => set({ error: v }),
  addTokens: (n) => set((s) => ({ tokensUsed: s.tokensUsed + n })),

  init: (data) => set({ ...initialState, ...data }),
  reset: () => set(initialState),
}));
