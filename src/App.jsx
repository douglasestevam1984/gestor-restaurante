import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from 'react';

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED = {
  colaboradores: [
    {
      id: 1,
      nome: 'Ana Ferreira',
      cargo: 'Chefe de Sala',
      salario: 1200,
      admissao: '2022-03-15',
      ferias: '2025-08-01',
    },
    {
      id: 2,
      nome: 'Bruno Costa',
      cargo: 'Cozinheiro',
      salario: 1400,
      admissao: '2021-06-01',
      ferias: '2025-07-15',
    },
    {
      id: 3,
      nome: 'Carla Mendes',
      cargo: 'Empregada de Mesa',
      salario: 900,
      admissao: '2023-01-10',
      ferias: '2025-09-01',
    },
    {
      id: 4,
      nome: 'David Lopes',
      cargo: 'Barman',
      salario: 1050,
      admissao: '2022-11-20',
      ferias: '2025-06-20',
    },
  ],
  despesas: [
    {
      id: 1,
      descricao: 'Renda do espaço',
      valor: 2800,
      vencimento: '2025-06-05',
      pago: false,
      fornecedor: 'Imobiliária Central',
      categoria: 'Renda',
    },
    {
      id: 2,
      descricao: 'Fornecimento de bebidas',
      valor: 650,
      vencimento: '2025-06-10',
      pago: false,
      fornecedor: 'Distribuidora Porto',
      categoria: 'Matéria-prima',
    },
    {
      id: 3,
      descricao: 'Electricidade',
      valor: 380,
      vencimento: '2025-06-15',
      pago: true,
      fornecedor: 'EDP',
      categoria: 'Serviços',
    },
    {
      id: 4,
      descricao: 'Fornecimento de carne',
      valor: 920,
      vencimento: '2025-06-08',
      pago: false,
      fornecedor: 'Talho Sousa',
      categoria: 'Matéria-prima',
    },
    {
      id: 5,
      descricao: 'Seguro multirriscos',
      valor: 210,
      vencimento: '2025-07-01',
      pago: false,
      fornecedor: 'Fidelidade',
      categoria: 'Seguros',
    },
    {
      id: 6,
      descricao: 'Contabilidade',
      valor: 300,
      vencimento: '2025-06-30',
      pago: true,
      fornecedor: 'TOC António Silva',
      categoria: 'Serviços',
    },
  ],
  fornecedores: [
    {
      id: 1,
      nome: 'Distribuidora Porto',
      categoria: 'Bebidas',
      contacto: '222 111 333',
      email: 'geral@distriporto.pt',
    },
    {
      id: 2,
      nome: 'Talho Sousa',
      categoria: 'Carnes',
      contacto: '912 345 678',
      email: 'talho.sousa@gmail.com',
    },
    {
      id: 3,
      nome: 'EDP',
      categoria: 'Energia',
      contacto: '808 502 502',
      email: 'clientes@edp.pt',
    },
    {
      id: 4,
      nome: 'Imobiliária Central',
      categoria: 'Imóveis',
      contacto: '220 123 456',
      email: 'info@imobcentral.pt',
    },
    {
      id: 5,
      nome: 'Fidelidade',
      categoria: 'Seguros',
      contacto: '800 296 297',
      email: 'clientes@fidelidade.pt',
    },
  ],
  inventario: [
    {
      id: 1,
      produto: 'Frango (kg)',
      stock: 45,
      unidade: 'kg',
      minimo: 20,
      origem: 'Hub Central',
    },
    {
      id: 2,
      produto: 'Arroz (kg)',
      stock: 80,
      unidade: 'kg',
      minimo: 30,
      origem: 'Hub Central',
    },
    {
      id: 3,
      produto: 'Cerveja (cx)',
      stock: 12,
      unidade: 'cx',
      minimo: 15,
      origem: 'Hub Central',
    },
    {
      id: 4,
      produto: 'Azeite (L)',
      stock: 8,
      unidade: 'L',
      minimo: 10,
      origem: 'Hub Central',
    },
  ],
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

function useStorage(key, seed) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : seed;
    } catch {
      return seed;
    }
  });

  const save = useCallback(
    (next) => {
      setData(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key],
  );

  return [data, save];
}

function AppProvider({ children }) {
  const [colaboradores, setColaboradores] = useStorage(
    'gr_colaboradores',
    SEED.colaboradores,
  );
  const [despesas, setDespesas] = useStorage('gr_despesas', SEED.despesas);
  const [fornecedores, setFornecedores] = useStorage(
    'gr_fornecedores',
    SEED.fornecedores,
  );
  const [inventario, setInventario] = useStorage(
    'gr_inventario',
    SEED.inventario,
  );

  return (
    <AppContext.Provider
      value={{
        colaboradores,
        setColaboradores,
        despesas,
        setDespesas,
        fornecedores,
        setFornecedores,
        inventario,
        setInventario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f0f;
    --surface: #181818;
    --surface2: #222222;
    --border: #2a2a2a;
    --accent: #e8c97e;
    --accent2: #c4763a;
    --text: #f0ede8;
    --muted: #888;
    --danger: #e05555;
    --success: #5ba65b;
    --warning: #d4903a;
    --radius: 10px;
    --font: 'DM Sans', sans-serif;
    --font-display: 'Playfair Display', serif;
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    line-height: 1.6;
  }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    min-width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
  .sidebar-brand {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-brand h1 {
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--accent);
    line-height: 1.2;
  }
  .sidebar-brand p { color: var(--muted); font-size: 11px; margin-top: 2px; }
  .sidebar-nav { padding: 16px 12px; flex: 1; }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(232,201,126,0.12); color: var(--accent); }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .sidebar-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--muted);
  }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .topbar {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .topbar-title { font-size: 18px; font-weight: 600; }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }

  .page { padding: 28px 32px; }

  /* CARDS KPI */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .kpi {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }
  .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .kpi-value { font-size: 28px; font-weight: 600; line-height: 1; }
  .kpi-sub { font-size: 11px; color: var(--muted); margin-top: 6px; }
  .kpi.accent .kpi-value { color: var(--accent); }
  .kpi.danger .kpi-value { color: var(--danger); }
  .kpi.success .kpi-value { color: var(--success); }

  /* ALERTAS */
  .alerts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }
  .card-header { font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .alert-item:last-child { border-bottom: none; }
  .alert-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .dot-danger { background: var(--danger); }
  .dot-warning { background: var(--warning); }
  .dot-success { background: var(--success); }
  .alert-text { flex: 1; }
  .alert-date { font-size: 11px; color: var(--muted); }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    text-align: left;
    padding: 10px 14px;
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  /* BADGE */
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
  }
  .badge-danger { background: rgba(224,85,85,0.15); color: var(--danger); }
  .badge-success { background: rgba(91,166,91,0.15); color: var(--success); }
  .badge-warning { background: rgba(212,144,58,0.15); color: var(--warning); }
  .badge-neutral { background: rgba(136,136,136,0.15); color: var(--muted); }

  /* BUTTONS */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    font-family: var(--font);
  }
  .btn-primary { background: var(--accent); color: #111; }
  .btn-primary:hover { background: #d4b56a; }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--muted); }
  .btn-danger { background: rgba(224,85,85,0.15); color: var(--danger); border: 1px solid rgba(224,85,85,0.3); }
  .btn-danger:hover { background: rgba(224,85,85,0.25); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  /* FORM / MODAL */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    width: 480px;
    max-width: 95vw;
  }
  .modal h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 12px; color: var(--muted); }
  input, select {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    color: var(--text);
    font-size: 13px;
    font-family: var(--font);
    outline: none;
    transition: border-color 0.15s;
  }
  input:focus, select:focus { border-color: var(--accent); }
  select option { background: var(--surface2); }
  .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

  /* PAGE HEADER */
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .page-header h2 { font-size: 22px; font-weight: 600; }
  .page-header p { color: var(--muted); font-size: 13px; margin-top: 3px; }

  /* EMPTY */
  .empty { text-align: center; padding: 48px; color: var(--muted); }
  .empty svg { width: 40px; height: 40px; margin: 0 auto 12px; display: block; opacity: 0.3; }

  /* STOCK */
  .stock-bar-wrap { display: flex; align-items: center; gap: 10px; }
  .stock-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .stock-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

  /* CHART MINI */
  .chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
  .chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .chart-bar { width: 100%; border-radius: 4px 4px 0 0; background: var(--accent); opacity: 0.7; transition: opacity 0.15s; }
  .chart-bar:hover { opacity: 1; }
  .chart-label { font-size: 10px; color: var(--muted); }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .text-muted { color: var(--muted); }
  .text-danger { color: var(--danger); }
  .text-success { color: var(--success); }
  .text-accent { color: var(--accent); }
  .mt-16 { margin-top: 16px; }
  .gap-8 { display: flex; gap: 8px; }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    receipt: (
      <>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M16 8H8" />
        <path d="M16 12H8" />
        <path d="M12 16H8" />
      </>
    ),
    truck: (
      <>
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    box: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
    alert: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    ),
    check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    wallet: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = (v) =>
  `€${Number(v).toLocaleString('pt-PT', { minimumFractionDigits: 0 })}`;
const diasAte = (date) => Math.ceil((new Date(date) - new Date()) / 86400000);
const hoje = () => new Date().toISOString().split('T')[0];
const id = () => Date.now();

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const { colaboradores, despesas, inventario } = useApp();

  const custoMensal = colaboradores.reduce((s, c) => s + Number(c.salario), 0);
  const pendentes = despesas
    .filter((d) => !d.pago)
    .reduce((s, d) => s + Number(d.valor), 0);
  const totalAlertas = despesas.filter(
    (d) => !d.pago && diasAte(d.vencimento) <= 7,
  ).length;
  const stockBaixo = inventario.filter(
    (i) => Number(i.stock) <= Number(i.minimo),
  ).length;

  const alertasDespesas = despesas
    .filter((d) => !d.pago)
    .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
    .slice(0, 5);

  const categorias = ['Matéria-prima', 'Renda', 'Serviços', 'Seguros'];
  const barData = categorias.map((cat) => ({
    label: cat.slice(0, 4),
    value: despesas
      .filter((d) => d.categoria === cat)
      .reduce((s, d) => s + Number(d.valor), 0),
  }));
  const maxVal = Math.max(...barData.map((b) => b.value), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral da operação do restaurante</p>
        </div>
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
          <div className="kpi-sub">salários + encargos</div>
        </div>
        <div className="kpi danger">
          <div className="kpi-label">Despesas Pendentes</div>
          <div className="kpi-value">{fmt(pendentes)}</div>
          <div className="kpi-sub">
            {despesas.filter((d) => !d.pago).length} pagamentos em aberto
          </div>
        </div>
        <div
          className="kpi"
          style={{
            borderColor: totalAlertas > 0 ? 'rgba(224,85,85,0.4)' : undefined,
          }}
        >
          <div className="kpi-label">Alertas Urgentes</div>
          <div
            className="kpi-value"
            style={{
              color: totalAlertas > 0 ? 'var(--danger)' : 'var(--success)',
            }}
          >
            {totalAlertas}
          </div>
          <div className="kpi-sub">
            vencimentos em ≤7 dias · {stockBaixo} stock baixo
          </div>
        </div>
      </div>

      <div className="alerts-grid">
        <div className="card">
          <div className="card-header">
            <Icon name="alert" size={14} /> Próximos Vencimentos
          </div>
          {alertasDespesas.length === 0 && (
            <p className="text-muted" style={{ fontSize: 13 }}>
              Sem despesas pendentes.
            </p>
          )}
          {alertasDespesas.map((d) => {
            const dias = diasAte(d.vencimento);
            return (
              <div className="alert-item" key={d.id}>
                <div
                  className={`alert-dot ${dias <= 3 ? 'dot-danger' : dias <= 7 ? 'dot-warning' : 'dot-success'}`}
                />
                <div className="alert-text">
                  <div>{d.descricao}</div>
                  <div className="alert-date">
                    {fmt(d.valor)} · {d.vencimento}
                  </div>
                </div>
                <span
                  className={`badge ${dias <= 3 ? 'badge-danger' : dias <= 7 ? 'badge-warning' : 'badge-neutral'}`}
                >
                  {dias < 0 ? 'Vencido' : `${dias}d`}
                </span>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="card-header">
            <Icon name="wallet" size={14} /> Despesas por Categoria
          </div>
          <div className="chart-bars">
            {barData.map((b) => (
              <div className="chart-bar-wrap" key={b.label}>
                <div
                  className="chart-bar"
                  style={{ height: `${(b.value / maxVal) * 64 + 4}px` }}
                  title={fmt(b.value)}
                />
                <div className="chart-label">{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {barData.map((b) => (
              <div
                key={b.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  padding: '4px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span className="text-muted">
                  {b.label.length <= 4
                    ? categorias.find((c) => c.startsWith(b.label))
                    : b.label}
                </span>
                <span>{fmt(b.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COLABORADORES ────────────────────────────────────────────────────────────
function Colaboradores() {
  const { colaboradores, setColaboradores } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cargo: '',
    salario: '',
    admissao: hoje(),
    ferias: '',
  });

  const abrirNovo = () => {
    setEditando(null);
    setForm({ nome: '', cargo: '', salario: '', admissao: hoje(), ferias: '' });
    setModal(true);
  };
  const abrirEdit = (c) => {
    setEditando(c.id);
    setForm({ ...c });
    setModal(true);
  };
  const fechar = () => setModal(false);

  const salvar = () => {
    if (!form.nome || !form.salario) return;
    if (editando) {
      setColaboradores(
        colaboradores.map((c) =>
          c.id === editando ? { ...form, id: editando } : c,
        ),
      );
    } else {
      setColaboradores([...colaboradores, { ...form, id: id() }]);
    }
    fechar();
  };

  const apagar = (cid) =>
    setColaboradores(colaboradores.filter((c) => c.id !== cid));
  const custo = colaboradores.reduce((s, c) => s + Number(c.salario), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Colaboradores</h2>
          <p>
            {colaboradores.length} colaboradores · custo mensal:{' '}
            <span className="text-accent">{fmt(custo)}</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          <Icon name="plus" size={14} /> Novo Colaborador
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Salário</th>
                <th>Admissão</th>
                <th>Férias</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    Sem colaboradores registados.
                  </td>
                </tr>
              )}
              {colaboradores.map((c) => {
                const diasFerias = c.ferias ? diasAte(c.ferias) : null;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td className="text-muted">{c.cargo}</td>
                    <td className="text-accent">{fmt(c.salario)}</td>
                    <td className="text-muted">{c.admissao}</td>
                    <td>
                      {c.ferias ? (
                        <span
                          className={`badge ${diasFerias <= 30 ? 'badge-warning' : 'badge-neutral'}`}
                        >
                          {c.ferias} {diasFerias !== null && `(${diasFerias}d)`}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="gap-8">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => abrirEdit(c)}
                        >
                          <Icon name="edit" size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => apagar(c.id)}
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={editando ? 'Editar Colaborador' : 'Novo Colaborador'}
          onClose={fechar}
        >
          <div className="form-grid">
            <div className="form-group full">
              <label>Nome *</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="form-group">
              <label>Cargo</label>
              <input
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                placeholder="Função"
              />
            </div>
            <div className="form-group">
              <label>Salário (€) *</label>
              <input
                type="number"
                value={form.salario}
                onChange={(e) => setForm({ ...form, salario: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Data de Admissão</label>
              <input
                type="date"
                value={form.admissao}
                onChange={(e) => setForm({ ...form, admissao: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Início de Férias</label>
              <input
                type="date"
                value={form.ferias}
                onChange={(e) => setForm({ ...form, ferias: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={fechar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              <Icon name="check" size={14} /> Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── DESPESAS ─────────────────────────────────────────────────────────────────
const CATEGORIAS = [
  'Matéria-prima',
  'Renda',
  'Serviços',
  'Seguros',
  'Manutenção',
  'Outro',
];

function Despesas() {
  const { despesas, setDespesas, fornecedores } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    vencimento: hoje(),
    pago: false,
    fornecedor: '',
    categoria: 'Outro',
  });
  const [filtro, setFiltro] = useState('todas');

  const abrirNovo = () => {
    setEditando(null);
    setForm({
      descricao: '',
      valor: '',
      vencimento: hoje(),
      pago: false,
      fornecedor: '',
      categoria: 'Outro',
    });
    setModal(true);
  };
  const abrirEdit = (d) => {
    setEditando(d.id);
    setForm({ ...d });
    setModal(true);
  };
  const fechar = () => setModal(false);

  const salvar = () => {
    if (!form.descricao || !form.valor) return;
    if (editando) {
      setDespesas(
        despesas.map((d) =>
          d.id === editando ? { ...form, id: editando } : d,
        ),
      );
    } else {
      setDespesas([...despesas, { ...form, id: id() }]);
    }
    fechar();
  };

  const apagar = (did) => setDespesas(despesas.filter((d) => d.id !== did));
  const togglePago = (did) =>
    setDespesas(
      despesas.map((d) => (d.id === did ? { ...d, pago: !d.pago } : d)),
    );

  const lista = despesas
    .filter((d) => {
      if (filtro === 'pendentes') return !d.pago;
      if (filtro === 'pagas') return d.pago;
      return true;
    })
    .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));

  const total = lista.reduce((s, d) => s + Number(d.valor), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Despesas</h2>
          <p>
            {lista.length} registos · total:{' '}
            <span className="text-accent">{fmt(total)}</span>
          </p>
        </div>
        <div className="gap-8">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ padding: '8px 12px' }}
          >
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="pagas">Pagas</option>
          </select>
          <button className="btn btn-primary" onClick={abrirNovo}>
            <Icon name="plus" size={14} /> Nova Despesa
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    Sem despesas neste filtro.
                  </td>
                </tr>
              )}
              {lista.map((d) => {
                const dias = diasAte(d.vencimento);
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.descricao}</td>
                    <td>
                      <span className="badge badge-neutral">{d.categoria}</span>
                    </td>
                    <td className="text-muted">{d.fornecedor || '—'}</td>
                    <td className="text-accent">{fmt(d.valor)}</td>
                    <td>
                      <span
                        className={
                          !d.pago && dias <= 3
                            ? 'text-danger'
                            : !d.pago && dias <= 7
                              ? ''
                              : 'text-muted'
                        }
                        style={{
                          fontWeight: !d.pago && dias <= 3 ? 600 : undefined,
                        }}
                      >
                        {d.vencimento}
                        {!d.pago && ` (${dias < 0 ? 'vencido' : `${dias}d`})`}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`badge ${d.pago ? 'badge-success' : dias <= 3 ? 'badge-danger' : dias <= 7 ? 'badge-warning' : 'badge-neutral'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => togglePago(d.id)}
                      >
                        {d.pago ? 'Pago' : 'Pendente'}
                      </button>
                    </td>
                    <td>
                      <div className="gap-8">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => abrirEdit(d)}
                        >
                          <Icon name="edit" size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => apagar(d.id)}
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={editando ? 'Editar Despesa' : 'Nova Despesa'}
          onClose={fechar}
        >
          <div className="form-grid">
            <div className="form-group full">
              <label>Descrição *</label>
              <input
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                placeholder="Ex: Fornecimento de carne"
              />
            </div>
            <div className="form-group">
              <label>Valor (€) *</label>
              <input
                type="number"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Data de Vencimento</label>
              <input
                type="date"
                value={form.vencimento}
                onChange={(e) =>
                  setForm({ ...form, vencimento: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              >
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fornecedor</label>
              <select
                value={form.fornecedor}
                onChange={(e) =>
                  setForm({ ...form, fornecedor: e.target.value })
                }
              >
                <option value="">— Seleccionar —</option>
                {fornecedores.map((f) => (
                  <option key={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div
              className="form-group full"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <input
                type="checkbox"
                id="pago"
                checked={form.pago}
                onChange={(e) => setForm({ ...form, pago: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <label htmlFor="pago" style={{ color: 'var(--text)' }}>
                Marcar como pago
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={fechar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              <Icon name="check" size={14} /> Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── FORNECEDORES ─────────────────────────────────────────────────────────────
function Fornecedores() {
  const { fornecedores, setFornecedores } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    categoria: '',
    contacto: '',
    email: '',
  });

  const abrirNovo = () => {
    setEditando(null);
    setForm({ nome: '', categoria: '', contacto: '', email: '' });
    setModal(true);
  };
  const abrirEdit = (f) => {
    setEditando(f.id);
    setForm({ ...f });
    setModal(true);
  };
  const fechar = () => setModal(false);

  const salvar = () => {
    if (!form.nome) return;
    if (editando) {
      setFornecedores(
        fornecedores.map((f) =>
          f.id === editando ? { ...form, id: editando } : f,
        ),
      );
    } else {
      setFornecedores([...fornecedores, { ...form, id: id() }]);
    }
    fechar();
  };

  const apagar = (fid) =>
    setFornecedores(fornecedores.filter((f) => f.id !== fid));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Fornecedores</h2>
          <p>{fornecedores.length} fornecedores registados</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          <Icon name="plus" size={14} /> Novo Fornecedor
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Contacto</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">
                    Sem fornecedores registados.
                  </td>
                </tr>
              )}
              {fornecedores.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td>
                    <span className="badge badge-neutral">{f.categoria}</span>
                  </td>
                  <td className="text-muted">{f.contacto || '—'}</td>
                  <td className="text-muted">{f.email || '—'}</td>
                  <td>
                    <div className="gap-8">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => abrirEdit(f)}
                      >
                        <Icon name="edit" size={12} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => apagar(f.id)}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal
          title={editando ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          onClose={fechar}
        >
          <div className="form-grid">
            <div className="form-group full">
              <label>Nome *</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do fornecedor"
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <input
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                placeholder="Ex: Carnes, Bebidas..."
              />
            </div>
            <div className="form-group">
              <label>Contacto</label>
              <input
                value={form.contacto}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                placeholder="Telemóvel ou telefone"
              />
            </div>
            <div className="form-group full">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.pt"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={fechar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              <Icon name="check" size={14} /> Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── INVENTÁRIO ───────────────────────────────────────────────────────────────
function Inventario() {
  const { inventario, setInventario } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    produto: '',
    stock: '',
    unidade: 'kg',
    minimo: '',
    origem: 'Hub Central',
  });

  const abrirNovo = () => {
    setEditando(null);
    setForm({
      produto: '',
      stock: '',
      unidade: 'kg',
      minimo: '',
      origem: 'Hub Central',
    });
    setModal(true);
  };
  const abrirEdit = (i) => {
    setEditando(i.id);
    setForm({ ...i });
    setModal(true);
  };
  const fechar = () => setModal(false);

  const salvar = () => {
    if (!form.produto || !form.stock) return;
    if (editando) {
      setInventario(
        inventario.map((i) =>
          i.id === editando ? { ...form, id: editando } : i,
        ),
      );
    } else {
      setInventario([...inventario, { ...form, id: id() }]);
    }
    fechar();
  };

  const apagar = (iid) => setInventario(inventario.filter((i) => i.id !== iid));

  const getStatus = (i) => {
    const ratio = Number(i.stock) / Number(i.minimo);
    if (ratio <= 1) return { label: 'Stock Baixo', cls: 'badge-danger' };
    if (ratio <= 1.5) return { label: 'Atenção', cls: 'badge-warning' };
    return { label: 'OK', cls: 'badge-success' };
  };

  const baixo = inventario.filter(
    (i) => Number(i.stock) <= Number(i.minimo),
  ).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Inventário</h2>
          <p>
            {inventario.length} produtos ·{' '}
            {baixo > 0 ? (
              <span className="text-danger">{baixo} abaixo do mínimo</span>
            ) : (
              'stock normalizado'
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          <Icon name="plus" size={14} /> Novo Produto
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Stock Actual</th>
                <th>Mínimo</th>
                <th>Nível</th>
                <th>Origem</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventario.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    Sem produtos registados.
                  </td>
                </tr>
              )}
              {inventario.map((i) => {
                const st = getStatus(i);
                const pct = Math.min(
                  (Number(i.stock) / (Number(i.minimo) * 2)) * 100,
                  100,
                );
                const barColor =
                  Number(i.stock) <= Number(i.minimo)
                    ? 'var(--danger)'
                    : Number(i.stock) <= Number(i.minimo) * 1.5
                      ? 'var(--warning)'
                      : 'var(--success)';
                return (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 500 }}>{i.produto}</td>
                    <td className="text-accent">
                      {i.stock} {i.unidade}
                    </td>
                    <td className="text-muted">
                      {i.minimo} {i.unidade}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div className="stock-bar-wrap">
                        <div className="stock-bar">
                          <div
                            className="stock-bar-fill"
                            style={{ width: `${pct}%`, background: barColor }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--muted)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">{i.origem}</td>
                    <td>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td>
                      <div className="gap-8">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => abrirEdit(i)}
                        >
                          <Icon name="edit" size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => apagar(i.id)}
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal
          title={editando ? 'Editar Produto' : 'Novo Produto'}
          onClose={fechar}
        >
          <div className="form-grid">
            <div className="form-group full">
              <label>Produto *</label>
              <input
                value={form.produto}
                onChange={(e) => setForm({ ...form, produto: e.target.value })}
                placeholder="Ex: Frango (kg)"
              />
            </div>
            <div className="form-group">
              <label>Stock Actual *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <select
                value={form.unidade}
                onChange={(e) => setForm({ ...form, unidade: e.target.value })}
              >
                {['kg', 'L', 'cx', 'un', 'g'].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Stock Mínimo</label>
              <input
                type="number"
                value={form.minimo}
                onChange={(e) => setForm({ ...form, minimo: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Origem</label>
              <select
                value={form.origem}
                onChange={(e) => setForm({ ...form, origem: e.target.value })}
              >
                {[
                  'Hub Central',
                  'Restaurante 1',
                  'Restaurante 2',
                  'Restaurante 3',
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={fechar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              <Icon name="check" size={14} /> Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const PAGES = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'colaboradores', label: 'Colaboradores', icon: 'users' },
  { key: 'despesas', label: 'Despesas', icon: 'receipt' },
  { key: 'fornecedores', label: 'Fornecedores', icon: 'truck' },
  { key: 'inventario', label: 'Inventário', icon: 'box' },
];

function App() {
  const [page, setPage] = useState('dashboard');
  const { despesas, inventario } = useApp();

  const alertCount =
    despesas.filter((d) => !d.pago && diasAte(d.vencimento) <= 7).length +
    inventario.filter((i) => Number(i.stock) <= Number(i.minimo)).length;

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard />;
    if (page === 'colaboradores') return <Colaboradores />;
    if (page === 'despesas') return <Despesas />;
    if (page === 'fornecedores') return <Fornecedores />;
    if (page === 'inventario') return <Inventario />;
  };

  const current = PAGES.find((p) => p.key === page);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>
            Gestor
            <br />
            Restaurante
          </h1>
          <p>Sistema de gestão</p>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map((p) => (
            <button
              key={p.key}
              className={`nav-item ${page === p.key ? 'active' : ''}`}
              onClick={() => setPage(p.key)}
            >
              <Icon name={p.icon} />
              {p.label}
              {p.key === 'dashboard' && alertCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--danger)',
                    color: '#fff',
                    borderRadius: 10,
                    fontSize: 10,
                    padding: '1px 6px',
                  }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          douglasestevam1984
          <br />
          <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Frontend Portfolio
          </span>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">{current?.label}</div>
            <div className="topbar-sub">
              Gestor de Restaurante · Sistema de Gestão
            </div>
          </div>
          {alertCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--warning)',
                fontSize: 13,
              }}
            >
              <Icon name="alert" size={14} />
              {alertCount}{' '}
              {alertCount === 1 ? 'alerta activo' : 'alertas activos'}
            </div>
          )}
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <>
      <style>{css}</style>
      <AppProvider>
        <App />
      </AppProvider>
    </>
  );
}
