import { useState, useEffect } from "react";

import Sidebar  from "./components/Sidebar";
import Topbar   from "./components/Topbar";
import ThemeParticles from "./components/particleTheme";

import Dashboard from "./pages/Dashboard";
import Todo      from "./pages/Todo";
import Calendar  from "./pages/Calendar";
import Reminder  from "./pages/Reminder";
import Notes     from "./pages/Notes";
import Expense   from "./pages/Expense";
import Budget    from "./pages/budget";
import Settings  from "./pages/settings";

import "./style/App.css";

const DEFAULT_SETTINGS = { theme:"default", font:"inter", fontSize:"medium" };

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [menuOpen, setMenuOpen]       = useState(false);

  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("resonote-settings")) || DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  // Apply theme + font to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme",    settings.theme    || "default");
    root.setAttribute("data-font",     settings.font     || "inter");
    root.setAttribute("data-fontsize", settings.fontSize || "medium");
  }, [settings]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "todo":      return <Todo />;
      case "calendar":  return <Calendar />;
      case "reminder":  return <Reminder />;
      case "notes":     return <Notes />;
      case "expense":   return <Expense />;
      case "budget":    return <Budget />;
      case "settings":  return <Settings settings={settings} setSettings={setSettings} />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="app-root">
      {/* Animated background orbs */}
      <div className="bg-animation">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Theme-specific particles */}
      <ThemeParticles theme={settings.theme} />

      {/* Sidebar Overlay - close sidebar when clicked */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <Sidebar
        isOpen={menuOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        closeMenu={() => setMenuOpen(false)}
      />

      <div className="app-main">
        <Topbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="content page-enter">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
