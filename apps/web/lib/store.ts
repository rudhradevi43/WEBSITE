import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  selectedCountry: "United Kingdom",
  setSelectedCountry: (selectedCountry) => set({ selectedCountry })
}));
