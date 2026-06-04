import { useContext } from "react";
import { AppContext } from "../context/AppContext.js";

// Atalho para consumir o estado global em qualquer componente
export const useApp = () => useContext(AppContext);
