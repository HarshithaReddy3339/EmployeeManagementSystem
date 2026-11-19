"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import AppShell from "../../../components/app-shell";
import { useAuth } from "../../../components/auth-provider";
import { apiRequest, type Department, type Employee } from "../../../lib/api";

export default function AddEmployeePage() {
  const router = useRouter();
  const { accessToken, refreshSession } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadDepartments() {
      try {
        setLoadingDepartments(true);
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
            err instanceof Error
              ? err.message
              : "Unable to load departments."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDepartments(false);
        }
      }
    }

    loadDepartments();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshSession]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (file && !file.type.startsWith("image/")) {
      setError("Only image files are allowed for the profile photo.");
      setProfileImage(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("Profile image must be 5MB or smaller.");
      setProfileImage(null);
      return;
    }

    setError("");
    setProfileImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    if (!profileImage) {
      setError("Profile image is required.");
      return;
    }

    if (!departmentId) {
      setError("Please select a department.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("phone", phone.trim());
      formData.append("designation", designation.trim());
      formData.append("departmentId", departmentId);
      formData.append("profileImage", profileImage);

      const created = await apiRequest<Employee>("/employees", {
        method: "POST",
        token: accessToken,
        body: formData,
        isFormData: true,
        refreshToken: refreshSession,
      });

      router.push(created?.id ? `/employees/${created.id}` : "/employees");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create employee."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      title="Add Employee"
      breadcrumb="Management / Employees / Add Employee"
    >
      <div className="page-header-row">
        <div>
          <h1>Add New Employee</h1>
          <p>Create an employee account and assign them to a department.</p>
        </div>

        <Link href="/employees" className="btn btn-secondary">
          ← Back to Employees
        </Link>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="panel">
        <form onSubmit={handleSubmit}>
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
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Temporary Password</label>
              <input
                id="password"
                type="password"
                className="field-input"
                minLength={8}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="form-field">
              <label htmlFor="departmentId">Department</label>
              <select
                id="departmentId"
                className="field-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={loadingDepartments}
                required
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..."
                    : "Select a department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {!loadingDepartments && departments.length === 0 && (
                <span className="field-hint">
                  No departments available.{" "}
                  <Link href="/departments" className="table-link">
                    Create a department first
                  </Link>
                  .
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="profileImage">Profile Image</label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="field-input file-input"
                onChange={handleFileChange}
                required
              />
              <span className="field-hint">
                Required. Image file up to 5MB.
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || loadingDepartments}
            >
              {submitting ? "Creating Employee..." : "Create Employee"}
            </button>
            <Link href="/employees" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
