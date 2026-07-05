import { useState, useEffect } from "react";
import api from "../api/axios";

function AddExpensePage() {
  const [formData, setFormData] = useState({
    amount: "",
    category_id: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || !formData.category_id || !formData.date) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/expenses", {
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        description: formData.description,
        date: formData.date,
        user_id: userId
      });

      setSuccess("✓ Expense added successfully!");
      setFormData({
        amount: "",
        category_id: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Add Expense</h1>
        <p className="text-slate-500">Track your spending with categories and detailed notes.</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-emerald-600 font-medium">{success}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit}>
          {/* Amount Field */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="₱0.00"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Category Field */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading categories...</option>
              )}
            </select>
          </div>

          {/* Date Field */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Add notes about this expense..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-24 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {loading ? "Adding Expense..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Categories Display */}
      <div>
        <h3 className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-4">Available Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="card text-center hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer"
            >
              <p className="text-slate-900 font-semibold">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddExpensePage;