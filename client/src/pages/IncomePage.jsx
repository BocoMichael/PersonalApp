import { useState, useEffect } from "react";
import api from "../api/axios";
import AddIncome from "../components/AddIncome";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "../context/AuthContext";


function IncomePage() {
  const { userId } = useAuth();
  const [income, setIncome] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await api.get("/income");
      setIncome(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddIncome = async (data) => {
    setError("");
    setSuccess("");

    try {
      await api.post("/income", {
        amount: parseFloat(data.amount),
        source: data.source,
        date: data.date,
      });

      setSuccess("✓ Income added successfully!");
      fetchIncome();
      setTimeout(() => {
        setSuccess("");
        setShowAddModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add income. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  // Group income entries by month for both the frequency and growth charts
  const buildMonthlyData = () => {
    const map = {};

    income.forEach((item) => {
      const d = new Date(item.date);
      if (isNaN(d)) return;

      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      if (!map[key]) {
        map[key] = { key, label, count: 0, total: 0 };
      }
      map[key].count += 1;
      map[key].total += Number(item.amount || 0);
    });

    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  };

  const monthlyData = buildMonthlyData();

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalEntries = income.length;
  const averagePerEntry = totalEntries > 0 ? totalIncome / totalEntries : 0;

  const latestMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const growthPercent =
    previousMonth && previousMonth.total > 0 && latestMonth
      ? ((latestMonth.total - previousMonth.total) / previousMonth.total) * 100
      : null;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Income</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your income sources, frequency, and growth over time.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
        >
          + Add Income
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">
            Total Entries
          </p>
          <h3 className="text-slate-900 dark:text-white text-2xl font-bold mt-2">{totalEntries}</h3>
        </div>

        <div className="card">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">
            Average per Entry
          </p>
          <h3 className="text-slate-900 dark:text-white text-2xl font-bold mt-2">
            ₱{averagePerEntry.toFixed(2)}
          </h3>
        </div>

        <div className="card">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">
            This Month
          </p>
          <h3 className="text-blue-900 dark:text-blue-300 text-2xl font-bold mt-2">
            ₱{(latestMonth?.total || 0).toFixed(2)}
          </h3>
        </div>

        <div className="card">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">
            vs Last Month
          </p>
          {growthPercent === null ? (
            <h3 className="text-slate-400 dark:text-slate-500 text-2xl font-bold mt-2">—</h3>
          ) : (
            <h3
              className={`text-2xl font-bold mt-2 ${
                growthPercent >= 0
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {growthPercent >= 0 ? "▲" : "▼"} {Math.abs(growthPercent).toFixed(1)}%
            </h3>
          )}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Frequency Chart */}
        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Income Frequency</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
            Number of income entries per month
          </p>

          {monthlyData.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-12">
              No income data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} entries`, "Frequency"]}
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} name="Entries" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Growth Trend Chart */}
        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Income Growth Trend</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
            Total income per month over time
          </p>

          {monthlyData.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-12">
              No income data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value) => `₱${Number(value).toFixed(2)}`}
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  name="Total Income"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl leading-none"
            >
              ✕
            </button>

            <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">Add Income</h2>

            {success && (
              <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-3">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 font-medium text-sm">⚠️ {error}</p>
              </div>
            )}

            <AddIncome onAddIncome={handleAddIncome} />
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomePage;