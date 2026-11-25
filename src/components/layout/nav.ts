import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const utilityNav: NavItem[] = [
  { href: "/progress", label: "Task progress", icon: ClipboardCheck },
];
