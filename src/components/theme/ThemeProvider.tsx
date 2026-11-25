import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const THEMES = ["light", "dark", "retro"] as const;
export type AppTheme = (typeof THEMES)[number];

const STORAGE_KEY = "northline-theme";

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (next: AppTheme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  mounted: false,
});

function readStoredTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "retro" || saved === "light") {
      return saved;
    }
  } catch {
    // ignore storage access issues
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => readStoredTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "retro");
    if (theme !== "light") {
      root.classList.add(theme);
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage quota issues
    }
  }, [theme]);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
