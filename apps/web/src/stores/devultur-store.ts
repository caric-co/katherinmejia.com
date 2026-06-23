import { create } from "zustand";

interface DevulturState {
  token: string | null;
  setToken: (token: string) => void;
}

export const useDevulturStore = create<DevulturState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
