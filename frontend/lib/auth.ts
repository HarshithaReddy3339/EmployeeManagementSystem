
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "HR_MANAGER" | "EMPLOYEE";
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// Save the access token and user details in this browser session.
export function saveAuth(data: AuthResponse) {
  sessionStorage.setItem("accessToken", data.accessToken);
  sessionStorage.setItem("user", JSON.stringify(data.user));
}

// Read the saved access token.
export function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

// Read the saved user.
export function getSavedUser(): AuthUser | null {
  const user = sessionStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    clearAuth();
    return null;
  }
}

// Clear local authentication data.
export function clearAuth() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
}

// Login API.
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  saveAuth(data);

  return data.user as AuthUser;
}

// Refresh the access token using the HTTP-only cookie.
export async function refreshAccessToken() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const data: AuthResponse = await response.json();

  saveAuth(data);

  return data;
}

// Get the logged-in user's profile.
export async function getCurrentUser() {
  const token = getAccessToken();

  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) return null;

  return response.json() as Promise<AuthUser>;
}

// Logout API.
export async function logout() {
  const token = getAccessToken();

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      credentials: "include",
    });
  } finally {
    clearAuth();
  }
}
