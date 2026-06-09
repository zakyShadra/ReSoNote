import "../style/Sidebar.css";

function Sidebar({ isOpen, currentPage, setCurrentPage, closeMenu }) {
  const menus = [
    { id:"dashboard", label:"🏠 Dashboard" },
    { id:"todo",      label:"✅ Todo" },
    { id:"calendar",  label:"📅 Calendar" },
    { id:"reminder",  label:"⏰ Reminder" },
    { id:"notes",     label:"📝 Notes" },
    { id:"expense",   label:"💰 Expense" },
    { id:"budget",    label:"🎯 Budget" },
  ];

  return (
    <div className={isOpen ? "sidebar open" : "sidebar"}>
      <div className="sidebar-header">
        <h2>📒 ReSoNote</h2>
        <button className="close-btn" onClick={closeMenu}>✕</button>
      </div>

      {menus.map((menu) => (
        <button
          key={menu.id}
          className={currentPage === menu.id ? "menu active" : "menu"}
          onClick={() => { setCurrentPage(menu.id); closeMenu(); }}
        >
          {menu.label}
        </button>
      ))}

      <div className="sidebar-divider menu-settings" />

      <button
        className={currentPage === "settings" ? "menu active" : "menu"}
        onClick={() => { setCurrentPage("settings"); closeMenu(); }}
      >
        ⚙️ Pengaturan
      </button>
    </div>
  );
}

export default Sidebar;
