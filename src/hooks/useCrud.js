import { useState } from "react";
import { id } from "../utils/format.js";

/**
 * Hook generico para o estado e operacoes CRUD partilhados pelas paginas
 * (modal, formulario, criar / editar / apagar).
 *
 * @param {Array}    lista     - a lista atual (vinda do contexto)
 * @param {Function} setLista  - o setter dessa lista (vindo do contexto)
 * @param {Object|Function} formVazio - estado inicial do formulario.
 *        Use uma FUNCAO quando os valores por defeito sao dinamicos
 *        (ex.: uma data de hoje), para serem recalculados a cada abertura.
 * @param {Function} [validar] - recebe o form e devolve true se for valido
 */
export function useCrud({ lista, setLista, formVazio, validar }) {
  const criarFormVazio = () =>
    typeof formVazio === "function" ? formVazio() : formVazio;

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(criarFormVazio);

  const abrirNovo = () => {
    setEditando(null);
    setForm(criarFormVazio());
    setModal(true);
  };

  const abrirEdit = (item) => {
    setEditando(item.id);
    setForm({ ...item });
    setModal(true);
  };

  const fechar = () => setModal(false);

  const salvar = () => {
    if (validar && !validar(form)) return;
    if (editando) {
      setLista(lista.map((x) => (x.id === editando ? { ...form, id: editando } : x)));
    } else {
      setLista([...lista, { ...form, id: id() }]);
    }
    fechar();
  };

  const apagar = (itemId) => setLista(lista.filter((x) => x.id !== itemId));

  return { modal, editando, form, setForm, abrirNovo, abrirEdit, fechar, salvar, apagar };
}
