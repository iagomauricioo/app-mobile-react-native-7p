import api from './api';
import type { GlobalResponse } from '../types/api';
import type { Produto } from '../types/produto';

export const produtoService = {
  listar: () => api.get<GlobalResponse<Produto[]>>('/api/v1/produtos'),
  toggleDisponibilidade: (id: number) =>
    api.patch<GlobalResponse<Produto>>(`/api/v1/admin/produtos/${id}/disponibilidade`),
};
