// Dados iniciais (carregados na primeira utilizacao)
export const SEED = {
  colaboradores: [
    { id: 1, nome: "Ana Ferreira", cargo: "Chefe de Sala", salario: 1200, admissao: "2022-03-15", ferias: "2025-08-01" },
    { id: 2, nome: "Bruno Costa", cargo: "Cozinheiro", salario: 1400, admissao: "2021-06-01", ferias: "2025-07-15" },
    { id: 3, nome: "Carla Mendes", cargo: "Empregada de Mesa", salario: 900, admissao: "2023-01-10", ferias: "2025-09-01" },
    { id: 4, nome: "David Lopes", cargo: "Barman", salario: 1050, admissao: "2022-11-20", ferias: "2025-06-20" },
  ],
  despesas: [
    { id: 1, descricao: "Renda do espaço", valor: 2800, vencimento: "2025-06-05", pago: false, fornecedor: "Imobiliária Central", categoria: "Renda" },
    { id: 2, descricao: "Fornecimento de bebidas", valor: 650, vencimento: "2025-06-10", pago: false, fornecedor: "Distribuidora Porto", categoria: "Matéria-prima" },
    { id: 3, descricao: "Electricidade", valor: 380, vencimento: "2025-06-15", pago: true, fornecedor: "EDP", categoria: "Serviços" },
    { id: 4, descricao: "Fornecimento de carne", valor: 920, vencimento: "2025-06-08", pago: false, fornecedor: "Talho Sousa", categoria: "Matéria-prima" },
    { id: 5, descricao: "Seguro multirriscos", valor: 210, vencimento: "2025-07-01", pago: false, fornecedor: "Fidelidade", categoria: "Seguros" },
    { id: 6, descricao: "Contabilidade", valor: 300, vencimento: "2025-06-30", pago: true, fornecedor: "TOC António Silva", categoria: "Serviços" },
  ],
  fornecedores: [
    { id: 1, nome: "Distribuidora Porto", categoria: "Bebidas", contacto: "222 111 333", email: "geral@distriporto.pt" },
    { id: 2, nome: "Talho Sousa", categoria: "Carnes", contacto: "912 345 678", email: "talho.sousa@gmail.com" },
    { id: 3, nome: "EDP", categoria: "Energia", contacto: "808 502 502", email: "clientes@edp.pt" },
    { id: 4, nome: "Imobiliária Central", categoria: "Imóveis", contacto: "220 123 456", email: "info@imobcentral.pt" },
    { id: 5, nome: "Fidelidade", categoria: "Seguros", contacto: "800 296 297", email: "clientes@fidelidade.pt" },
  ],
  inventario: [
    { id: 1, produto: "Frango (kg)", stock: 45, unidade: "kg", minimo: 20, origem: "Hub Central" },
    { id: 2, produto: "Arroz (kg)", stock: 80, unidade: "kg", minimo: 30, origem: "Hub Central" },
    { id: 3, produto: "Cerveja (cx)", stock: 12, unidade: "cx", minimo: 15, origem: "Hub Central" },
    { id: 4, produto: "Azeite (L)", stock: 8, unidade: "L", minimo: 10, origem: "Hub Central" },
  ],
  // Fechos de caixa diarios: dinheiro + cartao (sistema vs maquina TPA)
  fechos: [
    { id: 1, data: "2026-06-03", dinheiro: 420, cartaoSistema: 680, cartaoMaquina: 680, notas: "" },
    { id: 2, data: "2026-06-02", dinheiro: 380, cartaoSistema: 540, cartaoMaquina: 525, notas: "Diferença a verificar no TPA" },
    { id: 3, data: "2026-06-01", dinheiro: 510, cartaoSistema: 720, cartaoMaquina: 720, notas: "" },
    { id: 4, data: "2026-05-31", dinheiro: 600, cartaoSistema: 890, cartaoMaquina: 890, notas: "Sábado" },
    { id: 5, data: "2026-05-30", dinheiro: 450, cartaoSistema: 610, cartaoMaquina: 610, notas: "" },
    { id: 6, data: "2026-05-15", dinheiro: 390, cartaoSistema: 480, cartaoMaquina: 495, notas: "" },
    { id: 7, data: "2025-12-31", dinheiro: 1200, cartaoSistema: 1800, cartaoMaquina: 1800, notas: "Passagem de ano" },
    { id: 8, data: "2025-12-20", dinheiro: 700, cartaoSistema: 950, cartaoMaquina: 950, notas: "" },
  ],
};
