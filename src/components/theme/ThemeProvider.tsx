"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export const THEMES = ["light", "dark", "retro"] as const;
export type AppTheme = (typeof THEMES)[number];

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={[...THEMES]}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="northline-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
