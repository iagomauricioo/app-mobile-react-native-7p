import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { criarCupomSchema } from '../utils/validations';
import type { CriarCupomRequest, TipoDesconto } from '../types/cupom';

interface CriarCupomFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CriarCupomRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function CriarCupomForm({ visible, onClose, onSubmit, isSubmitting }: CriarCupomFormProps) {
  const [codigo, setCodigo] = useState('');
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto>('PERCENTUAL');
  const [valorDesconto, setValorDesconto] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [limiteUsos, setLimiteUsos] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setCodigo('');
    setTipoDesconto('PERCENTUAL');
    setValorDesconto('');
    setDataInicio('');
    setDataFim('');
    setLimiteUsos('');
    setErrors({});
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async () => {
    const formData = {
      codigo: codigo.toUpperCase(),
      tipoDesconto,
      valorDesconto: Number(valorDesconto) || 0,
      dataInicio,
      dataFim,
      limiteUsos: Number(limiteUsos) || 0,
    };
    const result = criarCupomSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString();
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await onSubmit(result.data);
    resetForm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Novo Cupom">Novo Cupom</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Código</Text>
              <TextInput style={styles.input} value={codigo} onChangeText={(t) => setCodigo(t.toUpperCase())} placeholder="EX: PROMO10" autoCapitalize="characters" accessibilityLabel="Código do cupom" />
              {errors.codigo ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.codigo}</Text> : <View style={{ height: 12 }} />}

              <Text style={styles.label}>Tipo de Desconto</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity onPress={() => setTipoDesconto('PERCENTUAL')} style={[styles.typeBtn, tipoDesconto === 'PERCENTUAL' && styles.typeBtnActive]} accessibilityRole="button" accessibilityState={{ selected: tipoDesconto === 'PERCENTUAL' }}>
                  <Text style={[styles.typeText, tipoDesconto === 'PERCENTUAL' && styles.typeTextActive]} maxFontSizeMultiplier={1.5}>Percentual</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTipoDesconto('VALOR_FIXO')} style={[styles.typeBtn, tipoDesconto === 'VALOR_FIXO' && styles.typeBtnActive]} accessibilityRole="button" accessibilityState={{ selected: tipoDesconto === 'VALOR_FIXO' }}>
                  <Text style={[styles.typeText, tipoDesconto === 'VALOR_FIXO' && styles.typeTextActive]} maxFontSizeMultiplier={1.5}>Valor Fixo</Text>
                </TouchableOpacity>
              </View>
              {errors.tipoDesconto ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.tipoDesconto}</Text> : <View style={{ height: 12 }} />}

              <Text style={styles.label}>Valor do Desconto</Text>
              <TextInput style={styles.input} value={valorDesconto} onChangeText={setValorDesconto} placeholder={tipoDesconto === 'PERCENTUAL' ? 'Ex: 10' : 'Ex: 500 (centavos)'} keyboardType="numeric" accessibilityLabel="Valor do desconto" />
              {errors.valorDesconto ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.valorDesconto}</Text> : <View style={{ height: 12 }} />}

              <Text style={styles.label}>Data de Início</Text>
              <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="AAAA-MM-DD" accessibilityLabel="Data de início" />
              {errors.dataInicio ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.dataInicio}</Text> : <View style={{ height: 12 }} />}

              <Text style={styles.label}>Data de Fim</Text>
              <TextInput style={styles.input} value={dataFim} onChangeText={setDataFim} placeholder="AAAA-MM-DD" accessibilityLabel="Data de fim" />
              {errors.dataFim ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.dataFim}</Text> : <View style={{ height: 12 }} />}

              <Text style={styles.label}>Limite de Usos</Text>
              <TextInput style={styles.input} value={limiteUsos} onChangeText={setLimiteUsos} placeholder="Ex: 100" keyboardType="numeric" accessibilityLabel="Limite de usos" />
              {errors.limiteUsos ? <Text style={styles.error} accessibilityLiveRegion="polite">{errors.limiteUsos}</Text> : <View style={{ height: 12 }} />}
            </ScrollView>

            <View style={styles.btnRow}>
              <TouchableOpacity onPress={handleClose} disabled={isSubmitting} style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel="Cancelar">
                <Text style={styles.cancelText} maxFontSizeMultiplier={1.5}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={styles.submitBtn} accessibilityRole="button" accessibilityLabel="Criar Cupom">
                {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitText} maxFontSizeMultiplier={1.5}>Criar Cupom</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '85%' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1C1917', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#44403C', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D6D3D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1C1917', marginBottom: 4 },
  error: { color: '#EF4444', fontSize: 12, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#F5F5F4' },
  typeBtnActive: { backgroundColor: '#F97316' },
  typeText: { fontSize: 14, fontWeight: '500', color: '#57534E' },
  typeTextActive: { color: '#fff' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F5F5F4', alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '500', color: '#57534E' },
  submitBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F97316', alignItems: 'center' },
  submitText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
