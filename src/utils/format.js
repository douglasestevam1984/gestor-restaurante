// Funcoes utilitarias partilhadas
export const fmt = (v) => `€${Number(v).toLocaleString("pt-PT", { minimumFractionDigits: 0 })}`;
export const diasAte = (date) => Math.ceil((new Date(date) - new Date()) / 86400000);
export const hoje = () => new Date().toISOString().split("T")[0];
export const id = () => Date.now();
