import { useState } from "react";
import { useApp } from "../hooks/useApp.js";
import { id } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";
import { Modal } from "../components/Modal.jsx";

export default function Inventario() {
  const { inventario, setInventario } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ produto: "", stock: "", unidade: "kg", minimo: "", origem: "Hub Central" });

  const abrirNovo = () => { setEditando(null); setForm({ produto: "", stock: "", unidade: "kg", minimo: "", origem: "Hub Central" }); setModal(true); };
  const abrirEdit = (i) => { setEditando(i.id); setForm({ ...i }); setModal(true); };
  const fechar = () => setModal(false);
  const salvar = () => {
    if (!form.produto || !form.stock) return;
    if (editando) setInventario(inventario.map(i => i.id === editando ? { ...form, id: editando } : i));
    else setInventario([...inventario, { ...form, id: id() }]);
    fechar();
  };
  const apagar = (iid) => setInventario(inventario.filter(i => i.id !== iid));

  const getStatus = (i) => {
    const ratio = Number(i.stock) / Number(i.minimo);
    if (ratio <= 1) return { label: "Stock Baixo", cls: "badge-danger" };
    if (ratio <= 1.5) return { label: "Atenção", cls: "badge-warning" };
    return { label: "OK", cls: "badge-success" };
  };

  const baixo = inventario.filter(i => Number(i.stock) <= Number(i.minimo)).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Inventário</h2>
          <p>{inventario.length} produtos · {baixo > 0 ? <span className="text-danger">{baixo} abaixo do mínimo</span> : "stock normalizado"}</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}><Icon name="plus" size={14} /> Novo</button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Stock</th><th>Mínimo</th><th>Nível</th><th>Origem</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {inventario.length === 0 && <tr><td colSpan={7} className="empty">Sem produtos.</td></tr>}
              {inventario.map(i => {
                const st = getStatus(i);
                const pct = Math.min((Number(i.stock) / (Number(i.minimo) * 2)) * 100, 100);
                const barColor = Number(i.stock) <= Number(i.minimo) ? "var(--danger)" : Number(i.stock) <= Number(i.minimo) * 1.5 ? "var(--warning)" : "var(--success)";
                return (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 500 }}>{i.produto}</td>
                    <td className="text-accent">{i.stock} {i.unidade}</td>
                    <td className="text-muted">{i.minimo} {i.unidade}</td>
                    <td style={{ minWidth: 120 }}>
                      <div className="stock-bar-wrap">
                        <div className="stock-bar"><div className="stock-bar-fill" style={{ width: `${pct}%`, background: barColor }} /></div>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="text-muted">{i.origem}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td><div className="gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => abrirEdit(i)}><Icon name="edit" size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => apagar(i.id)}><Icon name="trash" size={12} /></button>
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
        {inventario.length === 0 && <p className="text-muted empty">Sem produtos.</p>}
        {inventario.map(i => {
          const st = getStatus(i);
          const pct = Math.min((Number(i.stock) / (Number(i.minimo) * 2)) * 100, 100);
          const barColor = Number(i.stock) <= Number(i.minimo) ? "var(--danger)" : Number(i.stock) <= Number(i.minimo) * 1.5 ? "var(--warning)" : "var(--success)";
          return (
            <div className="mobile-card" key={i.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="mobile-card-title">{i.produto}</div>
                <span className={`badge ${st.cls}`}>{st.label}</span>
              </div>
              <div className="mobile-card-row"><span className="mobile-card-label">Stock actual</span><span className="text-accent">{i.stock} {i.unidade}</span></div>
              <div className="mobile-card-row"><span className="mobile-card-label">Mínimo</span><span className="text-muted">{i.minimo} {i.unidade}</span></div>
              <div className="mobile-card-row"><span className="mobile-card-label">Origem</span><span className="text-muted">{i.origem}</span></div>
              <div style={{ marginTop: 8 }}>
                <div className="stock-bar-wrap">
                  <div className="stock-bar"><div className="stock-bar-fill" style={{ width: `${pct}%`, background: barColor }} /></div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
              <div className="mobile-card-actions">
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => abrirEdit(i)}><Icon name="edit" size={12} /> Editar</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => apagar(i.id)}><Icon name="trash" size={12} /> Apagar</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={editando ? "Editar Produto" : "Novo Produto"} onClose={fechar}>
          <div className="form-grid">
            <div className="form-group full"><label>Produto *</label><input value={form.produto} onChange={e => setForm({ ...form, produto: e.target.value })} placeholder="Ex: Frango (kg)" /></div>
            <div className="form-group"><label>Stock Actual *</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" /></div>
            <div className="form-group"><label>Unidade</label>
              <select value={form.unidade} onChange={e => setForm({ ...form, unidade: e.target.value })}>
                {["kg", "L", "cx", "un", "g"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Stock Mínimo</label><input type="number" value={form.minimo} onChange={e => setForm({ ...form, minimo: e.target.value })} placeholder="0" /></div>
            <div className="form-group"><label>Origem</label>
              <select value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value })}>
                {["Hub Central", "Restaurante 1", "Restaurante 2", "Restaurante 3"].map(o => <option key={o}>{o}</option>)}
              </select>
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
