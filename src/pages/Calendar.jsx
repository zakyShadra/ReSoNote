import { useState, useEffect, useMemo } from "react";
import { monthNames } from "../utils/dateUtils";
import "../style/calendar.css";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const GLOBAL_COUNTRIES = [
  { code: "US", label: "Global - Amerika" },
  { code: "GB", label: "Global - Inggris" },
  { code: "SG", label: "Global - Singapura" },
  { code: "JP", label: "Global - Jepang" },
  { code: "SA", label: "Global - Saudi" },
];
const CUSTOM_COLORS = [
  { label: "Merah", value: "#fee2e2" },
  { label: "Pink", value: "#fce7f3" },
  { label: "Kuning", value: "#fef3c7" },
  { label: "Hijau", value: "#dcfce7" },
  { label: "Biru", value: "#dbeafe" },
  { label: "Ungu", value: "#ede9fe" },
];

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const fixedGlobalHolidays = (year) => [
  { date: `${year}-01-01`, localName: "Tahun Baru", name: "New Year's Day", source: "Global" },
  { date: `${year}-05-01`, localName: "Hari Buruh", name: "International Workers' Day", source: "Global" },
  { date: `${year}-12-25`, localName: "Natal", name: "Christmas Day", source: "Global" },
];

function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("month");
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [holidayStatus, setHolidayStatus] = useState("");
  const [globalCountry, setGlobalCountry] = useState("US");
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [customDates, setCustomDates] = useState(() => {
    const saved = localStorage.getItem("resonote-calendar-custom-dates");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const loadCalendarData = () => {
      setTasks(JSON.parse(localStorage.getItem("resonote-tasks") || "[]"));
      setNotes(JSON.parse(localStorage.getItem("resonote-notes") || "[]"));
    };

    loadCalendarData();
    window.addEventListener("storage", loadCalendarData);
    window.addEventListener("focus", loadCalendarData);
    return () => {
      window.removeEventListener("storage", loadCalendarData);
      window.removeEventListener("focus", loadCalendarData);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("resonote-calendar-custom-dates", JSON.stringify(customDates));
  }, [customDates]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountryHolidays = async (countryCode, source) => {
      const res = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error(`Holiday API ${countryCode} failed`);
      const data = await res.json();
      return data.map((holiday) => ({ ...holiday, source }));
    };

    const loadHolidays = async () => {
      setHolidayStatus("Memuat hari libur...");
      const results = await Promise.allSettled([
        fetchCountryHolidays("ID", "Indonesia"),
        fetchCountryHolidays(globalCountry, "Global"),
      ]);

      const loaded = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value);
      const merged = [...loaded, ...fixedGlobalHolidays(year)];
      const unique = Array.from(
        new Map(merged.map((holiday) => [`${holiday.date}-${holiday.name}-${holiday.source}`, holiday])).values()
      );

      setHolidays(unique);
      setHolidayStatus(results.some((result) => result.status === "rejected")
        ? "Sebagian data libur memakai fallback."
        : "");
    };

    loadHolidays().catch((err) => {
      if (err.name === "AbortError") return;
      setHolidays(fixedGlobalHolidays(year));
      setHolidayStatus("Data libur online gagal dimuat, fallback aktif.");
    });

    return () => controller.abort();
  }, [year, globalCountry]);

  const holidaysByDate = useMemo(() => {
    const map = {};
    holidays.forEach((holiday) => {
      map[holiday.date] = [...(map[holiday.date] || []), holiday];
    });
    return map;
  }, [holidays]);

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

  const isSameCalendarDate = (value, d, m = month, y = year) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return date.getDate() === d && date.getMonth() === m && date.getFullYear() === y;
  };

  const getItemsForDate = (d) => {
    if (!d) return [];
    const dayTasks = tasks
      .filter((t) => isSameCalendarDate(t.deadline, d))
      .map((task) => ({ ...task, type: "task", label: task.title, marker: task.icon || "✓" }));
    const dayNotes = notes
      .filter((note) => isSameCalendarDate(note.date || note.deadline || note.updatedAt || note.createdAt, d))
      .map((note) => ({ ...note, type: "note", label: note.title || note.content || "Catatan", marker: "N" }));

    return [...dayTasks, ...dayNotes];
  };

  const getDateMeta = (d, m = month) => {
    const dateKey = formatDateKey(year, m, d);
    const weekday = new Date(year, m, d).getDay();
    return {
      dateKey,
      custom: customDates[dateKey],
      holidayList: holidaysByDate[dateKey] || [],
      isSunday: weekday === 0,
    };
  };

  const getMonthItemCount = (m) =>
    tasks.filter((t) => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline);
      return !Number.isNaN(d.getTime()) && d.getMonth() === m && d.getFullYear() === year;
    }).length +
    notes.filter((n) => {
      const value = n.date || n.deadline || n.updatedAt || n.createdAt;
      if (!value) return false;
      const d = new Date(value);
      return !Number.isNaN(d.getTime()) && d.getMonth() === m && d.getFullYear() === year;
    }).length;

  const setCustomDateColor = (dateKey, color) => {
    setCustomDates((prev) => ({
      ...prev,
      [dateKey]: { color },
    }));
  };

  const clearCustomDateColor = (dateKey) => {
    setCustomDates((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  const getDaysArray = getDaysForMonth();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else { setMonth(month - 1); }
    setSelectedDateKey(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else { setMonth(month + 1); }
    setSelectedDateKey(null);
  };

  const prevYear = () => setYear(year - 1);
  const nextYear = () => setYear(year + 1);

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
        <h1>Kalender {year}</h1>
        <button
          className={`view-toggle ${viewMode === "month" ? "active" : ""}`}
          onClick={() => setViewMode("month")}
        >
          Bulan
        </button>
        <button
          className={`view-toggle ${viewMode === "year" ? "active" : ""}`}
          onClick={() => setViewMode("year")}
        >
          Tahun
        </button>
      </div>

      <div className="calendar-tools">
        <label>
          Kalender global
          <select value={globalCountry} onChange={(e) => setGlobalCountry(e.target.value)}>
            {GLOBAL_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>{country.label}</option>
            ))}
          </select>
        </label>
        <span className="calendar-status">
          {holidayStatus || "Libur Indonesia + global aktif"}
        </span>
      </div>

      {viewMode === "month" && (
        <div className="calendar-month-view">
          <div className="calendar-nav">
            <button onClick={prevMonth}>◀</button>
            <h2>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth}>▶</button>
          </div>

          <div className="calendar-grid">
            {DAYS.map((d) => (
              <div key={d} className={`calendar-day-header ${d === "Min" ? "sunday-header" : ""}`}>{d}</div>
            ))}
            {getDaysArray.map((day, i) => {
              const meta = day ? getDateMeta(day) : null;
              const items = day ? getItemsForDate(day) : [];
              const isMarkedRed = meta?.isSunday || meta?.holidayList.length > 0;

              return (
                <div
                  key={i}
                  className={`calendar-cell ${!day ? "empty" : ""} ${isMarkedRed ? "holiday-cell" : ""} ${meta?.custom ? "custom-cell" : ""}`}
                  style={meta?.custom ? { background: meta.custom.color, borderColor: meta.custom.color } : undefined}
                  onClick={() => day && setSelectedDateKey(meta.dateKey)}
                  title={meta?.holidayList.map((holiday) => holiday.localName || holiday.name).join(", ")}
                >
                  {day && <div className="day-number">{day}</div>}
                  {meta?.holidayList.length > 0 && (
                    <div className="holiday-label">{meta.holidayList[0].localName || meta.holidayList[0].name}</div>
                  )}
                  <div className="tasks-in-day">
                    {items.slice(0, 4).map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className={`task-dot ${item.type}-dot`}
                        style={{ opacity: item.done ? 0.5 : 1 }}
                        title={item.label}
                      >
                        {item.marker}
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="task-dot more-dot">+{items.length - 4}</div>
                    )}
                  </div>

                  {selectedDateKey === meta?.dateKey && (
                    <div className="calendar-color-menu" onClick={(e) => e.stopPropagation()}>
                      <strong>{day} {monthNames[month]}</strong>
                      <div className="calendar-color-swatches">
                        {CUSTOM_COLORS.map((color) => (
                          <button
                            key={color.value}
                            title={color.label}
                            style={{ background: color.value }}
                            onClick={() => setCustomDateColor(meta.dateKey, color.value)}
                          />
                        ))}
                      </div>
                      {meta.holidayList.length > 0 && (
                        <div className="holiday-menu-list">
                          {meta.holidayList.slice(0, 3).map((holiday) => (
                            <span key={`${holiday.source}-${holiday.name}`}>
                              {holiday.source}: {holiday.localName || holiday.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <button className="clear-date-color" onClick={() => clearCustomDateColor(meta.dateKey)}>
                        Reset warna
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                  {days.map((d, i) => {
                    const meta = d ? getDateMeta(d, m) : null;
                    const isMarkedRed = meta?.isSunday || meta?.holidayList.length > 0;
                    return (
                      <span
                        key={i}
                        className={`mini-day ${!d ? "empty" : ""} ${isMarkedRed ? "holiday-mini-day" : ""}`}
                        style={meta?.custom ? { background: meta.custom.color } : undefined}
                      >
                        {d}
                      </span>
                    );
                  })}
                </div>
                <div className="month-task-count">
                  {getMonthItemCount(m)} item · {Object.keys(holidaysByDate).filter((key) => key.startsWith(`${year}-${String(m + 1).padStart(2, "0")}`)).length} libur
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
