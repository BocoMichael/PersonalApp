import { useState, useEffect } from "react";
import api from "../api/axios";
import AddExpense from "../components/AddExpense";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS = [
  "#1e3a8a",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

function ExpensesPage() {
  const [userId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "recurring"

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
    fetchIncome();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load categories.");
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

  const fetchIncome = async () => {
    try {
      const response = await api.get("/income");
      setIncome(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddExpense = async (formData) => {
    setError("");
    setSuccess("");

    try {
      await api.post("/expenses", {
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        description: formData.description,
        date: formData.date,
        user_id: userId,
        is_recurring: formData.is_recurring || false,
        due_day: formData.is_recurring ? parseInt(formData.due_day) : null,
      });

      setSuccess("✓ Expense added successfully!");
      fetchExpenses();
      setTimeout(() => {
        setSuccess("");
        setShowAddModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add expense. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  //Deleting Expense
  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/expenses/${id}`);
      setSuccess("✓ Expense deleted successfully!");
      fetchExpenses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete expense. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  // ---- Pie Chart: Expenses per Category ----
  const buildCategoryData = () => {
    const map = {};

    expenses.forEach((item) => {
      const catId = item.category_id;
      const cat = categories.find((c) => c.id === catId);
      const name = cat ? cat.name : "Uncategorized";

      if (!map[catId]) {
        map[catId] = { name, value: 0 };
      }
      map[catId].value += Number(item.amount || 0);
    });

    return Object.values(map).sort((a, b) => b.value - a.value);
  };

  const categoryData = buildCategoryData();
  const totalExpenses = categoryData.reduce((sum, c) => sum + c.value, 0);

  // ---- Bar Chart: Income vs Expenses per Month ----
  const buildMonthlyComparison = () => {
    const map = {};

    income.forEach((item) => {
      const d = new Date(item.date);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!map[key]) map[key] = { key, label, income: 0, expenses: 0 };
      map[key].income += Number(item.amount || 0);
    });

    expenses.forEach((item) => {
      const d = new Date(item.date);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!map[key]) map[key] = { key, label, income: 0, expenses: 0 };
      map[key].expenses += Number(item.amount || 0);
    });

    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  };

  const monthlyComparison = buildMonthlyComparison();

  // ---- Recurring Expenses ----
  const recurringExpenses = expenses
    .filter((item) => item.is_recurring)
    .sort((a, b) => (a.due_day || 0) - (b.due_day || 0));

  const getDaysUntilDue = (dueDay) => {
    if (!dueDay) return null;
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    let diff = dueDay - currentDay;
    if (diff < 0) diff += daysInMonth; // due day already passed this month, count to next month

    return diff;
  };

  const displayedExpenses =
    activeTab === "recurring" ? recurringExpenses : expenses;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Expenses
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your spending by category and stay on top of regular bills.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
        >
          + Add Expense
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart: Per Category */}
        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
            Expenses by Category
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
            Breakdown of spending across categories
          </p>

          {categoryData.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-12">
              No expense data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₱${Number(value).toFixed(2)} (${((value / totalExpenses) * 100).toFixed(1)}%)`,
                    "Amount",
                  ]}
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart: Income vs Expenses */}
        <div className="card">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
            Income vs Expenses
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
            Monthly comparison to spot overspending
          </p>

          {monthlyComparison.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-12">
              No data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={12}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value) => `₱${Number(value).toFixed(2)}`}
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expenses"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  name="Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 font-semibold text-sm transition-all border-b-2 -mb-px ${
            activeTab === "all"
              ? "border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          All Expenses
        </button>
        <button
          onClick={() => setActiveTab("recurring")}
          className={`px-4 py-2.5 font-semibold text-sm transition-all border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "recurring"
              ? "border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <FaSyncAlt size={12} />
          Recurring
          {recurringExpenses.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {recurringExpenses.length}
            </span>
          )}
        </button>
      </div>

      {/* Expenses List */}
      <div className="mb-8">
        {displayedExpenses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400 dark:text-slate-500">
              {activeTab === "recurring"
                ? "No recurring expenses yet. Mark an expense as recurring when adding it."
                : "No expenses recorded yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedExpenses.map((item) => {
              const cat = categories.find((c) => c.id === item.category_id);
              const daysUntilDue =
                activeTab === "recurring"
                  ? getDaysUntilDue(item.due_day)
                  : null;
              const isUpcoming = daysUntilDue !== null && daysUntilDue <= 5;

              return (
                <div
                  key={item.id}
                  className="card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 font-bold text-sm">
                      {cat ? cat.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold">
                        {cat ? cat.name : "Uncategorized"}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-slate-900 dark:text-white font-bold">
                        ₱{Number(item.amount).toFixed(2)}
                      </p>
                      {activeTab === "recurring" && item.due_day && (
                        <p
                          className={`text-xs font-medium mt-1 ${
                            isUpcoming
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {isUpcoming
                            ? `⚠ Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"} (day ${item.due_day})`
                            : `Due day ${item.due_day} of month`}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      aria-label="Delete expense"
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories Display */}
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest font-semibold mb-4">
          Available Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="card text-center hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer"
            >
              <p className="text-slate-900 dark:text-white font-semibold">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
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

            <h2 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">
              Add Expense
            </h2>

            {success && (
              <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-3">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  {success}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 font-medium text-sm">
                  ⚠️ {error}
                </p>
              </div>
            )}

            <AddExpense
              onAddExpense={handleAddExpense}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;
