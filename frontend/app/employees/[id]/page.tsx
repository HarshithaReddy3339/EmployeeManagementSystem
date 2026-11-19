import { Suspense } from "react";
import EmployeeDetailClient from "./employee-detail-client";

export const instant = false;

export default function EmployeeDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-loading">
          <p>Loading employee details...</p>
        </div>
      }
    >
      <EmployeeDetailClient />
    </Suspense>
  );
}
