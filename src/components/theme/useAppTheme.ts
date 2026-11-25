"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import type { AppTheme } from "./ThemeProvider";

const subscribe = () => () => {};

export function useAppTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const theme: AppTheme =
    mounted && (resolvedTheme === "dark" || resolvedTheme === "retro")
      ? resolvedTheme
      : "light";

  return { theme, setTheme: (next: AppTheme) => setTheme(next), mounted };
}
