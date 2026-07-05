import { useState } from "react";
import api from "../api/axios";
import AddIncome from "../components/AddIncome";

function AddIncomePage() {
  const [userId] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleAddIncome = async (data) => {
    setError("");
    setSuccess("");

    try {
      await api.post("/income", {
        amount: parseFloat(data.amount),
        source: data.source,
        date: data.date,
        user_id: userId
      });

      setSuccess("✓ Income added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add income. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Add Income</h1>
        <p className="text-slate-500">Capture your incoming funds with a polished, card-based form.</p>
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
      <div className="card">
        <AddIncome onAddIncome={handleAddIncome} />
      </div>
    </div>
  );
}

export default AddIncomePage;