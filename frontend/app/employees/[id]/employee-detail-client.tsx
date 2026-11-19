"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../../../components/app-shell";
import { useAuth } from "../../../components/auth-provider";
import {
  apiRequest,
  getAssetUrl,
  type Department,
  type Employee,
} from "../../../lib/api";

export default function EmployeeDetailClient() {
  const params = useParams<{ id: string }>();
  const employeeId = params?.id;
  const router = useRouter();
  const { user, accessToken, refreshSession } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!accessToken || !employeeId) return;

    let cancelled = false;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const [empData, deptData] = await Promise.all([
          apiRequest<Employee>(`/employees/${employeeId}`, {
            token: accessToken,
            refreshToken: refreshSession,
          }),
          apiRequest<Department[]>("/departments", {
            token: accessToken,
            refreshToken: refreshSession,
          }),
        ]);

        if (cancelled) return;

        setEmployee(empData);
        setDepartments(Array.isArray(deptData) ? deptData : []);

        setFirstName(empData.firstName || "");
        setLastName(empData.lastName || "");
        setPhone(empData.phone || "");
        setDesignation(empData.designation || "");
        setDepartmentId(empData.departmentId || "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load employee details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [accessToken, employeeId, refreshSession]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !employeeId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await apiRequest<Employee>(`/employees/${employeeId}`, {
        method: "PATCH",
        token: accessToken,
        refreshToken: refreshSession,
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          designation: designation.trim(),
          departmentId,
        },
      });

      setEmployee((prev) => ({
        ...updated,
        user: {
          ...prev?.user,
          ...updated.user,
        },
      }));
      setSuccess("Employee details updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update employee."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !employeeId) return;

    try {
      setDeleting(true);
      setError("");

      await apiRequest<{ message?: string }>(`/employees/${employeeId}`, {
        method: "DELETE",
        token: accessToken,
        refreshToken: refreshSession,
      });

      router.push("/employees");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete employee."
      );
      setDeleting(false);
    }
  }

  const photoUrl = getAssetUrl(employee?.profileImage);
  const initials = employee
    ? `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase() ||
      "E"
    : "E";

  return (
    <AppShell
      title="Employee Details"
      breadcrumb="Management / Employees / Details"
    >
      <div className="page-header-row">
        <div>
          <h1>
            {employee
              ? `${employee.firstName} ${employee.lastName}`
              : "Employee Details"}
          </h1>
          <p>View employee profile information and update details.</p>
        </div>

        <Link href="/employees" className="btn btn-secondary">
          ← Back to Employees
        </Link>
      </div>

      {success && <div className="dashboard-success">{success}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {showDeleteConfirm && isAdmin && employee && (
        <div className="confirm-banner">
          <span>
            Permanently delete{" "}
            <strong>
              {employee.firstName} {employee.lastName}
            </strong>
            ? This also removes their user account.
          </span>
          <div className="table-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowDeleteConfirm(false)}
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

      {loading ? (
        <div className="dashboard-message">Loading employee details...</div>
      ) : !employee ? (
        <section className="panel">
          <div className="empty-state">
            <h4>Employee not found</h4>
            <p>
              The requested employee record could not be loaded or no longer
              exists.
            </p>
          </div>
        </section>
      ) : (
        <div className="detail-grid">
          <aside className="panel profile-card">
            {photoUrl && !imageFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="profile-photo"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="profile-photo">{initials}</div>
            )}

            <h3>
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="profile-role">{employee.designation}</p>

            <div className="detail-list">
              <div className="detail-item">
                <span>EMAIL</span>
                <strong>{employee.user?.email || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>DEPARTMENT</span>
                <strong>{employee.department?.name || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>PHONE</span>
                <strong>{employee.phone || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>ROLE</span>
                <strong>{employee.user?.role || "EMPLOYEE"}</strong>
              </div>
              {employee.createdAt && (
                <div className="detail-item">
                  <span>CREATED</span>
                  <strong>
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="form-actions" style={{ width: "100%" }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: "100%" }}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Employee
                </button>
              </div>
            )}
          </aside>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Edit Employee Information</h3>
                <p>Update employee profile fields and department assignment</p>
              </div>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className="field-input"
                    maxLength={50}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className="field-input"
                    maxLength={50}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    className="field-input"
                    maxLength={20}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="designation">Designation</label>
                  <input
                    id="designation"
                    type="text"
                    className="field-input"
                    maxLength={100}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="departmentId">Department</label>
                  <select
                    id="departmentId"
                    className="field-select"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AppShell>
  );
}
