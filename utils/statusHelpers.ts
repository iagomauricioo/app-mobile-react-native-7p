import { StatusPedido } from '../types/pedido';

export interface StatusColorConfig {
  background: string;
  text: string;
}

export type AccessibleStatusColors = Record<StatusPedido, StatusColorConfig>;

/** @deprecated Use ACCESSIBLE_STATUS_COLORS para garantir contraste WCAG AA (4.5:1). */
export const STATUS_COLORS: Record<StatusPedido, string> = {
  RECEBIDO: '#3B82F6',
  AGUARDANDO_PAGAMENTO: '#8B5CF6',
  PREPARANDO: '#EAB308',
  SAIU_ENTREGA: '#F97316',
  ENTREGUE: '#22C55E',
  CANCELADO: '#EF4444',
};

export const ACCESSIBLE_STATUS_COLORS: AccessibleStatusColors = {
  RECEBIDO: { background: '#2563EB', text: '#FFFFFF' },
  AGUARDANDO_PAGAMENTO: { background: '#7C3AED', text: '#FFFFFF' },
  PREPARANDO: { background: '#FEF9C3', text: '#422006' },
  SAIU_ENTREGA: { background: '#C2410C', text: '#FFFFFF' },
  ENTREGUE: { background: '#15803D', text: '#FFFFFF' },
  CANCELADO: { background: '#B91C1C', text: '#FFFFFF' },
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
