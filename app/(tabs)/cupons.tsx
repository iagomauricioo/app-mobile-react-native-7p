import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useCupons, useCriarCupom, useAlterarStatusCupom } from '../../hooks/useCupons';
import { CupomCard } from '../../components/CupomCard';
import { CriarCupomForm } from '../../components/CriarCupomForm';
import type { CriarCupomRequest } from '../../types/cupom';

export default function CuponsScreen() {
  const { data: cupons, isLoading, error, refetch } = useCupons();
  const criarCupom = useCriarCupom();
  const alterarStatus = useAlterarStatusCupom();
  const [modalVisible, setModalVisible] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggleAtivo = async (id: number, ativo: boolean) => {
    setTogglingId(id);
    try { await alterarStatus.mutateAsync({ id, ativo: !ativo }); }
    catch (err: any) { Alert.alert('Erro', err.message || 'Erro ao alterar status do cupom'); }
    finally { setTogglingId(null); }
  };

  const handleCriarCupom = async (data: CriarCupomRequest) => {
    try { await criarCupom.mutateAsync(data); setModalVisible(false); }
    catch (err: any) { Alert.alert('Erro', err.message || 'Erro ao criar cupom'); }
  };

  if (isLoading) return <View style={s.center}><ActivityIndicator size="large" color="#F97316" accessibilityLabel="Carregando cupons" /></View>;
  if (error) return (
    <View style={s.center}>
      <Text style={s.errorText}>Erro ao carregar cupons</Text>
      <TouchableOpacity onPress={() => refetch()} style={s.retryBtn} accessibilityRole="button" accessibilityLabel="Tentar novamente"><Text style={s.retryText} maxFontSizeMultiplier={1.5}>Tentar novamente</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <FlatList data={cupons} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <CupomCard cupom={item} onToggleAtivo={() => handleToggleAtivo(item.id, item.ativo)} isToggling={togglingId === item.id} />} contentContainerStyle={{ padding: 16 }} ListEmptyComponent={<View style={[s.center, { paddingVertical: 48 }]}><Text style={{ color: '#78716C', fontSize: 16 }}>Nenhum cupom encontrado</Text></View>} />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={s.fab} accessibilityLabel="Criar novo cupom" accessibilityRole="button" accessibilityHint="Toque duas vezes para abrir formulário de novo cupom"><Text style={s.fabText}>+</Text></TouchableOpacity>
      <CriarCupomForm visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleCriarCupom} isSubmitting={criarCupom.isPending} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 24 },
  errorText: { color: '#EF4444', fontSize: 16, marginBottom: 16 },
  retryBtn: { backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600' },
  fab: { position: 'absolute', bottom: 80, right: 24, backgroundColor: '#F97316', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300' },
});
