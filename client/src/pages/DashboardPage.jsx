import { useState, useEffect } from "react";
import axios from "axios";

function DashboardPage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchIncome();
    fetchExpenses();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/income`);
      setIncome(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/expenses`);
      setExpenses(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Track your income, expenses, and financial balance at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Total Income</p>
              <h3 className="text-green-400 text-3xl font-bold mt-2">₱{Number(totalIncome).toFixed(2)}</h3>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Total Expenses</p>
              <h3 className="text-red-400 text-3xl font-bold mt-2">₱{Number(totalExpenses).toFixed(2)}</h3>
            </div>
            <div className="text-4xl">💸</div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Available Balance</p>
              <h3 className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                ₱{Number(balance).toFixed(2)}
              </h3>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Income Section */}
      <div className="mb-12">
        <h2 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-6">💵 Recent Income</h2>

        {income.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
            <p className="text-slate-400">📊 No income records yet.</p>
            <p className="text-blue-400 font-semibold">Start by adding your first income!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {income.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-green-400 border border-slate-700 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest">Amount</p>
                    <h3 className="text-green-400 text-2xl font-bold mt-1">₱{Number(item.amount).toFixed(2)}</h3>
                  </div>
                  <div className="bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
                    <p className="text-green-400 font-bold text-lg">+</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-700 pt-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Source</p>
                    <p className="text-white font-semibold">{item.source || "Unnamed Source"}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Date</p>
                    <p className="text-blue-400 text-sm">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <h2 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-6">💳 Recent Expenses</h2>

        {expenses.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
            <p className="text-slate-400">📊 No expenses recorded yet.</p>
            <p className="text-blue-400 font-semibold">Start by adding your first expense!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expenses.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-red-400 border border-slate-700 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest">Amount</p>
                    <h3 className="text-red-400 text-2xl font-bold mt-1">₱{Number(item.amount).toFixed(2)}</h3>
                  </div>
                  <div className="bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/30">
                    <p className="text-red-400 font-bold text-lg">−</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-700 pt-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Category</p>
                    <span className="inline-block bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30">
                      <p className="text-blue-400 text-sm font-semibold">{item.category || "Uncategorized"}</p>
                    </span>
                  </div>

                  {item.description && (
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-white text-sm">{item.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Date</p>
                    <p className="text-blue-400 text-sm">
                      {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;