"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../../components/app-shell";
import { useAuth } from "../../components/auth-provider";
import {
  apiRequest,
  getAssetUrl,
  type Department,
  type Employee,
  type PaginatedEmployees,
} from "../../lib/api";

const PAGE_LIMIT = 10;

export default function EmployeesPage() {
  const { user, accessToken, refreshSession } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 1,
  });

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadDepartments() {
      try {
        const data = await apiRequest<Department[]>("/departments", {
          token: accessToken,
          refreshToken: refreshSession,
        });
        if (!cancelled) {
          setDepartments(Array.isArray(data) ? data : []);
        }
      } catch {
        // Department filter dropdown remains usable with "All Departments".
      }
    }

    loadDepartments();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshSession]);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function fetchEmployees() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_LIMIT),
        });

        if (appliedSearch.trim()) {
          params.set("search", appliedSearch.trim());
        }

        if (departmentId) {
          params.set("departmentId", departmentId);
        }

        const result = await apiRequest<PaginatedEmployees>(
          `/employees?${params.toString()}`,
          {
            token: accessToken,
            refreshToken: refreshSession,
          }
        );

        if (cancelled) return;

        setEmployees(result.data ?? []);
        setMeta(
          result.meta ?? {
            total: 0,
            page,
            limit: PAGE_LIMIT,
            totalPages: 1,
          }
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load employees."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEmployees();

    return () => {
      cancelled = true;
    };
  }, [accessToken, page, appliedSearch, departmentId, refreshSession, refreshKey]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput);
  }

  function handleClearFilters() {
    setSearchInput("");
    setAppliedSearch("");
    setDepartmentId("");
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete || !accessToken) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const res = await apiRequest<{ message?: string }>(
        `/employees/${confirmDelete.id}`,
        {
          method: "DELETE",
          token: accessToken,
          refreshToken: refreshSession,
        }
      );

      setSuccess(res?.message || "Employee deleted successfully.");
      setConfirmDelete(null);

      if (employees.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, meta.totalPages || 1);

  return (
    <AppShell title="Employees" breadcrumb="Management / Employees">
      <div className="page-header-row">
        <div>
          <h1>Employee Management</h1>
          <p>Search, filter, view, and manage organization employee records.</p>
        </div>

        <Link href="/employees/new" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      {success && <div className="dashboard-success">{success}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {confirmDelete && isAdmin && (
        <div className="confirm-banner">
          <span>
            Delete employee{" "}
            <strong>
              {confirmDelete.firstName} {confirmDelete.lastName}
            </strong>{" "}
            ({confirmDelete.user?.email})? This action cannot be undone.
          </span>
          <div className="table-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger-solid btn-sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      )}

      <section className="panel">
        <form onSubmit={handleSearchSubmit} className="toolbar">
          <input
            type="text"
            className="toolbar-input"
            placeholder="Search by name, email, or designation..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <select
            className="toolbar-select"
            aria-label="Filter by department"
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>

          {(appliedSearch || departmentId || searchInput) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Reset
            </button>
          )}
        </form>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DESIGNATION</th>
                <th>DEPARTMENT</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">Loading employees...</div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((employee) => {
                  const photoUrl = getAssetUrl(employee.profileImage);
                  const showPhoto = Boolean(photoUrl && !failedImages[employee.id]);
                  const initials =
                    `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase() ||
                    "E";

                  return (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-cell">
                          {showPhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photoUrl!}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="employee-thumb"
                              onError={() =>
                                setFailedImages((prev) => ({
                                  ...prev,
                                  [employee.id]: true,
                                }))
                              }
                            />
                          ) : (
                            <div className="employee-thumb">{initials}</div>
                          )}
                          <Link
                            href={`/employees/${employee.id}`}
                            className="table-link"
                          >
                            {employee.firstName} {employee.lastName}
                          </Link>
                        </div>
                      </td>
                      <td>{employee.designation}</td>
                      <td>
                        <span className="badge">
                          {employee.department?.name || "—"}
                        </span>
                      </td>
                      <td>{employee.user?.email || "—"}</td>
                      <td>{employee.phone || "—"}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            href={`/employees/${employee.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            View / Edit
                          </Link>
                          {isAdmin && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setSuccess("");
                                setConfirmDelete(employee);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">
                      No employees match the current filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span>
            Showing page {meta.page} of {totalPages} ({meta.total}{" "}
            {meta.total === 1 ? "employee" : "employees"} total)
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading || page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading || page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
