import { useState, useEffect, useMemo } from "react";

const CATEGORIES = {
  Makanan:   { color:"#FF6B6B", icon:"🍜" },
  Transport: { color:"#4ECDC4", icon:"🚗" },
  Hiburan:   { color:"#45B7D1", icon:"🎮" },
  Utilities: { color:"#FFA07A", icon:"💡" },
  Shopping:  { color:"#98D8C8", icon:"🛍️" },
  Kesehatan: { color:"#DDA0DD", icon:"🏥" },
  Lainnya:   { color:"#F7DC6F", icon:"📌" },
};

const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);

const formatRupiahInput = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseRupiahInput = (value) => {
  const numbers = value.replace(/\D/g, "");
  return parseInt(numbers) || 0;
};

function BudgetBar({ label, icon, color, used, limit, onSetLimit }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const over = limit > 0 && used > limit;
  const warn = limit > 0 && pct >= 80 && !over;

  return (
    <div style={{ background:"var(--bg-card)", border:"1.5px solid var(--border)", borderRadius:14, padding:"16px 18px", boxShadow:"var(--shadow)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontWeight:600, color:"var(--text1)", fontSize:"0.9rem" }}>
          {icon} {label}
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:"0.82rem", color:"var(--text3)" }}>{fmt(used)}</span>
          {limit > 0 && (
            <span style={{ fontSize:"0.82rem", color: over ? "#ef4444" : warn ? "#d97706" : "#16a34a", fontWeight:700 }}>
              / {fmt(limit)}
            </span>
          )}
          <button
            onClick={() => {
              const val = prompt(`Budget ${label} (Rp):`, formatRupiahInput(String(limit)));
              if (val !== null) onSetLimit(parseRupiahInput(val));
            }}
            style={{ background:"var(--accent-soft)", border:"none", borderRadius:6, padding:"3px 8px", fontSize:"0.72rem", color:"var(--accent)", cursor:"pointer", fontWeight:600 }}
          >
            {limit > 0 ? "Ubah" : "+ Set"}
          </button>
        </div>
      </div>

      {limit > 0 && (
        <>
          <div style={{ background:"var(--border)", height:8, borderRadius:6, overflow:"hidden" }}>
            <div style={{
              height:"100%", width:`${pct}%`,
              background: over ? "#ef4444" : warn ? "#f59e0b" : color,
              borderRadius:6,
              transition:"width 0.4s ease",
            }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            <span style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{pct.toFixed(0)}% terpakai</span>
            {over && <span style={{ fontSize:"0.72rem", color:"#ef4444", fontWeight:700 }}>⚠️ Over budget!</span>}
            {warn && <span style={{ fontSize:"0.72rem", color:"#d97706", fontWeight:700 }}>⚡ Hampir habis</span>}
          </div>
        </>
      )}
      {limit === 0 && (
        <div style={{ height:8, background:"var(--border)", borderRadius:6 }}>
          <div style={{ height:"100%", width:"100%", background:color, opacity:0.2, borderRadius:6 }} />
        </div>
      )}
    </div>
  );
}

function Budget() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState(() => {
    const s = localStorage.getItem("resonote-budgets");
    return s ? JSON.parse(s) : {};
  });
  const [monthKey, setMonthKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  });
  const [monthlyTotal, setMonthlyTotal] = useState(() => {
    const s = localStorage.getItem("resonote-monthly-budget");
    return s ? parseInt(s) : 0;
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resonote-expenses")) || [];
    setExpenses(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("resonote-budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("resonote-monthly-budget", String(monthlyTotal));
  }, [monthlyTotal]);

  const monthExpenses = useMemo(() =>
    expenses.filter((e) => e.date?.startsWith(monthKey)),
    [expenses, monthKey]
  );

  const totalUsed = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const catTotals = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return map;
  }, [monthExpenses]);

  const monthPct = monthlyTotal > 0 ? Math.min((totalUsed / monthlyTotal) * 100, 100) : 0;
  const monthOver = monthlyTotal > 0 && totalUsed > monthlyTotal;

  const getMonthLabel = (key) => {
    const [y, m] = key.split("-");
    return new Date(y, parseInt(m)-1, 1).toLocaleDateString("id-ID", { month:"long", year:"numeric" });
  };

  const availableMonths = useMemo(() => {
    const s = new Set(expenses.map((e) => e.date?.slice(0,7)).filter(Boolean));
    return [...s].sort().reverse();
  }, [expenses]);

  return (
    <div style={{ maxWidth:720, margin:"0 auto", animation:"page-in 0.25s ease" }}>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"var(--text1)", marginBottom:8 }}>🎯 Budget Goals</h1>
      <p style={{ color:"var(--text3)", fontSize:"0.88rem", marginBottom:24 }}>Kontrol pengeluaran kamu tiap bulan</p>

      {/* Month selector */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <select
          value={monthKey}
          onChange={(e) => setMonthKey(e.target.value)}
          style={{ padding:"9px 14px", border:"1.5px solid var(--border)", borderRadius:10, background:"var(--bg-card)", color:"var(--text1)", fontSize:"0.9rem", cursor:"pointer", outline:"none" }}
        >
          {availableMonths.length === 0
            ? <option value={monthKey}>{getMonthLabel(monthKey)}</option>
            : availableMonths.map((m) => (
              <option key={m} value={m}>{getMonthLabel(m)}</option>
            ))
          }
        </select>
      </div>

      {/* Monthly total budget */}
      <div style={{ background:"var(--bg-card)", border:"1.5px solid var(--border)", borderRadius:14, padding:"20px", marginBottom:20, boxShadow:"var(--shadow)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <h2 style={{ fontSize:"1rem", fontWeight:700, color:"var(--text1)" }}>📊 Budget Bulanan</h2>
            <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginTop:2 }}>{getMonthLabel(monthKey)}</p>
          </div>
          <button
            onClick={() => {
              const v = prompt("Total budget bulan ini (Rp):", formatRupiahInput(String(monthlyTotal)));
              if (v !== null) setMonthlyTotal(parseRupiahInput(v));
            }}
            style={{ padding:"7px 16px", background:"var(--accent)", color:"#fff", border:"none", borderRadius:8, fontSize:"0.82rem", fontWeight:600, cursor:"pointer" }}
          >
            {monthlyTotal > 0 ? "Ubah" : "+ Set Budget"}
          </button>
        </div>

        <div style={{ display:"flex", gap:16, marginBottom:14, flexWrap:"wrap" }}>
          {[
            { label:"Total Budget", val: monthlyTotal > 0 ? fmt(monthlyTotal) : "Belum diset", color:"var(--text2)" },
            { label:"Terpakai", val: fmt(totalUsed), color: monthOver ? "#ef4444" : "#16a34a" },
            { label:"Sisa", val: monthlyTotal > 0 ? fmt(Math.max(monthlyTotal - totalUsed, 0)) : "-", color: monthOver ? "#ef4444" : "var(--text2)" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ flex:1, minWidth:100 }}>
              <div style={{ fontSize:"0.72rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:"1rem", fontWeight:700, color }}>{val}</div>
            </div>
          ))}
        </div>

        {monthlyTotal > 0 && (
          <>
            <div style={{ background:"var(--border)", height:10, borderRadius:6, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${monthPct}%`,
                background: monthOver ? "#ef4444" : monthPct >= 80 ? "#f59e0b" : "var(--accent)",
                borderRadius:6, transition:"width 0.4s ease",
              }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <span style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{monthPct.toFixed(0)}% terpakai</span>
              {monthOver && <span style={{ fontSize:"0.72rem", color:"#ef4444", fontWeight:700 }}>⚠️ Melebihi budget!</span>}
            </div>
          </>
        )}
      </div>

      {/* Per-category budgets */}
      <h2 style={{ fontSize:"0.82rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", color:"var(--text3)", marginBottom:12 }}>Per Kategori</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
        {Object.entries(CATEGORIES).map(([name, { color, icon }]) => (
          <BudgetBar
            key={name}
            label={name}
            icon={icon}
            color={color}
            used={catTotals[name] || 0}
            limit={budgets[name] || 0}
            onSetLimit={(v) => setBudgets({ ...budgets, [name]: v })}
          />
        ))}
      </div>

      {expenses.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--text3)" }}>
          <p>Belum ada data expense. Tambah di halaman Expense dulu!</p>
        </div>
      )}
    </div>
  );
}

export default Budget;
