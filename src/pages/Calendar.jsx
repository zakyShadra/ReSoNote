import { useState, useMemo } from "react";
import { monthNames } from "../utils/dateUtils";
import "../style/calendar.css";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("month"); // "month" | "year"

  const tasks = useMemo(() => JSON.parse(localStorage.getItem("resonote-tasks") || "[]"), []);

  // ── MONTH VIEW ──
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDay = (m, y) => new Date(y, m, 1).getDay();

  const getDaysForMonth = () => {
    const days = [];
    const first = firstDay(month, year);
    const daysCount = daysInMonth(month, year);

    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= daysCount; d++) days.push(d);

    return days;
  };

  const getTasksForDate = (d) => {
    if (!d) return [];
    return tasks.filter((t) => {
      if (!t.deadline) return false;
      const td = new Date(t.deadline);
      return td.getDate() === d && td.getMonth() === month && td.getFullYear() === year;
    });
  };

  const getDaysArray = getDaysForMonth();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else { setMonth(month - 1); }
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else { setMonth(month + 1); }
  };

  const prevYear = () => setYear(year - 1);
  const nextYear = () => setYear(year + 1);

  // ── YEAR VIEW ──
  const monthsData = useMemo(() => {
    return monthNames.map((monthName, m) => {
      const first = firstDay(m, year);
      const count = daysInMonth(m, year);
      const days = [];
      for (let i = 0; i < first; i++) days.push(null);
      for (let d = 1; d <= count; d++) days.push(d);
      return { name: monthName, days, month: m };
    });
  }, [year]);

  return (
    <div className="calendar-page">
      <div className="calendar-header-top">
        <h1>📅 Kalender {year}</h1>
        <button
          className={`view-toggle ${viewMode === "month" ? "active" : ""}`}
          onClick={() => setViewMode("month")}
        >
          📅 Bulan
        </button>
        <button
          className={`view-toggle ${viewMode === "year" ? "active" : ""}`}
          onClick={() => setViewMode("year")}
        >
          📆 Tahun
        </button>
      </div>

      {/* ── MONTH VIEW ── */}
      {viewMode === "month" && (
        <div className="calendar-month-view">
          <div className="calendar-nav">
            <button onClick={prevMonth}>◀</button>
            <h2>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth}>▶</button>
          </div>

          <div className="calendar-grid">
            {DAYS.map((d) => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {getDaysArray.map((day, i) => (
              <div key={i} className={`calendar-cell ${!day ? "empty" : ""}`}>
                {day && <div className="day-number">{day}</div>}
                <div className="tasks-in-day">
                  {day && getTasksForDate(day).map((t) => (
                    <div key={t.id} className="task-dot" style={{ opacity: t.done ? 0.5 : 1 }} title={t.title}>
                      {t.icon}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── YEAR VIEW ── */}
      {viewMode === "year" && (
        <div className="calendar-year-view">
          <div className="calendar-nav">
            <button onClick={prevYear}>◀◀ {year - 1}</button>
            <h2>{year}</h2>
            <button onClick={nextYear}>{year + 1} ▶▶</button>
          </div>

          <div className="months-grid">
            {monthsData.map(({ name, days, month: m }) => (
              <div
                key={m}
                className="month-card"
                onClick={() => { setMonth(m); setViewMode("month"); }}
              >
                <h3>{name}</h3>
                <div className="mini-calendar">
                  {DAYS.map((d) => (
                    <span key={d} className="mini-day-header">{d[0]}</span>
                  ))}
                  {days.map((d, i) => (
                    <span
                      key={i}
                      className={`mini-day ${!d ? "empty" : ""}`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="month-task-count">
                  {tasks.filter((t) => {
                    if (!t.deadline) return false;
                    const td = new Date(t.deadline);
                    return td.getMonth() === m && td.getFullYear() === year;
                  }).length} task
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;