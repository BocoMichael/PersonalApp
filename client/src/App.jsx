import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import IncomePage from "./pages/IncomePage";
import ExpensesPage from "./pages/ExpensesPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./styles.css";
import { FaBars, FaCircle, FaSignOutAlt } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import fluxLogo from ".images/Flux-dark-theme.png";

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("darkMode") === "true"
  );

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const navLinks = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/income", label: "💵 Income" },
    { path: "/expenses", label: "💳 Expenses" },
    { path: "/settings", label: "⚙️ Settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar - Toggleable */}
      <nav
        className={`fixed w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-blue-500/10 shadow-2xl px-6 py-8 overflow-y-auto transition-all duration-300 z-50 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-72"
        }`}
      >
        <img src={fluxLogo} alt="Flux" className="h-9 mb-8" />

        <ul className="space-y-2 flex-1">
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

        {/* User info + Logout */}
        <div className="border-t border-slate-800 pt-4 mt-4">
          {user && (
            <p className="text-slate-500 text-xs mb-3 px-4 truncate">
              Logged in as <span className="text-slate-300">{user.username}</span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/15 transition-all duration-300 font-medium text-sm"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
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
          sidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        {/* Top Bar with Toggle Button */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 sm:py-6 flex items-center gap-4 z-30">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {sidebarOpen ? <FaCircle size={14} /> : <FaBars size={20} />}
          </button>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Flux</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="ml-auto text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
        {/* Page Content */}
        <div className="p-4 sm:p-8 min-h-screen overflow-y-auto bg-[var(--bg)] dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;