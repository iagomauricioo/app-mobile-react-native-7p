import { View, Text, ScrollView, Switch, ActivityIndicator, StyleSheet } from 'react-native';
import { useBuscarStatus, useBuscarResumo, useAlternarStatusRestaurante } from '../../hooks/useDashboard';

const formatarReais = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DashboardScreen() {
  const { data: status, isLoading: loadingStatus } = useBuscarStatus();
  const { data: resumo, isLoading: loadingResumo } = useBuscarResumo();
  const alternarStatus = useAlternarStatusRestaurante();

  if (loadingStatus || loadingResumo) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#F97316" accessibilityLabel="Carregando dados do painel" />
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      {/* Toggle abrir/fechar loja */}
      <View style={s.card}>
        <View style={s.statusRow}>
          <View>
            <Text style={s.cardLabel}>Status da Loja</Text>
            <Text style={[s.statusText, { color: status?.aberto ? '#22C55E' : '#EF4444' }]}>
              {status?.aberto ? 'Aberta' : 'Fechada'}
            </Text>
          </View>
          <Switch
            value={status?.aberto ?? false}
            onValueChange={(value) => alternarStatus.mutate(value)}
            disabled={alternarStatus.isPending}
            trackColor={{ false: '#D6D3D1', true: '#86EFAC' }}
            thumbColor={status?.aberto ? '#22C55E' : '#A8A29E'}
            accessibilityLabel={`Status da loja, ${status?.aberto ? 'aberta' : 'fechada'}`}
            accessibilityRole="switch"
          />
        </View>
      </View>

      {/* Cards de resumo */}
      <Text style={s.sectionTitle} accessibilityRole="header">Resumo do Dia</Text>
      <View style={s.row}>
        <View style={[s.card, s.halfCard]}>
          <Text style={s.cardLabel}>Pedidos</Text>
          <Text style={s.cardValue}>{resumo?.totalPedidosDia ?? 0}</Text>
        </View>
        <View style={[s.card, s.halfCard]}>
          <Text style={s.cardLabel}>Receita</Text>
          <Text style={s.cardValue}>{formatarReais(resumo?.receitaDiaCentavos ?? 0)}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>Ticket Médio</Text>
        <Text style={s.cardValue}>{formatarReais(resumo?.ticketMedioCentavos ?? 0)}</Text>
      </View>

      {/* Pedidos por status */}
      {resumo?.pedidosPorStatus && Object.keys(resumo.pedidosPorStatus).length > 0 && (
        <>
          <Text style={s.sectionTitle} accessibilityRole="header">Pedidos por Status</Text>
          <View style={s.card}>
            {Object.entries(resumo.pedidosPorStatus).map(([statusName, count]) => (
              <View key={statusName} style={s.statusItem}>
                <Text style={s.statusLabel}>{statusName.replace('_', ' ')}</Text>
                <Text style={s.statusCount}>{count}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}


const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  halfCard: { flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917', marginTop: 8, marginBottom: 12 },
  cardLabel: { fontSize: 13, color: '#78716C', fontWeight: '500', marginBottom: 4 },
  cardValue: { fontSize: 24, fontWeight: '700', color: '#1C1917' },
  statusText: { fontSize: 18, fontWeight: '700' },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  statusLabel: { fontSize: 14, color: '#57534E', textTransform: 'capitalize' },
  statusCount: { fontSize: 14, fontWeight: '700', color: '#F97316' },
});
