import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PedidoCompleto } from '../types/pedido';
import { StatusBadge } from './StatusBadge';
import { formatCentavos, formatData } from '../utils/format';

interface PedidoCardProps {
  pedido: PedidoCompleto;
  onPress: () => void;
}

export function PedidoCard({ pedido, onPress }: PedidoCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.id}>Pedido #{pedido.id}</Text>
        <StatusBadge status={pedido.status} />
      </View>
      <Text style={styles.cliente}>{pedido.cliente.nome}</Text>
      <View style={styles.footer}>
        <Text style={styles.total}>{formatCentavos(pedido.totalCentavos)}</Text>
        <Text style={styles.data}>{formatData(pedido.dataPedido)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  id: { fontSize: 16, fontWeight: 'bold', color: '#1C1917' },
  cliente: { fontSize: 14, color: '#57534E', marginBottom: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontSize: 16, fontWeight: '600', color: '#F97316' },
  data: { fontSize: 12, color: '#A8A29E' },
});
