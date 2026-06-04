import { useState } from "react";
import { useApp } from "../hooks/useApp.js";
import { useCrud } from "../hooks/useCrud.js";
import { fmt, hoje } from "../utils/format.js";
import { Icon } from "../components/Icon.jsx";
import { Modal } from "../components/Modal.jsx";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// "2026-06" -> "Jun 2026"
const nomeMes = (chave) => {
  const [a, m] = chave.split("-");
  return `${MESES[Number(m) - 1]} ${a}`;
};

// Agrupa os fechos por uma chave (mes ou ano) e soma os valores
const agregar = (fechos, chaveFn) => {
  const mapa = {};
  for (const f of fechos) {
    const k = chaveFn(f);
    if (!mapa[k]) mapa[k] = { chave: k, dias: 0, dinheiro: 0, cartao: 0, maquina: 0 };
    mapa[k].dias += 1;
    mapa[k].dinheiro += Number(f.dinheiro || 0);
    mapa[k].cartao += Number(f.cartaoSistema || 0);
    mapa[k].maquina += Number(f.cartaoMaquina || 0);
  }
  return Object.values(mapa).sort((a, b) => b.chave.localeCompare(a.chave));
};

// Funcao porque "data" usa hoje() — recalculado a cada novo fecho.
const formVazio = () => ({ data: hoje(), dinheiro: "", cartaoSistema: "", cartaoMaquina: "", notas: "" });

export default function Financeiro() {
  const { fechos, setFechos } = useApp();
  const { modal, editando, form, setForm, abrirNovo, abrirEdit, fechar, salvar, apagar } = useCrud({
    lista: fechos,
    setLista: setFechos,
    formVazio,
    validar: (f) => f.data && (Number(f.dinheiro) > 0 || Number(f.cartaoSistema) > 0),
  });
  const [periodo, setPeriodo] = useState("dia");

  // ── Resumo geral (todos os tempos) — alimenta os KPIs ──
  const totalDinheiro = fechos.reduce((s, f) => s + Number(f.dinheiro || 0), 0);
  const totalCartao = fechos.reduce((s, f) => s + Number(f.cartaoSistema || 0), 0);
  const totalMaquina = fechos.reduce((s, f) => s + Number(f.cartaoMaquina || 0), 0);
  const totalGeral = totalDinheiro + totalCartao;
  const discrepancia = totalCartao - totalMaquina;

  // Lista de fechos diarios, mais recente primeiro
  const diarios = [...fechos].sort((a, b) => b.data.localeCompare(a.data));
  const mensais = agregar(fechos, (f) => f.data.slice(0, 7));
  const anuais = agregar(fechos, (f) => f.data.slice(0, 4));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Financeiro</h2>
          <p>Fecho de caixa · <span className="text-accent">{fmt(totalGeral)}</span> faturado</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}><Icon name="plus" size={14} /> Novo fecho</button>
      </div>

      {/* KPIs — visao geral */}
      <div className="kpi-grid">
        <div className="kpi accent">
          <div className="kpi-label">Total Faturado</div>
          <div className="kpi-value">{fmt(totalGeral)}</div>
          <div className="kpi-sub">{fechos.length} fechos registados</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Dinheiro</div>
          <div className="kpi-value">{fmt(totalDinheiro)}</div>
          <div className="kpi-sub">numerário</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Cartão</div>
          <div className="kpi-value">{fmt(totalCartao)}</div>
          <div className="kpi-sub">multibanco</div>
        </div>
        <div className="kpi" style={{ borderColor: discrepancia !== 0 ? "rgba(224,85,85,0.4)" : undefined }}>
          <div className="kpi-label">Conferência TPA</div>
          <div className="kpi-value" style={{ color: discrepancia !== 0 ? "var(--danger)" : "var(--success)" }}>
            {discrepancia === 0 ? "OK" : fmt(Math.abs(discrepancia))}
          </div>
          <div className="kpi-sub">{discrepancia === 0 ? "tudo confere" : "diferença sistema vs máquina"}</div>
        </div>
      </div>

      {/* Seletor de granularidade */}
      <div className="gap-8 filter-row" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {[["dia", "Por dia"], ["mes", "Por mês"], ["ano", "Por ano"]].map(([key, label]) => (
          <button
            key={key}
            className={`btn btn-sm ${periodo === key ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setPeriodo(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── VISTA POR DIA (detalhada, com CRUD) ── */}
      {periodo === "dia" && (
        <>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Data</th><th>Dinheiro</th><th>Cartão (sistema)</th><th>Máquina (TPA)</th><th>Conferência</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {diarios.length === 0 && <tr><td colSpan={7} className="empty">Sem fechos registados.</td></tr>}
                  {diarios.map(f => {
                    const diff = Number(f.cartaoSistema || 0) - Number(f.cartaoMaquina || 0);
                    const total = Number(f.dinheiro || 0) + Number(f.cartaoSistema || 0);
                    return (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 500 }}>{f.data}</td>
                        <td className="text-muted">{fmt(f.dinheiro || 0)}</td>
                        <td className="text-muted">{fmt(f.cartaoSistema || 0)}</td>
                        <td className="text-muted">{fmt(f.cartaoMaquina || 0)}</td>
                        <td>
                          <span className={`badge ${diff === 0 ? "badge-success" : "badge-danger"}`}>
                            {diff === 0 ? "Confere" : `Difere ${fmt(Math.abs(diff))}`}
                          </span>
                        </td>
                        <td className="text-accent">{fmt(total)}</td>
                        <td><div className="gap-8">
                          <button className="btn btn-ghost btn-sm" onClick={() => abrirEdit(f)}><Icon name="edit" size={12} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => apagar(f.id)}><Icon name="trash" size={12} /></button>
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
            {diarios.length === 0 && <p className="text-muted empty">Sem fechos registados.</p>}
            {diarios.map(f => {
              const diff = Number(f.cartaoSistema || 0) - Number(f.cartaoMaquina || 0);
              const total = Number(f.dinheiro || 0) + Number(f.cartaoSistema || 0);
              return (
                <div className="mobile-card" key={f.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="mobile-card-title">{f.data}</div>
                    <span className={`badge ${diff === 0 ? "badge-success" : "badge-danger"}`} style={{ flexShrink: 0 }}>
                      {diff === 0 ? "Confere" : `Difere ${fmt(Math.abs(diff))}`}
                    </span>
                  </div>
                  <div className="mobile-card-row"><span className="mobile-card-label">Dinheiro</span><span>{fmt(f.dinheiro || 0)}</span></div>
                  <div className="mobile-card-row"><span className="mobile-card-label">Cartão (sistema)</span><span>{fmt(f.cartaoSistema || 0)}</span></div>
                  <div className="mobile-card-row"><span className="mobile-card-label">Máquina (TPA)</span><span>{fmt(f.cartaoMaquina || 0)}</span></div>
                  <div className="mobile-card-row"><span className="mobile-card-label">Total</span><span className="text-accent">{fmt(total)}</span></div>
                  {f.notas && <div className="mobile-card-row"><span className="mobile-card-label">Notas</span><span className="text-muted">{f.notas}</span></div>}
                  <div className="mobile-card-actions">
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => abrirEdit(f)}><Icon name="edit" size={12} /> Editar</button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => apagar(f.id)}><Icon name="trash" size={12} /> Apagar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── VISTA POR MÊS / ANO (agregada, só leitura) ── */}
      {periodo !== "dia" && (() => {
        const dados = periodo === "mes" ? mensais : anuais;
        const titulo = periodo === "mes" ? "Mês" : "Ano";
        const rotulo = (k) => (periodo === "mes" ? nomeMes(k) : k);
        return (
          <>
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead><tr><th>{titulo}</th><th>Dias</th><th>Dinheiro</th><th>Cartão</th><th>Total</th><th>Conferência</th></tr></thead>
                  <tbody>
                    {dados.length === 0 && <tr><td colSpan={6} className="empty">Sem dados.</td></tr>}
                    {dados.map(d => {
                      const diff = d.cartao - d.maquina;
                      const total = d.dinheiro + d.cartao;
                      return (
                        <tr key={d.chave}>
                          <td style={{ fontWeight: 500 }}>{rotulo(d.chave)}</td>
                          <td className="text-muted">{d.dias}</td>
                          <td className="text-muted">{fmt(d.dinheiro)}</td>
                          <td className="text-muted">{fmt(d.cartao)}</td>
                          <td className="text-accent">{fmt(total)}</td>
                          <td>
                            <span className={`badge ${diff === 0 ? "badge-success" : "badge-danger"}`}>
                              {diff === 0 ? "OK" : `Difere ${fmt(Math.abs(diff))}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="mobile-list">
              {dados.length === 0 && <p className="text-muted empty">Sem dados.</p>}
              {dados.map(d => {
                const diff = d.cartao - d.maquina;
                const total = d.dinheiro + d.cartao;
                return (
                  <div className="mobile-card" key={d.chave}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div className="mobile-card-title">{rotulo(d.chave)}</div>
                      <span className={`badge ${diff === 0 ? "badge-success" : "badge-danger"}`} style={{ flexShrink: 0 }}>
                        {diff === 0 ? "OK" : `Difere ${fmt(Math.abs(diff))}`}
                      </span>
                    </div>
                    <div className="mobile-card-row"><span className="mobile-card-label">Dias</span><span>{d.dias}</span></div>
                    <div className="mobile-card-row"><span className="mobile-card-label">Dinheiro</span><span>{fmt(d.dinheiro)}</span></div>
                    <div className="mobile-card-row"><span className="mobile-card-label">Cartão</span><span>{fmt(d.cartao)}</span></div>
                    <div className="mobile-card-row"><span className="mobile-card-label">Total</span><span className="text-accent">{fmt(total)}</span></div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ── MODAL: novo / editar fecho ── */}
      {modal && (
        <Modal title={editando ? "Editar Fecho" : "Novo Fecho de Caixa"} onClose={fechar}>
          <div className="form-grid">
            <div className="form-group full"><label>Data *</label><input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} /></div>
            <div className="form-group"><label>Dinheiro (€)</label><input type="number" value={form.dinheiro} onChange={e => setForm({ ...form, dinheiro: e.target.value })} placeholder="0" /></div>
            <div className="form-group"><label>Cartão — sistema (€)</label><input type="number" value={form.cartaoSistema} onChange={e => setForm({ ...form, cartaoSistema: e.target.value })} placeholder="0" /></div>
            <div className="form-group full"><label>Cartão — máquina TPA (€)</label><input type="number" value={form.cartaoMaquina} onChange={e => setForm({ ...form, cartaoMaquina: e.target.value })} placeholder="Valor do talão de fecho" /></div>
            {Number(form.cartaoSistema || 0) !== Number(form.cartaoMaquina || 0) && (Number(form.cartaoSistema) > 0 || Number(form.cartaoMaquina) > 0) && (
              <div className="form-group full">
                <span className="badge badge-danger">
                  Diferença de {fmt(Math.abs(Number(form.cartaoSistema || 0) - Number(form.cartaoMaquina || 0)))} entre sistema e máquina
                </span>
              </div>
            )}
            <div className="form-group full"><label>Notas</label><input value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Opcional" /></div>
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
