import api from './api';
import type { GlobalResponse } from '../types/api';
import type { Cupom, CriarCupomRequest } from '../types/cupom';

export const cupomService = {
  listar: () => api.get<GlobalResponse<Cupom[]>>('/api/v1/admin/cupons'),
  criar: (data: CriarCupomRequest) =>
    api.post<GlobalResponse<Cupom>>('/api/v1/admin/cupons', data),
  alterarStatus: (id: number, ativo: boolean) =>
    api.patch<GlobalResponse<Cupom>>(`/api/v1/admin/cupons/${id}/status`, { ativo }),
};
