import { useApp } from "../hooks/useApp.js";
import { fmt, diasAte } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";

export default function Dashboard() {
  const { colaboradores, despesas, inventario } = useApp();
  const custoMensal = colaboradores.reduce((s, c) => s + Number(c.salario), 0);
  const pendentes = despesas.filter(d => !d.pago).reduce((s, d) => s + Number(d.valor), 0);
  const totalAlertas = despesas.filter(d => !d.pago && diasAte(d.vencimento) <= 7).length;
  const stockBaixo = inventario.filter(i => Number(i.stock) <= Number(i.minimo)).length;
  const alertasDespesas = despesas.filter(d => !d.pago).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento)).slice(0, 5);
  const categorias = ["Matéria-prima", "Renda", "Serviços", "Seguros"];
  const barData = categorias.map(cat => ({
    label: cat.slice(0, 4),
    full: cat,
    value: despesas.filter(d => d.categoria === cat).reduce((s, d) => s + Number(d.valor), 0),
  }));
  const maxVal = Math.max(...barData.map(b => b.value), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Dashboard</h2><p>Visão geral da operação do restaurante</p></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi accent">
          <div className="kpi-label">Equipa</div>
          <div className="kpi-value">{colaboradores.length}</div>
          <div className="kpi-sub">colaboradores activos</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Custo Mensal</div>
          <div className="kpi-value">{fmt(custoMensal)}</div>
          <div className="kpi-sub">salários</div>
        </div>
        <div className="kpi danger">
          <div className="kpi-label">Pendentes</div>
          <div className="kpi-value">{fmt(pendentes)}</div>
          <div className="kpi-sub">{despesas.filter(d => !d.pago).length} em aberto</div>
        </div>
        <div className="kpi" style={{ borderColor: totalAlertas > 0 ? "rgba(224,85,85,0.4)" : undefined }}>
          <div className="kpi-label">Alertas</div>
          <div className="kpi-value" style={{ color: totalAlertas > 0 ? "var(--danger)" : "var(--success)" }}>{totalAlertas}</div>
          <div className="kpi-sub">≤7 dias · {stockBaixo} stock</div>
        </div>
      </div>
      <div className="alerts-grid">
        <div className="card">
          <div className="card-header"><Icon name="alert" size={14} /> Próximos Vencimentos</div>
          {alertasDespesas.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Sem despesas pendentes.</p>}
          {alertasDespesas.map(d => {
            const dias = diasAte(d.vencimento);
            return (
              <div className="alert-item" key={d.id}>
                <div className={`alert-dot ${dias <= 3 ? "dot-danger" : dias <= 7 ? "dot-warning" : "dot-success"}`} />
                <div className="alert-text">
                  <div>{d.descricao}</div>
                  <div className="alert-date">{fmt(d.valor)} · {d.vencimento}</div>
                </div>
                <span className={`badge ${dias <= 3 ? "badge-danger" : dias <= 7 ? "badge-warning" : "badge-neutral"}`}>
                  {dias < 0 ? "Vencido" : `${dias}d`}
                </span>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="card-header"><Icon name="wallet" size={14} /> Despesas por Categoria</div>
          <div className="chart-bars">
            {barData.map(b => (
              <div className="chart-bar-wrap" key={b.label}>
                <div className="chart-bar" style={{ height: `${(b.value / maxVal) * 64 + 4}px` }} title={fmt(b.value)} />
                <div className="chart-label">{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {barData.map(b => (
              <div key={b.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                <span className="text-muted">{b.full}</span>
                <span>{fmt(b.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
