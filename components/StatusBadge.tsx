import { View, Text } from 'react-native';
import { StatusPedido } from '../types/pedido';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/statusHelpers';

interface StatusBadgeProps {
  status: StatusPedido;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={{ backgroundColor: STATUS_COLORS[status], borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}
