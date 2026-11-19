"use client";

import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../../components/app-shell";
import { useAuth } from "../../components/auth-provider";
import { apiRequest, getAssetUrl, type Employee } from "../../lib/api";

export default function ProfilePage() {
  const { accessToken, refreshSession } = useAuth();

  const [profile, setProfile] = useState<Employee | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest<Employee>("/employees/me", {
          token: accessToken,
          refreshToken: refreshSession,
        });

        if (cancelled) return;

        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your employee profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshSession]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await apiRequest<{ message?: string; employee: Employee }>(
        "/employees/me",
        {
          method: "PATCH",
          token: accessToken,
          refreshToken: refreshSession,
          body: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
          },
        }
      );

      if (res.employee) {
        setProfile(res.employee);
        setFirstName(res.employee.firstName || "");
        setLastName(res.employee.lastName || "");
        setPhone(res.employee.phone || "");
      }

      setSuccess(res.message || "Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const photoUrl = getAssetUrl(profile?.profileImage);
  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() ||
      "E"
    : "E";

  return (
    <AppShell title="My Profile" breadcrumb="Employee / My Profile">
      <div className="page-header-row">
        <div>
          <h1>My Profile</h1>
          <p>View your employee record and update your personal contact details.</p>
        </div>
      </div>

      {success && <div className="dashboard-success">{success}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="dashboard-message">Loading your profile...</div>
      ) : !profile ? (
        <section className="panel">
          <div className="empty-state">
            <h4>Profile unavailable</h4>
            <p>
              Your employee profile could not be loaded. Please contact your
              administrator.
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
                alt={`${profile.firstName} ${profile.lastName}`}
                className="profile-photo"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="profile-photo">{initials}</div>
            )}

            <h3>
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="profile-role">{profile.designation}</p>

            <div className="detail-list">
              <div className="detail-item">
                <span>EMAIL</span>
                <strong>{profile.user?.email || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>DEPARTMENT</span>
                <strong>{profile.department?.name || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>DESIGNATION</span>
                <strong>{profile.designation || "—"}</strong>
              </div>
              <div className="detail-item">
                <span>PHONE</span>
                <strong>{profile.phone || "—"}</strong>
              </div>
            </div>
          </aside>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Update Personal Details</h3>
                <p>
                  You can update your name and phone number. Department and
                  designation are managed by HR.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="myFirstName">First Name</label>
                  <input
                    id="myFirstName"
                    type="text"
                    className="field-input"
                    maxLength={50}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="myLastName">Last Name</label>
                  <input
                    id="myLastName"
                    type="text"
                    className="field-input"
                    maxLength={50}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="myPhone">Phone Number</label>
                  <input
                    id="myPhone"
                    type="text"
                    className="field-input"
                    maxLength={20}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AppShell>
  );
}