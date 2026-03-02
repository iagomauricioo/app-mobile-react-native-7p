import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cupomService } from '../services/cupomService';
import type { CriarCupomRequest } from '../types/cupom';

export function useCupons() {
  return useQuery({
    queryKey: ['cupons'],
    queryFn: async () => {
      const response = await cupomService.listar();
      return response.data.data;
    },
  });
}

export function useCriarCupom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CriarCupomRequest) => cupomService.criar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cupons'] }),
  });
}

export function useAlterarStatusCupom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) =>
      cupomService.alterarStatus(id, ativo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cupons'] }),
  });
}
