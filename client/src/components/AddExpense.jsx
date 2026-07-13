import { useState } from "react";
import { FaMoneyBillWave, FaTag, FaCalendarAlt, FaStickyNote, FaSyncAlt } from "react-icons/fa";

function AddExpense({ onAddExpense, categories = [] }) {
  const [formData, setFormData] = useState({
    amount: "",
    category_id: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    is_recurring: false,
    due_day: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category_id || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.is_recurring && !formData.due_day) {
      alert("Please specify the due day of the month for this recurring expense.");
      return;
    }

    onAddExpense(formData);

    setFormData({
      amount: "",
      category_id: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      is_recurring: false,
      due_day: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-2 font-medium">
            <FaMoneyBillWave className="text-red-500" />
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            placeholder="₱ 0.00"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-2 font-medium">
            <FaTag className="text-amber-500" />
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition cursor-pointer"
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
      </div>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-2 font-medium">
          <FaCalendarAlt className="text-blue-500" />
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
      </div>

      {/* Recurring Checkbox */}
      <div className="rounded-xl border border-slate-300 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-800/50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_recurring"
            checked={formData.is_recurring}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-blue-900 cursor-pointer"
          />
          <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <FaSyncAlt className="text-blue-500" />
            This is a recurring expense
          </span>
        </label>

        {formData.is_recurring && (
          <div className="mt-4">
            <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-2 font-medium text-sm">
              Due day of month <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="due_day"
              placeholder="e.g. 15"
              min="1"
              max="31"
              value={formData.due_day}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              This expense will repeat monthly on this day.
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-2 font-medium">
          <FaStickyNote className="text-slate-400" />
          Description (Optional)
        </label>
        <textarea
          name="description"
          placeholder="Add notes about this expense..."
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition min-h-24 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        + Add Expense
      </button>
    </form>
  );
}

export default AddExpense;