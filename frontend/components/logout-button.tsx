
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="logout-button"
    >
      Logout
    </button>
  );
}
