import { View, Text } from 'react-native';
import { StatusPedido } from '../types/pedido';
import { ACCESSIBLE_STATUS_COLORS, STATUS_LABELS } from '../utils/statusHelpers';

interface StatusBadgeProps {
  status: StatusPedido;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = ACCESSIBLE_STATUS_COLORS[status];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${STATUS_LABELS[status]}`}
      style={{ backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}
    >
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }} maxFontSizeMultiplier={1.5}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}
