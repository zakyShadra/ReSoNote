import "../style/Topbar.css";

function Topbar({ toggleMenu }) {
    return (
        <div className="topbar">
        <button
            className="hamburger"
            onClick={toggleMenu}
        >
            ☰
        </button>

        <div className="mini-calendar">
            📅 Juni 2026
        </div>
        </div>
    );
    }

export default Topbar;