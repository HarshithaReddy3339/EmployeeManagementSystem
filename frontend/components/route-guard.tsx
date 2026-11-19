
"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export default function RouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace(
        user.role === "EMPLOYEE" ? "/profile" : "/"
      );
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading your session...</p>
      </div>
    );
  }

  if (!user && pathname !== "/login") {
    return null;
  }

  if (user && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
