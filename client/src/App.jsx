import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddIncomePage from "./pages/AddIncomePage";
import AddExpensePage from "./pages/AddExpensePage";
import SettingsPage from "./pages/SettingsPage";
import "./styles.css";

function App() {
  const navLinks = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/add-income", label: "➕ Add Income" },
    { path: "/add-expense", label: "➖ Add Expense" },
    { path: "/settings", label: "⚙️ Settings" }
  ];

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950">
        {/* Sidebar */}
        <nav className="fixed w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-blue-500/10 shadow-2xl px-6 py-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">
            💰 MyGastos
          </h2>

          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="block px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-blue-500/15 transition-all duration-300 font-medium text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="ml-72 w-[calc(100%-288px)] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-12 min-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add-income" element={<AddIncomePage />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;