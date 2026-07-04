import { useState, useEffect } from "react";
import axios from "axios";

function AddExpensePage() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: ""
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
      const response = await axios.get("http://localhost:5000/api/categories");
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

    if (!formData.amount || !formData.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/expenses", {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        user_id: userId
      });

      setSuccess("✓ Expense added successfully!");
      setFormData({ amount: "", category: "", description: "" });
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
      <div className="page-header">
        <h1 className="page-title">Add Expense</h1>
        <p className="page-subtitle">Track your spending with categories</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="₱0.00"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading categories...</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Add notes about this expense..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding Expense..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="categories-section">
        <div className="section-caption">Available Categories</div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddExpensePage;