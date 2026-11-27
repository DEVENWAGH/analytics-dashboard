import { Gamepad2, Moon, Sun, type LucideIcon } from "lucide-react";
import { useAppTheme } from "@/components/theme/useAppTheme";
import type { AppTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const options: { value: AppTheme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "retro", label: "Retro theme", icon: Gamepad2 },
];

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useAppTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex h-9 items-center gap-0.5 rounded-[8px] border border-border bg-card p-0.5"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
