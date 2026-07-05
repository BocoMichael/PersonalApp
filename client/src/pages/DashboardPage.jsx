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

  useEffect(() => {
    fetchIncome();
    fetchExpenses();
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get("/wallet?user_id=1");
      setWallet(response.data.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
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

  const buildTrendData = () => {
    const periodMap = {};

    const addToMap = (items, key) => {
      items.forEach((item) => {
        const d = new Date(item.date);
        if (isNaN(d)) return;

        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const half = day <= 15 ? 1 : 2;

        const periodKey = `${year}-${String(month + 1).padStart(2, "0")}-${half}`;

        const monthName = d.toLocaleDateString("en-US", { month: "short" });
        const label = half === 1
          ? `${monthName} 1-15, ${year}`
          : `${monthName} 16-${new Date(year, month + 1, 0).getDate()}, ${year}`;

        if (!periodMap[periodKey]) {
          periodMap[periodKey] = {
            periodKey,
            label,
            income: 0,
            expenses: 0,
          };
        }
        periodMap[periodKey][key] += Number(item.amount || 0);
      });
    };

    addToMap(income, "income");
    addToMap(expenses, "expenses");

    return Object.values(periodMap).sort((a, b) => a.periodKey.localeCompare(b.periodKey));
  };

  const trendData = buildTrendData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500">Track your income, expenses, and financial balance at a glance</p>
      </div>

      {wallet && parseFloat(wallet.current_balance) < parseFloat(wallet.low_balance_threshold) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <p className="text-red-600 font-bold">Low Balance Alert</p>
            <p className="text-slate-600 text-sm">
              Your current balance (₱{Number(wallet.current_balance).toFixed(2)}) is below your threshold of ₱{Number(wallet.low_balance_threshold).toFixed(2)}.
            </p>
          </div>
        </div>
      )}

     {/* Available Balance - Highlighted Card */}
      <div className="bg-blue-900 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold">Available Balance</p>
            <h3 className="text-white text-4xl font-bold mt-2">₱{Number(balance).toFixed(2)}</h3>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Total Income & Total Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Income</p>
              <h3 className="text-blue-900 text-3xl font-bold mt-2">₱{Number(totalIncome).toFixed(2)}</h3>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Expenses</p>
              <h3 className="text-red-500 text-3xl font-bold mt-2">₱{Number(totalExpenses).toFixed(2)}</h3>
            </div>
            <div className="text-3xl">💸</div>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-slate-900 font-semibold text-lg">Income vs Expenses Trend</h2>
            <p className="text-slate-400 text-sm">Monthly comparison</p>
          </div>
        </div>

        {trendData.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No data yet to show a trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
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

      {/* Income & Expenses - Side by Side Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Income List */}
        <div className="card">
          <h2 className="text-slate-900 font-semibold text-lg mb-4">💵 Recent Income</h2>

          {income.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No income records yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {income.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900 font-semibold">{item.source || "Unnamed Source"}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <p className="text-emerald-500 font-bold text-lg">
                    +₱{Number(item.amount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Expenses List */}
        <div className="card">
          <h2 className="text-slate-900 font-semibold text-lg mb-4">💳 Recent Expenses</h2>

          {expenses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No expenses recorded yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {expenses.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900 font-semibold">{item.category_name || "Uncategorized"}</p>
                    {item.description && (
                      <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                    )}
                    <p className="text-slate-400 text-xs mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <p className="text-red-500 font-bold text-lg">
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