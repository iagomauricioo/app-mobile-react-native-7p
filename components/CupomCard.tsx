import { View, Text, Switch, StyleSheet } from 'react-native';
import type { Cupom } from '../types/cupom';
import { formatCentavos, formatData } from '../utils/format';
import { gerarRotuloCupom } from '../utils/accessibility';

interface CupomCardProps {
  cupom: Cupom;
  onToggleAtivo: () => void;
  isToggling: boolean;
}

export function CupomCard({ cupom, onToggleAtivo, isToggling }: CupomCardProps) {
  const tipoLabel = cupom.tipoDesconto === 'PERCENTUAL' ? 'Percentual' : 'Valor Fixo';
  const valorLabel =
    cupom.tipoDesconto === 'PERCENTUAL'
      ? `${cupom.valorDesconto}%`
      : formatCentavos(cupom.valorDesconto);

  return (
    <View style={styles.card} accessible={true} accessibilityLabel={gerarRotuloCupom(cupom)}>
      <View style={styles.header}>
        <Text style={styles.codigo}>{cupom.codigo}</Text>
        <Switch
          value={cupom.ativo}
          onValueChange={onToggleAtivo}
          disabled={isToggling}
          trackColor={{ false: '#D1D5DB', true: '#FDBA74' }}
          thumbColor={cupom.ativo ? '#F97316' : '#9CA3AF'}
          accessibilityLabel={`Cupom ${cupom.codigo}, ${cupom.ativo ? 'ativo' : 'inativo'}`}
          accessibilityRole="switch"
        />
      </View>
      <View style={styles.badges}>
        <View style={styles.tipoBadge}>
          <Text style={styles.tipoText}>{tipoLabel}</Text>
        </View>
        <Text style={styles.valor}>{valorLabel}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Validade: {formatData(cupom.dataInicio)} — {formatData(cupom.dataFim)}
        </Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>
          {cupom.quantidadeUsos}/{cupom.limiteUsos} usos
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  codigo: { fontSize: 16, fontWeight: 'bold', color: '#1C1917', textTransform: 'uppercase' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tipoBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tipoText: { fontSize: 12, fontWeight: '500', color: '#C2410C' },
  valor: { fontSize: 14, fontWeight: '600', color: '#F97316' },
  footer: { borderTopWidth: 1, borderTopColor: '#F5F5F4', paddingTop: 8, marginTop: 4 },
  footerText: { fontSize: 12, color: '#78716C' },
});
