"use client";

import { Check, Circle } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { assignmentTasks } from "@/data/mock";
import { useAppTheme } from "@/components/theme/useAppTheme";
import { getChartSurface, tooltipStyles } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";

export function AssignmentProgress() {
  const { theme } = useAppTheme();
  const surface = getChartSurface(theme);
  const allItems = assignmentTasks.flatMap((day) => day.items);
  const done = allItems.filter((item) => item.done).length;
  const total = allItems.length;
  const remaining = total - done;
  const percent = Math.round((done / total) * 100);

  const chartData = [
    {
      name: "Completed",
      value: done,
      color: theme === "dark" ? "#34d399" : theme === "retro" ? "#5b4a9e" : "#0f9f6e",
    },
    {
      name: "Remaining",
      value: remaining,
      color: theme === "dark" ? "#2a2f3a" : theme === "retro" ? "#c9bff0" : "#e6e8eb",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="grid gap-3 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
          <h2 className="text-[13px] font-semibold text-foreground">
            Overall completion
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Mon–Fri assignment checklist
          </p>

          <div className="relative mx-auto mt-2 h-[180px] w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyles(surface, theme)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[28px] font-semibold tracking-tight tabular text-foreground">
                {percent}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                {done}/{total} tasks
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
          <h2 className="text-[13px] font-semibold text-foreground">By day</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Green means done. Update Friday items after README and deploy.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {assignmentTasks.map((day) => {
              const dayDone = day.items.filter((i) => i.done).length;
              const dayTotal = day.items.length;
              const complete = dayDone === dayTotal;

              return (
                <div
                  key={day.id}
                  className={cn(
                    "rounded-[10px] border p-3",
                    complete
                      ? "border-success/30 bg-success-soft/40"
                      : "border-border bg-background",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-foreground">{day.day}</p>
                    <span className="text-[11px] tabular text-muted-foreground">
                      {dayDone}/{dayTotal}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{day.title}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        complete ? "bg-success" : "bg-accent",
                      )}
                      style={{ width: `${(dayDone / dayTotal) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {assignmentTasks.map((day) => {
          const dayDone = day.items.every((item) => item.done);

          return (
            <article
              key={day.id}
              className="rounded-[10px] border border-border bg-card p-4 shadow-xs"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">
                    {day.day}: {day.title}
                  </h3>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    dayDone
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning",
                  )}
                >
                  {dayDone ? "Complete" : "In progress"}
                </span>
              </div>

              <ul className="space-y-2">
                {day.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2.5 rounded-[8px] border border-border bg-background px-3 py-2.5"
                  >
                    {item.done ? (
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                    ) : (
                      <Circle
                        className="mt-0.5 h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                    )}
                    <span
                      className={cn(
                        "text-[13px]",
                        item.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </div>
  );
}
