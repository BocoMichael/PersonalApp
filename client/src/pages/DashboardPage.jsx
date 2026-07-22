import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DashboardPage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [trendView, setTrendView] = useState("daily");

  useEffect(() => {
    fetchIncome();
    fetchExpenses();
    fetchWallet();
    fetchAllocations();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get("/wallet");
      setWallet(response.data.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await api.get("/allocation");
      setAllocations(response.data.data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  const fetchIncome = async () => {
    try {
      const response = await api.get("/income");
      setIncome(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthIncome = income
    .filter((item) => {
      const d = new Date(item.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === thisMonthKey;
    })
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const thisMonthExpenses = expenses
    .filter((item) => {
      const d = new Date(item.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === thisMonthKey;
    })
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const trendViewLabels = {
    daily: "Daily Trend",
    weekly: "Weekly Trend",
    bimonthly: "Bi-Monthly Trend",
    monthly: "Monthly Trend",
  };

  const buildTrendData = (view) => {
    const map = {};

    const getKeyAndLabel = (d) => {
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });

      if (view === "daily") {
        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return { key, label };
      }

      if (view === "weekly") {
        const dayOfWeek = d.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() + diffToMonday);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const key = weekStart.toISOString().split("T")[0];
        const startLabel = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const endLabel = weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const label = `${startLabel} - ${endLabel}`;
        return { key, label };
      }

      if (view === "bimonthly") {
        const day = d.getDate();
        const half = day <= 15 ? 1 : 2;
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${half}`;
        const label = half === 1
          ? `${monthName} 1-15, ${year}`
          : `${monthName} 16-${new Date(year, month + 1, 0).getDate()}, ${year}`;
        return { key, label };
      }

      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      const label = `${monthName} ${year}`;
      return { key, label };
    };

    const addToMap = (items, dataKey) => {
      items.forEach((item) => {
        const d = new Date(item.date);
        if (isNaN(d)) return;

        const { key, label } = getKeyAndLabel(d);

        if (!map[key]) {
          map[key] = { key, label, income: 0, expenses: 0 };
        }
        map[key][dataKey] += Number(item.amount || 0);
      });
    };

    addToMap(income, "income");
    addToMap(expenses, "expenses");

    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  };

  const buildBudgetProgress = () => {
    if (allocations.length === 0 || totalIncome === 0) return [];

    const spentByCategory = {};
    expenses.forEach((item) => {
      const catId = item.category_id;
      if (!spentByCategory[catId]) spentByCategory[catId] = 0;
      spentByCategory[catId] += Number(item.amount || 0);
    });

    return allocations.map((alloc) => {
      const budget = (parseFloat(alloc.percentage) / 100) * totalIncome;
      const spent = spentByCategory[alloc.category_id] || 0;
      const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
      const overBudget = spent > budget;

      return {
        name: alloc.category_name,
        budget,
        spent,
        pct,
        overBudget,
        allocationPct: parseFloat(alloc.percentage),
      };
    });
  };

  const budgetProgress = buildBudgetProgress();
  const trendData = buildTrendData(trendView);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your income, expenses, and financial balance at a glance</p>
      </div>

      {wallet && parseFloat(wallet.current_balance) < parseFloat(wallet.low_balance_threshold) && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-5 flex items-center gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <p className="text-red-600 dark:text-red-400 font-bold">Low Balance Alert</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Your current balance (₱{Number(wallet.current_balance).toFixed(2)}) is below your threshold of ₱{Number(wallet.low_balance_threshold).toFixed(2)}.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-900 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold">Available Balance</p>
            <h3 className="text-white text-4xl font-bold mt-2">₱{Number(balance).toFixed(2)}</h3>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card hover:shadow-md transition-shadow">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">Total Income</p>
          <h3 className="text-blue-900 dark:text-blue-300 text-2xl font-bold mt-2">₱{Number(totalIncome).toFixed(2)}</h3>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">Total Expenses</p>
          <h3 className="text-red-500 dark:text-red-400 text-2xl font-bold mt-2">₱{Number(totalExpenses).toFixed(2)}</h3>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">This Month Net</p>
          <h3 className={`text-2xl font-bold mt-2 ${thisMonthIncome - thisMonthExpenses >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
            ₱{Number(thisMonthIncome - thisMonthExpenses).toFixed(2)}
          </h3>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-semibold">Savings Rate</p>
          <h3 className={`text-2xl font-bold mt-2 ${savingsRate >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
            {savingsRate.toFixed(1)}%
          </h3>
        </div>
      </div>

      {budgetProgress.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Budget vs Actual Spending</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
            How your spending compares to your allocated budget
          </p>

          <div className="space-y-4">
            {budgetProgress.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                    {item.name}
                    <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">
                      ({item.allocationPct}% of income)
                    </span>
                  </span>
                  <span className={`text-sm font-semibold ${item.overBudget ? "text-red-500 dark:text-red-400" : "text-slate-600 dark:text-slate-300"}`}>
                    ₱{item.spent.toFixed(2)} / ₱{item.budget.toFixed(2)}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.overBudget ? "bg-red-500" : item.pct > 80 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(item.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-slate-900 dark:text-white font-semibold text-lg">Income vs Expenses</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm">{trendViewLabels[trendView]}</p>
          </div>

          <select
            value={trendView}
            onChange={(e) => setTrendView(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bimonthly">Bi-Monthly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {trendData.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-center py-12">No data yet to show a trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                interval="preserveStartEnd"
              />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                formatter={(value) => `₱${Number(value).toFixed(2)}`}
                contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#1e3a8a" strokeWidth={2.5} name="Income" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} name="Expenses" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">💵 Recent Income</h2>

          {income.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-8">No income records yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {income.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold">{item.source || "Unnamed Source"}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <p className="text-emerald-500 dark:text-emerald-400 font-bold text-lg">
                    +₱{Number(item.amount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">💳 Recent Expenses</h2>

          {expenses.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-8">No expenses recorded yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {expenses.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold">{item.category_name || "Uncategorized"}</p>
                    {item.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{item.description}</p>
                    )}
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <p className="text-red-500 dark:text-red-400 font-bold text-lg">
                    −₱{Number(item.amount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
