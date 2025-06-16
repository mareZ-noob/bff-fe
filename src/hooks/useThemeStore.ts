import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "light",
			setTheme: (theme: Theme) => {
				set({ theme });
				if (typeof window !== "undefined") {
					document.documentElement.classList.remove("light", "dark");
					document.documentElement.classList.add(theme);
				}
			},
			toggleTheme: () => {
				const currentTheme = get().theme;
				const newTheme = currentTheme === "light" ? "dark" : "light";
				get().setTheme(newTheme);
			},
		}),
		{
			name: "theme-storage",
			onRehydrateStorage: () => (state) => {
				if (state && typeof window !== "undefined") {
					document.documentElement.classList.remove("light", "dark");
					document.documentElement.classList.add(state.theme);
				}
			},
		},
	),
);
