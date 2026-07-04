import React, { useState } from "react";

function AddIncome({ onAddIncome }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !source || !date) {
      alert("Please fill in all fields.");
      return;
    }
    onAddIncome({ amount, source, date });
    setAmount("");
    setSource("");
    setDate("");
  };

  return (
    <section className="form-panel">
      <div className="form-group">
        <label className="form-label">Amount</label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Source</label>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
        Add Income
      </button>
    </section>
  );
}

export default AddIncome;
