export type Role = "ADMIN" | "HR_MANAGER" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    employees: number;
  };
}

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  profileImage: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: {
    id?: string;
    name: string;
    description?: string | null;
  };
  user: {
    id?: string;
    email: string;
    role?: Role;
    createdAt?: string;
  };
}

export interface PaginatedEmployees {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HrManager {
  id: string;
  email: string;
  role: "HR_MANAGER";
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  employeesByDepartment: {
    department: string;
    count: number;
  }[];
  employeesByDesignation: {
    designation: string;
    count: number;
  }[];
  recentEmployees: {
    id: string;
    firstName: string;
    lastName: string;
    designation: string;
    department: {
      name: string;
    };
    user: {
      email: string;
    };
  }[];
}

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Please set it in frontend/.env.local (e.g. http://localhost:3001/api/v1)."
    );
  }

  return apiUrl.replace(/\/+$/, "");
}

export function getAssetUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return null;

  try {
    const origin = new URL(apiUrl).origin;
    const normalizedPath = path.replace(/^\/+/, "");
    return `${origin}/${normalizedPath}`;
  } catch {
    return null;
  }
}

export function extractApiError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  token?: string | null;
  body?: unknown;
  isFormData?: boolean;
  refreshToken?: () => Promise<string | null>;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    token,
    body,
    isFormData = false,
    refreshToken,
  } = options;

  const baseUrl = getApiUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const execute = async (authToken?: string | null) => {
    const headers: Record<string, string> = {};

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    if (body !== undefined && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(url, {
      method,
      headers,
      credentials: "include",
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  };

  let response = await execute(token);

  if (response.status === 401 && refreshToken) {
    const newToken = await refreshToken();

    if (newToken) {
      response = await execute(newToken);
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    throw new Error(
      extractApiError(data, `Request failed with status ${response.status}.`)
    );
  }

  return data as T;
}
