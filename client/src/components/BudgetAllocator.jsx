import { useState, useEffect } from "react";
import api from "../api/axios";

function BudgetAllocator() {
  const [categories, setCategories] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, allocRes] = await Promise.all([
        api.get("/categories"),
        api.get("/allocation"),
      ]);

      setCategories(catRes.data.data);

      const map = {};
      allocRes.data.data.forEach((item) => {
        map[item.category_id] = parseFloat(item.percentage);
      });
      setAllocations(map);
    } catch (err) {
      console.error("Error loading budget data:", err);
      setError("Failed to load budget allocations.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (categoryId, value) => {
    setAllocations((prev) => ({
      ...prev,
      [categoryId]: value === "" ? "" : parseFloat(value),
    }));
  };

  const totalPercentage = Object.values(allocations).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError(`Allocations must sum to 100%. Current total: ${totalPercentage.toFixed(1)}%`);
      return;
    }

    const payload = categories
      .filter((cat) => allocations[cat.id] && parseFloat(allocations[cat.id]) > 0)
      .map((cat) => ({
        category_id: cat.id,
        percentage: parseFloat(allocations[cat.id]),
      }));

    if (payload.length === 0) {
      setError("Assign at least one category a percentage.");
      return;
    }

    setSaving(true);
    try {
      await api.put("/allocation", { allocations: payload });
      setSuccess("✓ Budget allocations saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving allocations:", err);
      setError(err.response?.data?.error || "Failed to save allocations.");
    } finally {
      setSaving(false);
    }
  };

  const distributeEvenly = () => {
    if (categories.length === 0) return;
    const even = Math.floor((100 / categories.length) * 100) / 100;
    const map = {};
    categories.forEach((cat, i) => {
      map[cat.id] = i === 0
        ? parseFloat((100 - even * (categories.length - 1)).toFixed(2))
        : even;
    });
    setAllocations(map);
  };

  return (
    <div className="card md:col-span-2">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Budget Allocation</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Split your income across categories. Percentages must total 100%.
          </p>
        </div>
        <button
          type="button"
          onClick={distributeEvenly}
          className="shrink-0 text-sm text-blue-900 dark:text-blue-400 hover:underline font-medium"
        >
          Split evenly
        </button>
      </div>

      {success && (
        <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-3">
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          Add expense categories first, then set your budget split here.
        </p>
      ) : (
        <form onSubmit={handleSave}>
          <div className="space-y-3 mb-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4">
                <label className="flex-1 text-slate-700 dark:text-slate-200 text-sm font-medium">
                  {cat.name}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={allocations[cat.id] ?? ""}
                    onChange={(e) => handleChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-24 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-slate-400 text-sm w-4">%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <p
              className={`text-sm font-semibold ${
                Math.abs(totalPercentage - 100) < 0.01
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              Total: {totalPercentage.toFixed(1)}%
            </p>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {saving ? "Saving..." : "Save Allocations"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default BudgetAllocator;
