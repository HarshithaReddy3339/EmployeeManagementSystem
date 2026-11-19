"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import LogoutButton from "./logout-button";
import { useAuth } from "./auth-provider";
import type { Role } from "../lib/api";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: "▦", label: "Dashboard", roles: ["ADMIN", "HR_MANAGER"] },
  {
    href: "/employees",
    icon: "♙",
    label: "Employees",
    roles: ["ADMIN", "HR_MANAGER"],
  },
  {
    href: "/departments",
    icon: "▤",
    label: "Departments",
    roles: ["ADMIN", "HR_MANAGER"],
  },
  { href: "/hr-managers", icon: "♧", label: "HR Managers", roles: ["ADMIN"] },
  { href: "/profile", icon: "♙", label: "My Profile", roles: ["EMPLOYEE"] },
];

interface AppShellProps {
  title: string;
  breadcrumb: string;
  children: ReactNode;
}

export default function AppShell({
  title,
  breadcrumb,
  children,
}: AppShellProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const visibleNav = NAV_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>EmployEase</h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="nav-section-title">MENU</div>

        <nav className="navigation">
          {visibleNav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>
            <div>
              <strong>Need help?</strong>
              <p>Contact your administrator</p>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="avatar">{firstLetter}</div>
            <div className="user-info">
              <strong>{user?.email || "User"}</strong>
              <span>{user?.role?.replace("_", " ") || "Account"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="breadcrumb">{breadcrumb}</p>
            <h2>{title}</h2>
          </div>

          <div className="header-right">
            <LogoutButton />

            <div className="status-indicator">
              <span className="status-dot"></span>
              System Online
            </div>

            <div className="header-avatar">{firstLetter}</div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
