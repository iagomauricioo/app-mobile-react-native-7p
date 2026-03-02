import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePedidos } from '../../hooks/usePedidos';
import { PedidoCard } from '../../components/PedidoCard';

const FILTER_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Recebido', value: 'RECEBIDO' },
  { label: 'Preparando', value: 'PREPARANDO' },
  { label: 'Saiu p/ Entrega', value: 'SAIU_ENTREGA' },
  { label: 'Entregue', value: 'ENTREGUE' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

export default function PedidosScreen() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data: pedidos, isLoading, error, refetch } = usePedidos(statusFilter);
  const router = useRouter();

  return (
    <View style={s.container}>
      <View style={s.filterBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterBarContent}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} onPress={() => setStatusFilter(opt.value)} style={[s.chip, statusFilter === opt.value && s.chipActive]}>
              <Text style={[s.chipText, statusFilter === opt.value && s.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={s.center}><ActivityIndicator size="large" color="#F97316" /></View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>Erro ao carregar pedidos</Text>
          <TouchableOpacity onPress={() => refetch()} style={s.retryBtn}><Text style={s.retryText}>Tentar novamente</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList data={pedidos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <PedidoCard pedido={item} onPress={() => router.push(`/pedido/${item.id}`)} />} contentContainerStyle={{ padding: 16 }} ListEmptyComponent={<View style={[s.center, { paddingVertical: 48 }]}><Text style={{ color: '#A8A29E', fontSize: 16 }}>Nenhum pedido encontrado</Text></View>} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  filterBarWrapper: { paddingHorizontal: 16, paddingVertical: 12 },
  filterBarContent: { alignItems: 'center', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#F97316' },
  chipText: { fontSize: 14, fontWeight: '500', color: '#57534E' },
  chipTextActive: { color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  errorText: { color: '#EF4444', fontSize: 16, marginBottom: 16 },
  retryBtn: { backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600' },
});
