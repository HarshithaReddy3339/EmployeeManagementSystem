"use client";

import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../../components/app-shell";
import { useAuth } from "../../components/auth-provider";
import { apiRequest, type Department } from "../../lib/api";

export default function DepartmentsPage() {
  const { accessToken, refreshSession } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function fetchDepartments() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest<Department[]>("/departments", {
          token: accessToken,
          refreshToken: refreshSession,
        });

        if (!cancelled) {
          setDepartments(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load departments."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDepartments();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshSession, refreshKey]);

  function startEdit(department: Department) {
    setEditingDepartment(department);
    setName(department.name);
    setDescription(department.description ?? "");
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingDepartment(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Department name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingDepartment) {
        await apiRequest<Department>(`/departments/${editingDepartment.id}`, {
          method: "PATCH",
          token: accessToken,
          refreshToken: refreshSession,
          body: {
            name: trimmedName,
            description: trimmedDescription,
          },
        });
        setSuccess("Department updated successfully.");
      } else {
        await apiRequest<Department>("/departments", {
          method: "POST",
          token: accessToken,
          refreshToken: refreshSession,
          body: trimmedDescription
            ? { name: trimmedName, description: trimmedDescription }
            : { name: trimmedName },
        });
        setSuccess("Department created successfully.");
      }

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save department."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete || !accessToken) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const res = await apiRequest<{ message?: string }>(
        `/departments/${confirmDelete.id}`,
        {
          method: "DELETE",
          token: accessToken,
          refreshToken: refreshSession,
        }
      );

      setSuccess(res?.message || "Department deleted successfully.");
      if (editingDepartment?.id === confirmDelete.id) {
        resetForm();
      }
      setConfirmDelete(null);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete department."
      );
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell title="Departments" breadcrumb="Management / Departments">
      <div className="page-header-row">
        <div>
          <h1>Department Management</h1>
          <p>Create, update, and organize departments across your company.</p>
        </div>
      </div>

      {success && <div className="dashboard-success">{success}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {confirmDelete && (
        <div className="confirm-banner">
          <span>
            Delete department <strong>{confirmDelete.name}</strong>? Departments
            with assigned employees cannot be deleted.
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
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      )}

      <div className="split-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h3>
              <p>
                {editingDepartment
                  ? "Modify the selected department details"
                  : "Create a new organizational department"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label htmlFor="deptName">Department Name</label>
              <input
                id="deptName"
                type="text"
                className="field-input"
                maxLength={100}
                placeholder="e.g. Engineering"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="deptDescription">Description (Optional)</label>
              <textarea
                id="deptDescription"
                className="field-textarea"
                maxLength={500}
                placeholder="Brief summary of department responsibilities"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingDepartment
                    ? "Update Department"
                    : "Create Department"}
              </button>

              {editingDepartment && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>All Departments</h3>
              <p>{departments.length} total departments</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>EMPLOYEES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="table-empty">Loading departments...</div>
                    </td>
                  </tr>
                ) : departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>
                        <strong>{department.name}</strong>
                      </td>
                      <td>{department.description || "—"}</td>
                      <td>
                        <span className="badge">
                          {department._count?.employees ?? 0}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(department)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setError("");
                              setSuccess("");
                              setConfirmDelete(department);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="table-empty">
                        No departments have been created yet.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
