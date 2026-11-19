import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../components/auth-provider";
import RouteGuard from "../components/route-guard";
export const instant = false;

export const metadata: Metadata = {
  title: "EmployEase - Employee Management System",
  description:
    "Full-stack Employee Management System built with Next.js, React, TypeScript, NestJS, and Prisma.",
  openGraph: {
    title: "EmployEase - Employee Management System",
    description:
      "Full-stack Employee Management System built with Next.js, React, TypeScript, NestJS, and Prisma.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="auth-loading">
                <p>Loading your session...</p>
              </div>
            }
          >
            <RouteGuard>{children}</RouteGuard>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}