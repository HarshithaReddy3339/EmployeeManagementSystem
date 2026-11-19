
"use client";

import { useEffect, useState } from "react";
import LogoutButton from "../components/logout-button";
import { useAuth } from "../components/auth-provider";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DashboardStats = {
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
};

const navigation = [
  { icon: "▦", label: "Dashboard", active: true },
  { icon: "♙", label: "Employees", active: false },
  { icon: "▤", label: "Departments", active: false },
  { icon: "♧", label: "HR Managers", active: false },
];

export default function Home() {
  const { user, accessToken } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hrManagerCount, setHrManagerCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const dashboardResponse = await fetch(
          `${API_URL}/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!dashboardResponse.ok) {
          throw new Error("Unable to load dashboard statistics.");
        }

        const dashboardData: DashboardStats =
          await dashboardResponse.json();

        setStats(dashboardData);

        // Only Admin can access HR Manager management.
        if (user?.role === "ADMIN") {
          const hrResponse = await fetch(
            `${API_URL}/users/hr-managers`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!hrResponse.ok) {
            throw new Error("Unable to load HR Manager statistics.");
          }

          const hrData = await hrResponse.json();
          setHrManagerCount(Array.isArray(hrData) ? hrData.length : 0);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [accessToken, user?.role]);

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "U";

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
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>EmployEase</h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="nav-section-title">MENU</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.active ? "/" : "#"}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>
            <div>
              <strong>Need help?</strong>
              <p>Contact your administrator</p>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="avatar">{firstLetter}</div>
            <div className="user-info">
              <strong>{user?.email || "User"}</strong>
              <span>{user?.role?.replace("_", " ") || "Account"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="breadcrumb">Management / Dashboard</p>
            <h2>Dashboard</h2>
          </div>

          <div className="header-right">
            <LogoutButton />

            <div className="status-indicator">
              <span className="status-dot"></span>
              System Online
            </div>

            <div className="header-avatar">{firstLetter}</div>
          </div>
        </header>

        <div className="page-content">
          {/* Welcome section */}
          <section className="welcome-section">
            <div>
              <h1>Welcome back, {displayName} 👋</h1>
              <p>
                Here is an overview of your employee management system.
              </p>
            </div>

            <div className="welcome-date">Management Overview</div>
          </section>

          {/* Loading and error messages */}
          {loading && (
            <div className="dashboard-message">
              Loading dashboard information...
            </div>
          )}

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {/* Statistics */}
          <section className="stats-grid">
            {statCards.map((stat) => (
              <div className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <div className={`stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>
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
                          {item.count} {item.count === 1 ? "employee" : "employees"}
                        </span>
                      </div>

                      <div className="department-bar">
                        <div
                          className="department-bar-fill"
                          style={{
                            width: `${
                              (item.count / maxDepartmentCount) * 100
                            }%`,
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
                    Department statistics will appear here once employees
                    are assigned to departments.
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
                <div className="overview-item">
                  <span className="overview-icon blue">♙</span>
                  <div>
                    <strong>Employee Management</strong>
                    <p>Manage employee records</p>
                  </div>
                </div>

                <div className="overview-item">
                  <span className="overview-icon purple">▦</span>
                  <div>
                    <strong>Departments</strong>
                    <p>Organize your company structure</p>
                  </div>
                </div>

                <div className="overview-item">
                  <span className="overview-icon orange">♧</span>
                  <div>
                    <strong>HR Managers</strong>
                    <p>Manage HR administration</p>
                  </div>
                </div>
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

              <button className="view-button" type="button">
                View All →
              </button>
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
                        <div className="table-empty">
                          Loading employees...
                        </div>
                      </td>
                    </tr>
                  ) : stats?.recentEmployees.length ? (
                    stats.recentEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          {employee.firstName} {employee.lastName}
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
        </div>
      </main>
    </div>
  );
}
