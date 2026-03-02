import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restauranteService } from '../services/restauranteService';

export function useBuscarStatus() {
    return useQuery({
        queryKey: ['statusRestaurante'],
        queryFn: async () => {
            const response = await restauranteService.buscarStatus();
            return response.data.data;
        }
    })
}

export function useBuscarResumo() {
    return useQuery({
        queryKey: ['dashboardResumo'],
        queryFn: async () => {
            const response = await restauranteService.buscarResumo();
            return response.data.data;
        }
        
    })
}

export function useAlternarStatusRestaurante() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (abrir: boolean) => abrir ? restauranteService.abrir() : restauranteService.fechar(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['statusRestaurante'] }),
    });
}