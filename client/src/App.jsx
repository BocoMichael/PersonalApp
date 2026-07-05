import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddIncomePage from "./pages/AddIncomePage";
import AddExpensePage from "./pages/AddExpensePage";
import SettingsPage from "./pages/SettingsPage";
import "./styles.css";
import { FaBars, FaCircle } from "react-icons/fa";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navLinks = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/add-income", label: "➕ Add Income" },
    { path: "/add-expense", label: "➖ Add Expense" },
    { path: "/settings", label: "⚙️ Settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950">
        {/* Sidebar - Toggleable */}
        <nav
          className={`fixed w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-blue-500/10 shadow-2xl px-6 py-8 overflow-y-auto transition-all duration-300 z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-72"
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">
            💰 MyGastos
          </h2>

          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-blue-500/15 transition-all duration-300 font-medium text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-72" : "ml-0"
          }`}
        >
          {/* Top Bar with Toggle Button */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center gap-4 z-30">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="text-slate-600 hover:text-slate-900"
            >
              {sidebarOpen ? <FaCircle size={14} /> : <FaBars size={20} />}
            </button>

            <h1 className="text-3xl font-bold text-slate-900">MyGastos</h1>
          </div>
          {/* Page Content */}
          <div className="p-8 min-h-screen overflow-y-auto bg-[var(--bg)]">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add-income" element={<AddIncomePage />} />
              <Route path="/add-expense" element={<AddExpensePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
