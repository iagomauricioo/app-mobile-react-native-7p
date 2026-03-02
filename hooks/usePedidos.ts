import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';

export function usePedidos(status?: string) {
  return useQuery({
    queryKey: ['pedidos', status],
    queryFn: async () => {
      const response = await pedidoService.listar(status);
      return response.data.data;
    },
  });
}

export function useAtualizarStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      pedidoService.atualizarStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  });
}

export function useCancelarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pedidoService.cancelar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  });
}
