import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useProdutos, useToggleDisponibilidade } from '../../hooks/useProdutos';
import { ProdutoCard } from '../../components/ProdutoCard';

export default function ProdutosScreen() {
  const { data: produtos, isLoading, error, refetch } = useProdutos();
  const toggleDisponibilidade = useToggleDisponibilidade();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try { await toggleDisponibilidade.mutateAsync(id); } finally { setTogglingId(null); }
  };

  if (isLoading) return <View style={s.center}><ActivityIndicator size="large" color="#F97316" accessibilityLabel="Carregando produtos" /></View>;
  if (error) return (
    <View style={s.center}>
      <Text style={s.errorText}>Erro ao carregar produtos</Text>
      <TouchableOpacity onPress={() => refetch()} style={s.retryBtn} accessibilityRole="button" accessibilityLabel="Tentar novamente"><Text style={s.retryText} maxFontSizeMultiplier={1.5}>Tentar novamente</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <FlatList data={produtos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <ProdutoCard produto={item} onToggleDisponibilidade={() => handleToggle(item.id)} isToggling={togglingId === item.id} />} contentContainerStyle={{ padding: 16 }} ListEmptyComponent={<View style={[s.center, { paddingVertical: 48 }]}><Text style={{ color: '#78716C', fontSize: 16 }}>Nenhum produto encontrado</Text></View>} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 24 },
  errorText: { color: '#EF4444', fontSize: 16, marginBottom: 16 },
  retryBtn: { backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600' },
});
