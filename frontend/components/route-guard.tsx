"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

function getRedirectTarget(role: string, pathname: string): string | null {
  if (pathname === "/login") {
    return role === "EMPLOYEE" ? "/profile" : "/";
  }

  if (role === "EMPLOYEE") {
    return pathname === "/profile" ? null : "/profile";
  }

  if (pathname === "/profile") {
    return "/";
  }

  if (role === "HR_MANAGER" && pathname.startsWith("/hr-managers")) {
    return "/";
  }

  return null;
}

export default function RouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const redirectTarget = !loading
    ? !user
      ? pathname !== "/login"
        ? "/login"
        : null
      : getRedirectTarget(user.role, pathname)
    : null;

  useEffect(() => {
    if (redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading your session...</p>
      </div>
    );
  }

  if (redirectTarget) {
    return null;
  }

  return <>{children}</>;
}
