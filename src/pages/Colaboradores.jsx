import { useState } from "react";
import { useApp } from "../hooks/useApp.js";
import { fmt, diasAte, hoje, id } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";
import { Modal } from "../components/Modal.jsx";

export default function Colaboradores() {
  const { colaboradores, setColaboradores } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", cargo: "", salario: "", admissao: hoje(), ferias: "" });

  const abrirNovo = () => { setEditando(null); setForm({ nome: "", cargo: "", salario: "", admissao: hoje(), ferias: "" }); setModal(true); };
  const abrirEdit = (c) => { setEditando(c.id); setForm({ ...c }); setModal(true); };
  const fechar = () => setModal(false);
  const salvar = () => {
    if (!form.nome || !form.salario) return;
    if (editando) setColaboradores(colaboradores.map(c => c.id === editando ? { ...form, id: editando } : c));
    else setColaboradores([...colaboradores, { ...form, id: id() }]);
    fechar();
  };
  const apagar = (cid) => setColaboradores(colaboradores.filter(c => c.id !== cid));
  const custo = colaboradores.reduce((s, c) => s + Number(c.salario), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Colaboradores</h2>
          <p>{colaboradores.length} colaboradores · <span className="text-accent">{fmt(custo)}</span>/mês</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}><Icon name="plus" size={14} /> Novo</button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Cargo</th><th>Salário</th><th>Admissão</th><th>Férias</th><th></th></tr></thead>
            <tbody>
              {colaboradores.length === 0 && <tr><td colSpan={6} className="empty">Sem colaboradores.</td></tr>}
              {colaboradores.map(c => {
                const diasF = c.ferias ? diasAte(c.ferias) : null;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td className="text-muted">{c.cargo}</td>
                    <td className="text-accent">{fmt(c.salario)}</td>
                    <td className="text-muted">{c.admissao}</td>
                    <td>{c.ferias ? <span className={`badge ${diasF <= 30 ? "badge-warning" : "badge-neutral"}`}>{c.ferias}</span> : <span className="text-muted">—</span>}</td>
                    <td><div className="gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => abrirEdit(c)}><Icon name="edit" size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => apagar(c.id)}><Icon name="trash" size={12} /></button>
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
        {colaboradores.length === 0 && <p className="text-muted empty">Sem colaboradores.</p>}
        {colaboradores.map(c => (
          <div className="mobile-card" key={c.id}>
            <div className="mobile-card-title">{c.nome}</div>
            <div className="mobile-card-row"><span className="mobile-card-label">Cargo</span><span>{c.cargo || "—"}</span></div>
            <div className="mobile-card-row"><span className="mobile-card-label">Salário</span><span className="text-accent">{fmt(c.salario)}</span></div>
            <div className="mobile-card-row"><span className="mobile-card-label">Admissão</span><span className="text-muted">{c.admissao}</span></div>
            {c.ferias && <div className="mobile-card-row"><span className="mobile-card-label">Férias</span><span className={`badge ${diasAte(c.ferias) <= 30 ? "badge-warning" : "badge-neutral"}`}>{c.ferias}</span></div>}
            <div className="mobile-card-actions">
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => abrirEdit(c)}><Icon name="edit" size={12} /> Editar</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => apagar(c.id)}><Icon name="trash" size={12} /> Apagar</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editando ? "Editar Colaborador" : "Novo Colaborador"} onClose={fechar}>
          <div className="form-grid">
            <div className="form-group full"><label>Nome *</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" /></div>
            <div className="form-group"><label>Cargo</label><input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} placeholder="Função" /></div>
            <div className="form-group"><label>Salário (€) *</label><input type="number" value={form.salario} onChange={e => setForm({ ...form, salario: e.target.value })} placeholder="0" /></div>
            <div className="form-group"><label>Admissão</label><input type="date" value={form.admissao} onChange={e => setForm({ ...form, admissao: e.target.value })} /></div>
            <div className="form-group"><label>Início de Férias</label><input type="date" value={form.ferias} onChange={e => setForm({ ...form, ferias: e.target.value })} /></div>
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
