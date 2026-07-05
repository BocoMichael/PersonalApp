import React, { useState } from "react";
import { FaMoneyBillWave, FaWallet, FaCalendarAlt } from "react-icons/fa";

function AddIncome({ onAddIncome }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !source || !date) {
      alert("Please fill in all fields.");
      return;
    }

    onAddIncome({
      amount,
      source,
      date,
    });

    setAmount("");
    setSource("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Amount & Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
            <FaMoneyBillWave className="text-emerald-500" />
            Amount
          </label>

          <input
            type="number"
            placeholder="₱ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        {/* Source */}
        <div>
          <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
            <FaWallet className="text-amber-500" />
            Source
          </label>

          <input
            type="text"
            placeholder="Salary, Freelance, Business..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

      </div>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
          <FaCalendarAlt className="text-blue-500" />
          Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        + Add Income
      </button>
    </form>
  );
}

export default AddIncome;