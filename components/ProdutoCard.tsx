import { useState } from 'react';
import { View, Text, Image, Switch, StyleSheet } from 'react-native';
import { Produto, Variacao } from '../types/produto';
import { formatCentavos } from '../utils/format';

interface ProdutoCardProps {
  produto: Produto;
  onToggleDisponibilidade: () => void;
  isToggling: boolean;
}

export function ProdutoCard({ produto, onToggleDisponibilidade, isToggling }: ProdutoCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {imageError || !produto.imagemUrl ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sem foto</Text>
          </View>
        ) : (
          <Image
            source={{ uri: produto.imagemUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{produto.nome}</Text>
            <Switch
              value={produto.disponivel}
              onValueChange={onToggleDisponibilidade}
              disabled={isToggling}
              trackColor={{ false: '#D1D5DB', true: '#FDBA74' }}
              thumbColor={produto.disponivel ? '#F97316' : '#9CA3AF'}
            />
          </View>
          {produto.descricao ? (
            <Text style={styles.desc} numberOfLines={2}>{produto.descricao}</Text>
          ) : null}
        </View>
      </View>
      {produto.variacoes.length > 0 && (
        <View style={styles.variacoes}>
          {produto.variacoes.map((v: Variacao) => (
            <View key={v.id} style={styles.varRow}>
              <Text style={styles.varName}>{v.nomeTamanho} ({v.tamanhoMl}ml)</Text>
              <Text style={styles.varPrice}>{formatCentavos(v.precoCentavos)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  row: { flexDirection: 'row' },
  placeholder: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#E7E5E4', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#A8A29E', fontSize: 12 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1C1917', flexShrink: 1 },
  desc: { fontSize: 12, color: '#A8A29E', marginTop: 4 },
  variacoes: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  varRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  varName: { fontSize: 12, color: '#78716C' },
  varPrice: { fontSize: 12, fontWeight: '600', color: '#F97316' },
});
