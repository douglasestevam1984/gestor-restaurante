import { createContext } from "react";

// Objeto Context partilhado (sem componentes nem hooks aqui,
// para nao quebrar o Fast Refresh do Vite)
export const AppContext = createContext(null);
