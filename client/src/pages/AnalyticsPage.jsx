import React from "react";

function AnalyticsPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Analytics</h1>

      <p className="text-[var(--muted)] mb-6">Initial analytics placeholders — charts and insights will be added here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card h-56 flex items-center justify-center text-[var(--muted)]">Spending Trend (Placeholder)</div>
        <div className="card h-56 flex items-center justify-center text-[var(--muted)]">Category Breakdown (Placeholder)</div>
        <div className="card h-40 flex items-center justify-center text-[var(--muted)]">Top Transactions (Placeholder)</div>
        <div className="card h-40 flex items-center justify-center text-[var(--muted)]">Budget Insights (Placeholder)</div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
