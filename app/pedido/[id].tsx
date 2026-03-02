import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePedidos, useAtualizarStatus, useCancelarPedido } from '../../hooks/usePedidos';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCentavos, formatTelefone, formatData } from '../../utils/format';
import { getNextStatus, isTerminalStatus, STATUS_LABELS } from '../../utils/statusHelpers';
import { PedidoCompleto, ItemPedido } from '../../types/pedido';
import { Ionicons } from '@expo/vector-icons';

const FORMA_PAG: Record<string, string> = { PIX: 'PIX', CREDIT_CARD: 'Cartão de Crédito' };
const STATUS_PAG: Record<string, string> = { PENDENTE: 'Pendente', APROVADO: 'Aprovado', REJEITADO: 'Rejeitado', CANCELADO: 'Cancelado', ESTORNADO: 'Estornado', EXPIRADO: 'Expirado' };

function Section({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={st.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
        <Ionicons name={icon} size={18} color="#F97316" />
        <Text style={[st.sectionTitle, { marginBottom: 0 }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ItemRow({ item }: { item: ItemPedido }) {
  return (
    <View style={st.itemRow}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={st.itemName}>{item.nomeProduto}</Text>
        <Text style={st.itemDetail}>{item.tamanhoMl} · Qtd: {item.quantidade}</Text>
      </View>
      <Text style={st.itemPrice}>{formatCentavos(item.precoUnitarioCentavos * item.quantidade)}</Text>
    </View>
  );
}

export default function PedidoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pedidos, isLoading } = usePedidos();
  const atualizarStatus = useAtualizarStatus();
  const cancelarPedido = useCancelarPedido();
  const pedido = pedidos?.find((p: PedidoCompleto) => p.id === Number(id));
  const isMutating = atualizarStatus.isPending || cancelarPedido.isPending;

  if (isLoading) return <View style={st.loading}><ActivityIndicator size="large" color="#F97316" /></View>;
  if (!pedido) return <View style={st.loading}><Text style={{ color: '#78716C', fontSize: 16 }}>Pedido não encontrado</Text></View>;

  const nextStatus = getNextStatus(pedido.status);
  const terminal = isTerminalStatus(pedido.status);
  const desc = Math.max(0, pedido.subTotalCentavos + pedido.taxaEntregaCentavos - pedido.totalCentavos);

  const handleAvancar = () => {
    if (!nextStatus) return;
    Alert.alert('Avançar Status', `Deseja avançar para "${STATUS_LABELS[nextStatus]}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: async () => { try { await atualizarStatus.mutateAsync({ id: pedido.id, status: nextStatus }); } catch (e: any) { Alert.alert('Erro', e.message); } } },
    ]);
  };

  const handleCancelar = () => {
    Alert.alert('Cancelar Pedido', 'Tem certeza?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', style: 'destructive', onPress: async () => { try { await cancelarPedido.mutateAsync(pedido.id); } catch (e: any) { Alert.alert('Erro', e.message); } } },
    ]);
  };

  return (
    <View style={st.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={st.header}>
          <View>
            <Text style={st.headerTitle}>Pedido #{pedido.id}</Text>
            <Text style={st.headerDate}>{formatData(pedido.dataPedido)}</Text>
          </View>
          <StatusBadge status={pedido.status} />
        </View>
        <Section title="Itens" icon="cart-outline">{pedido.itens.map((i: ItemPedido) => <ItemRow key={i.id} item={i} />)}</Section>
        <Section title="Cliente" icon="person-outline">
          <Text style={st.info}>{pedido.cliente.nome}</Text>
          <Text style={st.infoSub}>{formatTelefone(pedido.cliente.telefone)}</Text>
        </Section>
        <Section title="Endereço" icon="location-outline">
          <Text style={st.info}>{pedido.endereco.rua}, {pedido.endereco.numero}</Text>
          <Text style={st.info}>{pedido.endereco.bairro}</Text>
          {pedido.endereco.complemento ? <Text style={[st.infoSub, { color: '#A8A29E' }]}>{pedido.endereco.complemento}</Text> : null}
        </Section>
        <Section title="Pagamento" icon="card-outline">
          <View style={st.row}><Text style={st.infoSub}>Forma</Text><Text style={st.info}>{FORMA_PAG[pedido.formaPagamento] ?? pedido.formaPagamento}</Text></View>
          <View style={[st.row, { marginTop: 8 }]}><Text style={st.infoSub}>Status</Text><Text style={st.info}>{STATUS_PAG[pedido.pagamentoStatus] ?? pedido.pagamentoStatus}</Text></View>
        </Section>
        <Section title="Valores" icon="cash-outline">
          <View style={[st.row, { marginBottom: 4 }]}><Text style={st.infoSub}>Subtotal</Text><Text style={st.info}>{formatCentavos(pedido.subTotalCentavos)}</Text></View>
          <View style={[st.row, { marginBottom: 4 }]}><Text style={st.infoSub}>Taxa de Entrega</Text><Text style={st.info}>{formatCentavos(pedido.taxaEntregaCentavos)}</Text></View>
          {desc > 0 && <View style={[st.row, { marginBottom: 4 }]}><Text style={{ fontSize: 14, color: '#16A34A' }}>Desconto</Text><Text style={{ fontSize: 14, color: '#16A34A' }}>-{formatCentavos(desc)}</Text></View>}
          <View style={st.totalRow}><Text style={st.totalLabel}>Total</Text><Text style={st.totalValue}>{formatCentavos(pedido.totalCentavos)}</Text></View>
        </Section>
        {pedido.observacoes ? <Section title="Observações" icon="chatbubble-outline"><Text style={{ fontSize: 14, color: '#57534E' }}>{pedido.observacoes}</Text></Section> : null}
        <View style={{ marginTop: 8 }}>
          {nextStatus && !terminal && (
            <TouchableOpacity style={[st.advBtn, isMutating && { backgroundColor: '#FDBA74' }]} onPress={handleAvancar} disabled={isMutating} activeOpacity={0.8}>
              {atualizarStatus.isPending ? <ActivityIndicator color="#fff" /> : <Text style={st.advText}>Avançar para {STATUS_LABELS[nextStatus]}</Text>}
            </TouchableOpacity>
          )}
          {!terminal && (
            <TouchableOpacity style={[st.cancelBtn, isMutating && { borderColor: '#FECACA' }]} onPress={handleCancelar} disabled={isMutating} activeOpacity={0.8}>
              {cancelarPedido.isPending ? <ActivityIndicator color="#EF4444" /> : <Text style={[st.cancelText, isMutating && { color: '#FCA5A5' }]}>Cancelar Pedido</Text>}
            </TouchableOpacity>
          )}
          {terminal && <View style={st.termBadge}><Text style={st.termText}>Pedido {STATUS_LABELS[pedido.status].toLowerCase()} — sem ações</Text></View>}
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1917' },
  headerDate: { fontSize: 12, color: '#A8A29E', marginTop: 4 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1917', marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  itemName: { fontSize: 14, fontWeight: '500', color: '#44403C' },
  itemDetail: { fontSize: 12, color: '#A8A29E' },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#F97316' },
  info: { fontSize: 14, color: '#44403C' },
  infoSub: { fontSize: 14, color: '#78716C', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E7E5E4', marginTop: 8, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1C1917' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#F97316' },
  advBtn: { backgroundColor: '#F97316', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  advText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  cancelText: { fontWeight: '600', fontSize: 16, color: '#EF4444' },
  termBadge: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', backgroundColor: '#F5F5F4' },
  termText: { color: '#A8A29E', fontWeight: '500', fontSize: 14 },
});
