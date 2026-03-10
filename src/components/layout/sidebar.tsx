"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Settings, Eye, BarChart3,
  ChevronLeft, ChevronRight, Bell, UserCog, FileText,
  Shield, GitCompare,
} from "lucide-react";
import { useState } from "react";

type UserRole = "admin" | "hr";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "hr"] },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users, roles: ["admin", "hr"] },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompare, roles: ["admin", "hr"] },
  { href: "/dashboard/reports", label: "Reports", icon: FileText, roles: ["admin", "hr"] },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ["admin", "hr"] },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["admin"] },
  { href: "/dashboard/users", label: "Users", icon: UserCog, roles: ["admin"] },
  { href: "/preview", label: "Preview", icon: Eye, roles: ["admin"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

interface SidebarProps {
  role?: UserRole;
  userName?: string;
}

export function Sidebar({ role = "admin", userName = "Admin" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-gray-100 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zima-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-gray-900">ZIMA</span>
              <span className="text-[10px] leading-tight text-gray-400">Vector Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zima-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                isActive
                  ? "bg-zima-50 text-zima-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-zima-600" : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-gray-100 p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zima-100 text-xs font-semibold text-zima-700">
              {userName[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium text-gray-900">{userName}</p>
              <p className="text-[10px] capitalize text-gray-400">{role}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
