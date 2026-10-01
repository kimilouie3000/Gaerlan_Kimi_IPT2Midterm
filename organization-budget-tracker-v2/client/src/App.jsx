import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownLeft, ArrowUpRight, BarChart3, Bell, CalendarDays,
  Check, ChevronDown, CircleDollarSign, Download, Edit3, Filter, LayoutDashboard,
  LoaderCircle, Plus, Search, ShieldCheck, Sparkles, Trash2, Wallet, X
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell
} from "recharts";
import { budgetService } from "./services/budgetService.js";

const CATEGORIES = ["Operations", "Supplies", "Payroll", "Travel", "Marketing", "Utilities", "Equipment", "Other"];
const COLORS = ["#8b7cff", "#49c5b6", "#f2b96f", "#ef829e", "#71a8ff", "#b6a0f5", "#8bcf89", "#9ba7bb"];
const blankForm = () => ({
  title: "", category: "Operations", type: "expense", amount: "", date: new Date().toISOString().slice(0, 10),
  paymentMethod: "Bank transfer", notes: ""
});
const money = (amount) => new Intl.NumberFormat("en-PH", {
  style: "currency", currency: "PHP", maximumFractionDigits: 2
}).format(Number(amount || 0));
const prettyDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-PH", {
  month: "short", day: "numeric", year: "numeric"
}) : "—";

function StatCard({ label, amount, icon: Icon, tone, detail }) {
  return <article className={`stat-card glass ${tone}`}>
    <div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={19} /></span></div>
    <div className="stat-amount">{money(amount)}</div>
    <div className="stat-detail"><span className="pulse-dot" />{detail}</div>
  </article>;
}

function EntryModal({ entry, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => entry ? {
    title: entry.title, category: entry.category, type: entry.type,
    amount: String(entry.amount), date: String(entry.date).slice(0, 10),
    paymentMethod: entry.paymentMethod || "Bank transfer", notes: entry.notes || ""
  } : blankForm());
  const [formError, setFormError] = useState("");

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setFormError("");
    if (!form.title.trim()) return setFormError("Please enter a title.");
    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      return setFormError("Amount must be greater than zero.");
    }
    try {
      await onSave({ ...form, title: form.title.trim(), amount: Number(form.amount) });
    } catch (error) {
      setFormError(error.message);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal glass" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading">
        <div><span className="eyebrow">{entry ? "UPDATE RECORD" : "NEW RECORD"}</span>
          <h2 id="modal-title">{entry ? "Edit budget entry" : "Add budget entry"}</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
      </div>
      <form onSubmit={submit} className="entry-form">
        <label>Title<input name="title" value={form.title} onChange={change} maxLength="100" placeholder="e.g. Office supplies" required autoFocus /></label>
        <div className="form-grid">
          <label>Type<select name="type" value={form.type} onChange={change}><option value="expense">Expense</option><option value="income">Income</option></select></label>
          <label>Category<select name="category" value={form.category} onChange={change}>{CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
        </div>
        <div className="form-grid">
          <label>Amount (PHP)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="0.00" required /></label>
          <label>Date<input name="date" type="date" value={form.date} onChange={change} required /></label>
        </div>
        <label>Payment method<select name="paymentMethod" value={form.paymentMethod} onChange={change}>
          {["Bank transfer", "Cash", "Credit card", "Debit card", "E-wallet", "Other"].map((method) => <option key={method}>{method}</option>)}
        </select></label>
        <label>Notes <span className="optional">(optional)</span><textarea name="notes" value={form.notes} onChange={change} maxLength="500" rows="3" placeholder="Add a short note…" /></label>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button>
          <button className="button primary" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{saving ? "Saving…" : "Save entry"}</button></div>
      </form>
    </section>
  </div>;
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalEntry, setModalEntry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await budgetService.list();
      setEntries(Array.isArray(data) ? data : data.entries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const filtered = useMemo(() => entries.filter((entry) => {
    const haystack = [entry.title, entry.category, entry.paymentMethod, entry.notes].join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase()) &&
      (typeFilter === "all" || entry.type === typeFilter) &&
      (categoryFilter === "all" || entry.category === categoryFilter);
  }), [entries, search, typeFilter, categoryFilter]);

  const totals = useMemo(() => entries.reduce((acc, entry) => {
    if (entry.type === "income") acc.income += Number(entry.amount);
    else acc.expenses += Number(entry.amount);
    return acc;
  }, { income: 0, expenses: 0 }), [entries]);

  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        month: d.toLocaleDateString("en-US", { month: "short" }), expenses: 0, income: 0 });
    }
    entries.forEach((entry) => {
      const month = months.find((m) => m.key === String(entry.date).slice(0, 7));
      if (month) month[entry.type === "income" ? "income" : "expenses"] += Number(entry.amount);
    });
    return months;
  }, [entries]);

  const categoryData = useMemo(() => {
    const totalsByCategory = {};
    entries.filter((e) => e.type === "expense").forEach((e) => {
      totalsByCategory[e.category] = (totalsByCategory[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(totalsByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [entries]);

  async function saveEntry(form) {
    setSaving(true);
    try {
      if (modalEntry?._id) await budgetService.update(modalEntry._id, form);
      else await budgetService.create(form);
      setModalOpen(false);
      setModalEntry(null);
      setNotice(modalEntry ? "Entry updated successfully." : "Entry created successfully.");
      await loadEntries();
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(entry) {
    if (!window.confirm(`Delete "${entry.title}"? This action cannot be undone.`)) return;
    setError("");
    try {
      await budgetService.remove(entry._id);
      setNotice("Entry deleted.");
      await loadEntries();
    } catch (err) { setError(err.message); }
  }

  function exportCsv() {
    const columns = ["title", "category", "type", "amount", "date", "paymentMethod", "notes"];
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [columns.join(","), ...filtered.map((entry) => columns.map((key) => escape(entry[key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "organization-budget-entries.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <aside className="sidebar glass">
      <div className="brand"><div className="brand-mark"><Wallet size={22} /></div><div><strong>ledger<span>.</span></strong><small>ORGANIZATION FINANCE</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav"><a className="nav-item active" href="#overview"><LayoutDashboard size={18} />Overview</a><a className="nav-item" href="#transactions"><Activity size={18} />Transactions</a><a className="nav-item" href="#analytics"><BarChart3 size={18} />Analytics</a></nav>
      <div className="sidebar-bottom"><div className="secure-card"><ShieldCheck size={19} /><div><strong>Data protected</strong><span>Stored in your database</span></div></div><div className="profile"><div className="avatar">KL</div><div><strong>Finance workspace</strong><span>Budget administrator</span></div><ChevronDown size={16} /></div></div>
    </aside>

    <section className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="topbar-right"><span className="live-status"><span /> Live workspace</span><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /></button><div className="avatar small-avatar">KL</div></div></header>
      <div className="content" id="overview">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={13} /> FINANCIAL OVERVIEW</div><h1>Good morning, Kim <span className="wave">✳</span></h1><p className="subheading">A clear view of your organization's financial health.</p></div><button className="button primary add-button" onClick={() => { setModalEntry(null); setModalOpen(true); }}><Plus size={18} />Add entry</button></div>

        {error && <div className="alert error-alert" role="alert"><span>{error}</span><button onClick={loadEntries} className="text-button">Retry</button></div>}
        {notice && <div className="alert success-alert"><Check size={16} />{notice}</div>}

        <div className="stats-grid">
          <StatCard label="Total balance" amount={totals.income - totals.expenses} icon={Wallet} tone="purple" detail="Income minus expenses" />
          <StatCard label="Total income" amount={totals.income} icon={ArrowDownLeft} tone="green" detail="Across all records" />
          <StatCard label="Total expenses" amount={totals.expenses} icon={ArrowUpRight} tone="orange" detail="Across all records" />
          <StatCard label="Recorded entries" amount={entries.length} icon={CircleDollarSign} tone="blue" detail="Saved budget records" />
        </div>

        <div className="analytics-grid" id="analytics">
          <section className="panel glass chart-panel"><div className="panel-heading"><div><h2>Cash flow</h2><p>Income and expenses over the last six months</p></div><span className="period-pill"><CalendarDays size={14} /> 6 months</span></div>
            <div className="chart-wrap">{loading ? <div className="chart-loading"><LoaderCircle className="spin" /> Loading chart…</div> : <ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#51c8b5" stopOpacity={0.24}/><stop offset="95%" stopColor="#51c8b5" stopOpacity={0}/></linearGradient><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9987ff" stopOpacity={0.22}/><stop offset="95%" stopColor="#9987ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,.08)" vertical={false}/><XAxis dataKey="month" tick={{ fill: "#8994aa", fontSize: 12 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill: "#8994aa", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}/><Tooltip contentStyle={{ background: "#171d2b", border: "1px solid #30394b", borderRadius: 12, color: "#fff" }} formatter={(v) => money(v)}/><Area type="monotone" dataKey="income" name="Income" stroke="#51c8b5" strokeWidth={2.5} fill="url(#incomeFill)"/><Area type="monotone" dataKey="expenses" name="Expenses" stroke="#9987ff" strokeWidth={2.5} fill="url(#expenseFill)"/></AreaChart></ResponsiveContainer>}</div>
            <div className="chart-legend"><span><i className="legend-dot mint" />Income</span><span><i className="legend-dot violet" />Expenses</span></div>
          </section>
          <section className="panel glass category-panel"><div className="panel-heading"><div><h2>Expense breakdown</h2><p>Spending by category</p></div><span className="round-icon"><BarChart3 size={17}/></span></div>
            {categoryData.length ? <><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={88} paddingAngle={4} stroke="none">{categoryData.map((item, i) => <Cell key={item.name} fill={COLORS[i % COLORS.length]}/>)}</Pie><Tooltip formatter={(v) => money(v)} contentStyle={{ background: "#171d2b", border: "1px solid #30394b", borderRadius: 12 }}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(totals.expenses)}</strong><span>Total spend</span></div></div><div className="category-legend">{categoryData.slice(0, 4).map((item, i) => <div className="category-line" key={item.name}><span><i style={{ background: COLORS[i % COLORS.length] }}/>{item.name}</span><strong>{money(item.value)}</strong></div>)}</div></> : <div className="empty-chart"><div className="empty-chart-icon"><BarChart3 size={22}/></div><strong>No expenses yet</strong><span>Add an expense to see the breakdown.</span></div>}
          </section>
        </div>

        <section className="panel glass transactions-panel" id="transactions">
          <div className="panel-heading transactions-heading"><div><h2>Recent transactions</h2><p>Manage and review your budget records</p></div><button className="button secondary export-button" onClick={exportCsv} disabled={!filtered.length}><Download size={16}/>Export CSV</button></div>
          <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions…" aria-label="Search transactions"/>{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={14}/></button>}</div><div className="filter-control"><Filter size={15}/><select aria-label="Filter by type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select></div><div className="filter-control"><select aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="all">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div></div>
          <div className="table-wrap"><table><thead><tr><th>DESCRIPTION</th><th>CATEGORY</th><th>DATE</th><th>PAYMENT</th><th>AMOUNT</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {loading ? <tr><td colSpan="6"><div className="table-state"><LoaderCircle className="spin"/> Loading records…</div></td></tr> :
              filtered.length ? filtered.map((entry) => <tr key={entry._id}><td><div className="entry-description"><span className={`entry-symbol ${entry.type}`} >{entry.type === "income" ? <ArrowDownLeft size={17}/> : <ArrowUpRight size={17}/>}</span><div><strong>{entry.title}</strong><small>{entry.notes || entry.type[0].toUpperCase() + entry.type.slice(1)}</small></div></div></td><td><span className="category-badge">{entry.category}</span></td><td className="date-cell">{prettyDate(entry.date)}</td><td className="payment-cell">{entry.paymentMethod || "—"}</td><td className={`amount-cell ${entry.type}`}>{entry.type === "income" ? "+" : "−"}{money(entry.amount)}</td><td><div className="row-actions"><button className="icon-button" onClick={() => { setModalEntry(entry); setModalOpen(true); }} aria-label={`Edit ${entry.title}`}><Edit3 size={15}/></button><button className="icon-button danger-hover" onClick={() => deleteEntry(entry)} aria-label={`Delete ${entry.title}`}><Trash2 size={15}/></button></div></td></tr>) :
              <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Search size={21}/></div><strong>{entries.length ? "No matching transactions" : "Your ledger is ready"}</strong><span>{entries.length ? "Try changing your search or filters." : "Add your first budget entry to see it here."}</span>{!entries.length && <button className="button primary" onClick={() => { setModalEntry(null); setModalOpen(true); }}><Plus size={16}/>Add first entry</button>}</div></td></tr>}
          </tbody></table></div>
          <div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{entries.length}</strong> records</span><span><span className="footer-dot"/> Synced with database</span></div>
        </section>
        <footer className="footer"><span>© {new Date().getFullYear()} Ledger Workspace</span><span>Thoughtful finance management <Sparkles size={13}/></span></footer>
      </div>
    </section>
    {modalOpen && <EntryModal entry={modalEntry} onClose={() => { setModalOpen(false); setModalEntry(null); }} onSave={saveEntry} saving={saving}/>}
  </main>;
}
