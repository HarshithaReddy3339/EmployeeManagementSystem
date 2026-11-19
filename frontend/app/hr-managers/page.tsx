"use client";

import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../../components/app-shell";
import { useAuth } from "../../components/auth-provider";
import { apiRequest, type HrManager } from "../../lib/api";

export default function HrManagersPage() {
  const { accessToken, refreshSession } = useAuth();

  const [managers, setManagers] = useState<HrManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingManager, setEditingManager] = useState<HrManager | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<HrManager | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function fetchManagers() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest<HrManager[]>("/users/hr-managers", {
          token: accessToken,
          refreshToken: refreshSession,
        });

        if (!cancelled) {
          setManagers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load HR Managers."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchManagers();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshSession, refreshKey]);

  function startEdit(manager: HrManager) {
    setEditingManager(manager);
    setEmail(manager.email);
    setPassword("");
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingManager(null);
    setEmail("");
    setPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    const trimmedEmail = email.trim();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingManager) {
        const payload: { email?: string; password?: string } = {};

        if (trimmedEmail && trimmedEmail !== editingManager.email) {
          payload.email = trimmedEmail;
        }
        if (password) {
          payload.password = password;
        }

        if (!payload.email && !payload.password) {
          setError("Provide a new email or password to update.");
          setSaving(false);
          return;
        }

        const res = await apiRequest<{ message?: string; user?: HrManager }>(
          `/users/hr-managers/${editingManager.id}`,
          {
            method: "PATCH",
            token: accessToken,
            refreshToken: refreshSession,
            body: payload,
          }
        );

        setSuccess(res?.message || "HR Manager updated successfully.");
      } else {
        const res = await apiRequest<{ message?: string; user?: HrManager }>(
          "/users/hr-managers",
          {
            method: "POST",
            token: accessToken,
            refreshToken: refreshSession,
            body: {
              email: trimmedEmail,
              password,
            },
          }
        );

        setSuccess(res?.message || "HR Manager account created successfully.");
      }

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save HR Manager."
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
        `/users/hr-managers/${confirmDelete.id}`,
        {
          method: "DELETE",
          token: accessToken,
          refreshToken: refreshSession,
        }
      );

      setSuccess(res?.message || "HR Manager deleted successfully.");
      if (editingManager?.id === confirmDelete.id) {
        resetForm();
      }
      setConfirmDelete(null);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete HR Manager."
      );
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell title="HR Managers" breadcrumb="Management / HR Managers">
      <div className="page-header-row">
        <div>
          <h1>HR Manager Accounts</h1>
          <p>Admin-only management of HR Manager accounts and credentials.</p>
        </div>
      </div>

      {success && <div className="dashboard-success">{success}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {confirmDelete && (
        <div className="confirm-banner">
          <span>
            Delete HR Manager account <strong>{confirmDelete.email}</strong>?
            This action cannot be undone.
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
                {editingManager ? "Edit HR Manager" : "Add HR Manager"}
              </h3>
              <p>
                {editingManager
                  ? "Update email or set a new password"
                  : "Create a new HR Manager account"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label htmlFor="hrEmail">Email Address</label>
              <input
                id="hrEmail"
                type="email"
                className="field-input"
                placeholder="hr@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!editingManager}
              />
            </div>

            <div className="form-field">
              <label htmlFor="hrPassword">
                {editingManager ? "New Password (Optional)" : "Password"}
              </label>
              <input
                id="hrPassword"
                type="password"
                className="field-input"
                minLength={8}
                maxLength={72}
                placeholder={
                  editingManager
                    ? "Leave blank to keep current password"
                    : "Minimum 8 characters"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingManager}
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
                  : editingManager
                    ? "Update HR Manager"
                    : "Create HR Manager"}
              </button>

              {editingManager && (
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
              <h3>HR Manager List</h3>
              <p>{managers.length} active HR Manager accounts</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>CREATED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="table-empty">Loading HR Managers...</div>
                    </td>
                  </tr>
                ) : managers.length > 0 ? (
                  managers.map((manager) => (
                    <tr key={manager.id}>
                      <td>
                        <strong>{manager.email}</strong>
                      </td>
                      <td>
                        <span className="badge">HR MANAGER</span>
                      </td>
                      <td>
                        {manager.createdAt
                          ? new Date(manager.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(manager)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setError("");
                              setSuccess("");
                              setConfirmDelete(manager);
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
                        No HR Manager accounts found.
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
