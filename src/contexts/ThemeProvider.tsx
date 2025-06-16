import { useEffect } from "react";
import { useThemeStore } from "@/hooks/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { theme, setTheme } = useThemeStore();

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme-storage");
		if (savedTheme) {
			try {
				const parsed = JSON.parse(savedTheme);
				setTheme(parsed.state.theme);
			} catch {
				setTheme("light");
			}
		} else {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			setTheme(systemTheme);
		}
	}, [setTheme]);

	return <>{children}</>;
}
