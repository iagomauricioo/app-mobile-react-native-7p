import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produtoService } from '../services/produtoService';

export function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await produtoService.listar();
      return response.data.data;
    },
  });
}

export function useToggleDisponibilidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => produtoService.toggleDisponibilidade(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['produtos'] }),
  });
}
