import { useState, useEffect } from "react";
import api from "../api/axios";
import CategoryManager from "../components/CategoryManager";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
   const { user } = useAuth();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get(`/wallet`);
      setThreshold(response.data.data.low_balance_threshold);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setError("Failed to load current threshold.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!threshold || parseFloat(threshold) < 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setSaving(true);
    try {
      await api.put("/wallet/threshold", {
        low_balance_threshold: parseFloat(threshold)
      });

      setSuccess("✓ Threshold updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating threshold:", err);
      setError("Failed to update threshold. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
      <p className="text-slate-500 dark:text-slate-400">Customize your finance experience here.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Balance Threshold Card */}
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-white">Low Balance Alert</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-4">
            Get warned on your Dashboard when your balance drops below this amount.
          </p>

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
          ) : (
            <form onSubmit={handleSave} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">
                  Threshold Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-white">Profile</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Update your display name, email, and preferences.</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Switch themes and tweak visual settings.</p>
        </div>

         <CategoryManager />
      </div>
    </div>
  );
}

export default SettingsPage;