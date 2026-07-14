import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function CategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = newCategory.trim();
    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    const alreadyExists = categories.some(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (alreadyExists) {
      setError("That category already exists.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/categories", { name: trimmedName });
      setNewCategory("");
      setSuccess("✓ Category added!");
      setTimeout(() => setSuccess(""), 3000);
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Any expenses using this category will be moved to "Others".`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(category.id);
    try {
      await api.delete(`/categories/${category.id}`);
      setSuccess(`✓ "${category.name}" deleted.`);
      setTimeout(() => setSuccess(""), 3000);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(
        err.response?.data?.error || "Failed to delete category. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card md:col-span-2">
      <h3 className="font-semibold text-slate-900 dark:text-white">Expense Categories</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-4">
        Manage the categories used when adding expenses. Deleting a category moves its
        existing expenses to "Others".
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

      <form onSubmit={handleAdd} className="flex gap-3 items-end mb-6">
        <div className="flex-1">
          <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">
            New Category Name
          </label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Groceries"
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
        >
          {saving ? "Adding..." : "Add"}
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm">No categories yet. Add one above.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm"
            >
              {category.name}
              {category.name !== "Others" && (
                <button
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.id}
                  aria-label={`Delete ${category.name}`}
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 disabled:text-slate-300 dark:disabled:text-slate-600 font-bold leading-none transition-colors"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryManager;