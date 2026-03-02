import api from './api';
import type { GlobalResponse } from '../types/api';
import type { PedidoCompleto } from '../types/pedido';

export const pedidoService = {
  listar: (status?: string) =>
    api.get<GlobalResponse<PedidoCompleto[]>>('/api/v1/admin/pedidos', { params: { status } }),
  atualizarStatus: (id: number, status: string) =>
    api.patch<GlobalResponse<void>>(`/api/v1/admin/pedidos/${id}/status`, { status }),
  cancelar: (id: number) =>
    api.patch<GlobalResponse<void>>(`/api/v1/admin/pedidos/${id}/cancelar`),
};
