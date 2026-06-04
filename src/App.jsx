import { useState } from "react";
import { useApp } from "./hooks/useApp.js";
import { diasAte } from "./utils/format.js";
import { Icon } from "./components/Icon.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Colaboradores from "./pages/Colaboradores.jsx";
import Despesas from "./pages/Despesas.jsx";
import Fornecedores from "./pages/Fornecedores.jsx";
import Inventario from "./pages/Inventario.jsx";
import Financeiro from "./pages/Financeiro.jsx";

const PAGES = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "colaboradores", label: "Colaboradores", icon: "users" },
  { key: "despesas", label: "Despesas", icon: "receipt" },
  { key: "financeiro", label: "Financeiro", icon: "coins" },
  { key: "fornecedores", label: "Fornecedores", icon: "truck" },
  { key: "inventario", label: "Inventário", icon: "box" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { despesas, inventario } = useApp();

  const alertCount = despesas.filter(d => !d.pago && diasAte(d.vencimento) <= 7).length +
    inventario.filter(i => Number(i.stock) <= Number(i.minimo)).length;

  const navegar = (key) => { setPage(key); setSidebarOpen(false); };

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "colaboradores") return <Colaboradores />;
    if (page === "despesas") return <Despesas />;
    if (page === "financeiro") return <Financeiro />;
    if (page === "fornecedores") return <Fornecedores />;
    if (page === "inventario") return <Inventario />;
  };

  const current = PAGES.find(p => p.key === page);

  return (
    <div className="layout">
      {/* Overlay mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <h1>Gestor<br />Restaurante</h1>
          <p>Sistema de gestão</p>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map(p => (
            <button key={p.key} className={`nav-item ${page === p.key ? "active" : ""}`} onClick={() => navegar(p.key)}>
              <Icon name={p.icon} />
              {p.label}
              {p.key === "dashboard" && alertCount > 0 && (
                <span style={{ marginLeft: "auto", background: "var(--danger)", color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px" }}>
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          douglasestevam1984<br />
          <span style={{ color: "var(--accent)", fontWeight: 500 }}>Frontend Portfolio</span>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icon name="menu" size={18} />
            </button>
            <div>
              <div className="topbar-title">{current?.label}</div>
              <div className="topbar-sub">Gestor de Restaurante · Sistema de Gestão</div>
            </div>
          </div>
          {alertCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--warning)", fontSize: 13, flexShrink: 0 }}>
              <Icon name="alert" size={14} />
              <span>{alertCount}</span>
            </div>
          )}
        </div>
        {renderPage()}
      </div>
    </div>
  );
}
