import api from './api';
import type { GlobalResponse } from '../types/api';

// Tipo que representa a resposta do backend (StatusRestauranteResponse.java)
export interface StatusRestaurante {
  aberto: boolean;
  mensagem: string;
}

// Tipo que representa o resumo do dashboard (DashboardResumoDTO.java)
export interface DashboardResumo {
  totalPedidosDia: number;
  receitaDiaCentavos: number;
  pedidosPorStatus: Record<string, number>;
  ticketMedioCentavos: number;
}

export const restauranteService = {
  // Busca se a loja está aberta ou fechada
  buscarStatus: () =>
    api.get<GlobalResponse<StatusRestaurante>>('/api/v1/statusRestaurante'),

  // Abre a loja
  abrir: () =>
    api.get<GlobalResponse<StatusRestaurante>>('/api/v1/abrirRestaurante'),

  // Fecha a loja
  fechar: () =>
    api.get<GlobalResponse<StatusRestaurante>>('/api/v1/fecharRestaurante'),

  // Busca o resumo do dashboard (pedidos do dia, receita, etc.)
  buscarResumo: () =>
    api.get<GlobalResponse<DashboardResumo>>('/api/v1/admin/dashboard/resumo'),
};
