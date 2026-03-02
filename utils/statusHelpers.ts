import { StatusPedido } from '../types/pedido';

export const STATUS_COLORS: Record<StatusPedido, string> = {
  RECEBIDO: '#3B82F6',
  AGUARDANDO_PAGAMENTO: '#8B5CF6',
  PREPARANDO: '#EAB308',
  SAIU_ENTREGA: '#F97316',
  ENTREGUE: '#22C55E',
  CANCELADO: '#EF4444',
};

export const STATUS_LABELS: Record<StatusPedido, string> = {
  RECEBIDO: 'Recebido',
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PREPARANDO: 'Preparando',
  SAIU_ENTREGA: 'Saiu p/ Entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const NEXT_STATUS: Partial<Record<StatusPedido, StatusPedido>> = {
  RECEBIDO: 'PREPARANDO',
  PREPARANDO: 'SAIU_ENTREGA',
  SAIU_ENTREGA: 'ENTREGUE',
};

export function getNextStatus(current: StatusPedido): StatusPedido | null {
  return NEXT_STATUS[current] ?? null;
}

export function isTerminalStatus(status: StatusPedido): boolean {
  return status === 'ENTREGUE' || status === 'CANCELADO';
}
