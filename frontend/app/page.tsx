"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "../components/app-shell";
import { useAuth } from "../components/auth-provider";
import {
  apiRequest,
  type DashboardStats,
  type HrManager,
} from "../lib/api";

export default function Home() {
  const { user, accessToken, refreshSession } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hrManagerCount, setHrManagerCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const dashboardData = await apiRequest<DashboardStats>(
          "/dashboard/stats",
          {
            token: accessToken,
            refreshToken: refreshSession,
          }
        );

        if (cancelled) return;
        setStats(dashboardData);

        // Only Admin can access HR Manager management.
        if (user?.role === "ADMIN") {
          const hrData = await apiRequest<HrManager[]>("/users/hr-managers", {
            token: accessToken,
            refreshToken: refreshSession,
          });

          if (!cancelled) {
            setHrManagerCount(Array.isArray(hrData) ? hrData.length : 0);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [accessToken, user?.role, refreshSession]);

  const displayName =
    user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "HR_MANAGER"
        ? "HR Manager"
        : "Employee";

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees ?? 0,
      icon: "♙",
      color: "blue",
      change: "Registered employees",
    },
    {
      title: "Departments",
      value: stats?.totalDepartments ?? 0,
      icon: "▦",
      color: "purple",
      change: "Organization units",
    },
    {
      title: "HR Managers",
      value: hrManagerCount ?? "—",
      icon: "♧",
      color: "orange",
      change:
        user?.role === "ADMIN"
          ? "HR management accounts"
          : "Admin access required",
    },
    {
      title: "Active Status",
      value: "Active",
      icon: "✓",
      color: "green",
      change: "System status",
    },
  ];

  const maxDepartmentCount = Math.max(
    1,
    ...(stats?.employeesByDepartment.map((item) => item.count) ?? [])
  );

  return (
    <AppShell title="Dashboard" breadcrumb="Management / Dashboard">
      {/* Welcome section */}
      <section className="welcome-section">
        <div>
          <h1>Welcome back, {displayName} 👋</h1>
          <p>Here is an overview of your employee management system.</p>
        </div>

        <div className="welcome-date">Management Overview</div>
      </section>

      {/* Loading and error messages */}
      {loading && (
        <div className="dashboard-message">
          Loading dashboard information...
        </div>
      )}

      {error && <div className="dashboard-error">{error}</div>}

      {/* Statistics */}
      <section className="stats-grid">
        {statCards.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-top">
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              <span className="stat-label">{stat.title}</span>
            </div>

            <h2>{loading ? "..." : stat.value}</h2>
            <p>{stat.change}</p>
          </div>
        ))}
      </section>

      {/* Dashboard main area */}
      <section className="dashboard-grid">
        <div className="panel department-panel">
          <div className="panel-header">
            <div>
              <h3>Department Overview</h3>
              <p>Employees distributed across departments</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading department information...</p>
            </div>
          ) : stats?.employeesByDepartment.length ? (
            <div className="department-list">
              {stats.employeesByDepartment.map((item) => (
                <div className="department-item" key={item.department}>
                  <div className="department-item-info">
                    <strong>{item.department}</strong>
                    <span>
                      {item.count}{" "}
                      {item.count === 1 ? "employee" : "employees"}
                    </span>
                  </div>

                  <div className="department-bar">
                    <div
                      className="department-bar-fill"
                      style={{
                        width: `${(item.count / maxDepartmentCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h4>No department data yet</h4>
              <p>
                Department statistics will appear here once employees are
                assigned to departments.
              </p>
            </div>
          )}
        </div>

        <div className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Overview</h3>
              <p>System information</p>
            </div>
          </div>

          <div className="overview-list">
            <Link href="/employees" className="overview-item overview-link">
              <span className="overview-icon blue">♙</span>
              <div>
                <strong>Employee Management</strong>
                <p>Manage employee records</p>
              </div>
            </Link>

            <Link href="/departments" className="overview-item overview-link">
              <span className="overview-icon purple">▦</span>
              <div>
                <strong>Departments</strong>
                <p>Organize your company structure</p>
              </div>
            </Link>

            {user?.role === "ADMIN" && (
              <Link href="/hr-managers" className="overview-item overview-link">
                <span className="overview-icon orange">♧</span>
                <div>
                  <strong>HR Managers</strong>
                  <p>Manage HR administration</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Recent employees */}
      <section className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Employees</h3>
            <p>Recently added employees</p>
          </div>

          <Link href="/employees" className="view-button">
            View All →
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DESIGNATION</th>
                <th>DEPARTMENT</th>
                <th>EMAIL</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="table-empty">Loading employees...</div>
                  </td>
                </tr>
              ) : stats?.recentEmployees.length ? (
                stats.recentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <Link
                        href={`/employees/${employee.id}`}
                        className="table-link"
                      >
                        {employee.firstName} {employee.lastName}
                      </Link>
                    </td>
                    <td>{employee.designation}</td>
                    <td>{employee.department.name}</td>
                    <td>{employee.user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="table-empty">
                      No employees have been added yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
