import { useState } from "react";
import { useApp } from "../hooks/useApp.js";
import { id } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";
import { Modal } from "../components/Modal.jsx";

export default function Fornecedores() {
  const { fornecedores, setFornecedores } = useApp();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", categoria: "", contacto: "", email: "" });

  const abrirNovo = () => { setEditando(null); setForm({ nome: "", categoria: "", contacto: "", email: "" }); setModal(true); };
  const abrirEdit = (f) => { setEditando(f.id); setForm({ ...f }); setModal(true); };
  const fechar = () => setModal(false);
  const salvar = () => {
    if (!form.nome) return;
    if (editando) setFornecedores(fornecedores.map(f => f.id === editando ? { ...form, id: editando } : f));
    else setFornecedores([...fornecedores, { ...form, id: id() }]);
    fechar();
  };
  const apagar = (fid) => setFornecedores(fornecedores.filter(f => f.id !== fid));

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Fornecedores</h2><p>{fornecedores.length} registados</p></div>
        <button className="btn btn-primary" onClick={abrirNovo}><Icon name="plus" size={14} /> Novo</button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Categoria</th><th>Contacto</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {fornecedores.length === 0 && <tr><td colSpan={5} className="empty">Sem fornecedores.</td></tr>}
              {fornecedores.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td><span className="badge badge-neutral">{f.categoria}</span></td>
                  <td className="text-muted">{f.contacto || "—"}</td>
                  <td className="text-muted">{f.email || "—"}</td>
                  <td><div className="gap-8">
                    <button className="btn btn-ghost btn-sm" onClick={() => abrirEdit(f)}><Icon name="edit" size={12} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => apagar(f.id)}><Icon name="trash" size={12} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-list">
        {fornecedores.length === 0 && <p className="text-muted empty">Sem fornecedores.</p>}
        {fornecedores.map(f => (
          <div className="mobile-card" key={f.id}>
            <div className="mobile-card-title">{f.nome}</div>
            <div className="mobile-card-row"><span className="mobile-card-label">Categoria</span><span className="badge badge-neutral">{f.categoria}</span></div>
            <div className="mobile-card-row"><span className="mobile-card-label">Contacto</span><span className="text-muted">{f.contacto || "—"}</span></div>
            <div className="mobile-card-row"><span className="mobile-card-label">Email</span><span className="text-muted">{f.email || "—"}</span></div>
            <div className="mobile-card-actions">
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => abrirEdit(f)}><Icon name="edit" size={12} /> Editar</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => apagar(f.id)}><Icon name="trash" size={12} /> Apagar</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editando ? "Editar Fornecedor" : "Novo Fornecedor"} onClose={fechar}>
          <div className="form-grid">
            <div className="form-group full"><label>Nome *</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do fornecedor" /></div>
            <div className="form-group"><label>Categoria</label><input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Ex: Carnes, Bebidas..." /></div>
            <div className="form-group"><label>Contacto</label><input value={form.contacto} onChange={e => setForm({ ...form, contacto: e.target.value })} placeholder="Telemóvel ou telefone" /></div>
            <div className="form-group full"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.pt" /></div>
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
