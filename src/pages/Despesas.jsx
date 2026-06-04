import { useState } from "react";
import { useApp } from "../hooks/useApp.js";
import { useCrud } from "../hooks/useCrud.js";
import { fmt, diasAte, hoje } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";
import { Modal } from "../components/Modal.jsx";
import { CATEGORIAS } from "../constants.js";

// Funcao porque "vencimento" usa hoje() — recalculado a cada novo registo.
const formVazio = () => ({ descricao: "", valor: "", vencimento: hoje(), pago: false, fornecedor: "", categoria: "Outro" });

export default function Despesas() {
  const { despesas, setDespesas, fornecedores } = useApp();
  const { modal, editando, form, setForm, abrirNovo, abrirEdit, fechar, salvar, apagar } = useCrud({
    lista: despesas,
    setLista: setDespesas,
    formVazio,
    validar: (f) => f.descricao && f.valor,
  });
  const [filtro, setFiltro] = useState("todas");

  // Especifico desta pagina: alternar o estado pago/pendente
  const togglePago = (did) => setDespesas(despesas.map(d => d.id === did ? { ...d, pago: !d.pago } : d));

  const lista = despesas.filter(d => {
    if (filtro === "pendentes") return !d.pago;
    if (filtro === "pagas") return d.pago;
    return true;
  }).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));

  const total = lista.reduce((s, d) => s + Number(d.valor), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Despesas</h2>
          <p>{lista.length} registos · <span className="text-accent">{fmt(total)}</span></p>
        </div>
        <div className="gap-8 filter-row" style={{ flexWrap: "wrap" }}>
          <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: "8px 12px" }}>
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="pagas">Pagas</option>
          </select>
          <button className="btn btn-primary" onClick={abrirNovo}><Icon name="plus" size={14} /> Nova</button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Descrição</th><th>Categoria</th><th>Fornecedor</th><th>Valor</th><th>Vencimento</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {lista.length === 0 && <tr><td colSpan={7} className="empty">Sem despesas.</td></tr>}
              {lista.map(d => {
                const dias = diasAte(d.vencimento);
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.descricao}</td>
                    <td><span className="badge badge-neutral">{d.categoria}</span></td>
                    <td className="text-muted">{d.fornecedor || "—"}</td>
                    <td className="text-accent">{fmt(d.valor)}</td>
                    <td><span className={!d.pago && dias <= 3 ? "text-danger" : "text-muted"}>{d.vencimento}{!d.pago && ` (${dias < 0 ? "vencido" : `${dias}d`})`}</span></td>
                    <td>
                      <button className={`badge ${d.pago ? "badge-success" : dias <= 3 ? "badge-danger" : dias <= 7 ? "badge-warning" : "badge-neutral"}`} style={{ cursor: "pointer", border: "none" }} onClick={() => togglePago(d.id)}>
                        {d.pago ? "Pago" : "Pendente"}
                      </button>
                    </td>
                    <td><div className="gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => abrirEdit(d)}><Icon name="edit" size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => apagar(d.id)}><Icon name="trash" size={12} /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-list">
        {lista.length === 0 && <p className="text-muted empty">Sem despesas.</p>}
        {lista.map(d => {
          const dias = diasAte(d.vencimento);
          return (
            <div className="mobile-card" key={d.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="mobile-card-title">{d.descricao}</div>
                <button className={`badge ${d.pago ? "badge-success" : dias <= 3 ? "badge-danger" : dias <= 7 ? "badge-warning" : "badge-neutral"}`} style={{ cursor: "pointer", border: "none", flexShrink: 0 }} onClick={() => togglePago(d.id)}>
                  {d.pago ? "Pago" : "Pendente"}
                </button>
              </div>
              <div className="mobile-card-row"><span className="mobile-card-label">Valor</span><span className="text-accent">{fmt(d.valor)}</span></div>
              <div className="mobile-card-row"><span className="mobile-card-label">Vencimento</span>
                <span className={!d.pago && dias <= 3 ? "text-danger" : "text-muted"}>{d.vencimento}{!d.pago && ` (${dias < 0 ? "vencido" : `${dias}d`})`}</span>
              </div>
              <div className="mobile-card-row"><span className="mobile-card-label">Categoria</span><span className="badge badge-neutral">{d.categoria}</span></div>
              {d.fornecedor && <div className="mobile-card-row"><span className="mobile-card-label">Fornecedor</span><span className="text-muted">{d.fornecedor}</span></div>}
              <div className="mobile-card-actions">
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => abrirEdit(d)}><Icon name="edit" size={12} /> Editar</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => apagar(d.id)}><Icon name="trash" size={12} /> Apagar</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={editando ? "Editar Despesa" : "Nova Despesa"} onClose={fechar}>
          <div className="form-grid">
            <div className="form-group full"><label>Descrição *</label><input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Fornecimento de carne" /></div>
            <div className="form-group"><label>Valor (€) *</label><input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0" /></div>
            <div className="form-group"><label>Vencimento</label><input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
            <div className="form-group"><label>Categoria</label>
              <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Fornecedor</label>
              <select value={form.fornecedor} onChange={e => setForm({ ...form, fornecedor: e.target.value })}>
                <option value="">— Seleccionar —</option>
                {fornecedores.map(f => <option key={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div className="form-group full" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="pago" checked={form.pago} onChange={e => setForm({ ...form, pago: e.target.checked })} style={{ width: "auto" }} />
              <label htmlFor="pago" style={{ color: "var(--text)" }}>Marcar como pago</label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={fechar}>Cancelar</button>
            <button className="btn btn-primary" onClick={salvar}><Icon name="check" size={14} /> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
