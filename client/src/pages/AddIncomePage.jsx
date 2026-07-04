import { useState } from "react";
import axios from "axios";
import AddIncome from "../components/AddIncome";

function AddIncomePage() {
  const [userId] = useState(1);

  const handleAddIncome = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/income", {
        amount: parseFloat(data.amount),
        source: data.source,
        date: data.date,
        user_id: userId
      });

      alert("Income added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add income");
    }
  };

  return (
    <div>
      <div className="page-title">Add Income</div>
      <p className="page-subtitle">Capture your incoming funds with a polished, card-based form.</p>
      <div className="form-card">
        <AddIncome onAddIncome={handleAddIncome} />
      </div>
    </div>
  );
}

export default AddIncomePage;