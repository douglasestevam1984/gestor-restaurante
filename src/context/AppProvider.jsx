import { useState, useCallback } from "react";
import { AppContext } from "./AppContext.js";
import { SEED } from "../data/seed.js";

// Hook interno: liga um pedaco de estado ao localStorage
function useStorage(key, seed) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : seed;
    } catch { return seed; }
  });
  const save = useCallback((next) => {
    setData(next);
    localStorage.setItem(key, JSON.stringify(next));
  }, [key]);
  return [data, save];
}

export function AppProvider({ children }) {
  const [colaboradores, setColaboradores] = useStorage("gr_colaboradores", SEED.colaboradores);
  const [despesas, setDespesas] = useStorage("gr_despesas", SEED.despesas);
  const [fornecedores, setFornecedores] = useStorage("gr_fornecedores", SEED.fornecedores);
  const [inventario, setInventario] = useStorage("gr_inventario", SEED.inventario);
  return (
    <AppContext.Provider value={{ colaboradores, setColaboradores, despesas, setDespesas, fornecedores, setFornecedores, inventario, setInventario }}>
      {children}
    </AppContext.Provider>
  );
}
