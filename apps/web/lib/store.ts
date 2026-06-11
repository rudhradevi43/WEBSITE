import { create } from "zustand";

type SearchState = {
  title: string;
  skills: string[];
  countries: string[];
  setTitle: (title: string) => void;
  setSkills: (skills: string[]) => void;
  setCountries: (countries: string[]) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  title: "Power Platform Developer",
  skills: ["Power BI", "Python", "Dataverse", "Power Apps"],
  countries: ["United Kingdom"],
  setTitle: (title) => set({ title }),
  setSkills: (skills) => set({ skills }),
  setCountries: (countries) => set({ countries })
}));
