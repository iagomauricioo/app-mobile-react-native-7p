import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';

export default function LoginScreen() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const storeLogin = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    setError('');
    if (!login.trim() || !password.trim()) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const response = await authService.login(login.trim(), password);
      storeLogin(response.data.data.token);
    } catch { setError('Usuário ou senha inválidos'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.inner}>
        <Text style={s.title}>🍲 Caldos e Sopas CG</Text>
        <Text style={s.subtitle}>Painel Administrativo</Text>
        <View style={s.card}>
          <Text style={s.cardTitle}>Entrar</Text>
          <Text style={s.label}>Login</Text>
          <TextInput style={s.input} placeholder="Seu usuário" placeholderTextColor="#a8a29e" value={login} onChangeText={setLogin} autoCapitalize="none" autoCorrect={false} editable={!loading} />
          <Text style={s.label}>Senha</Text>
          <TextInput style={s.input} placeholder="Sua senha" placeholderTextColor="#a8a29e" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
          {error ? <Text style={s.error}>{error}</Text> : null}
          <TouchableOpacity style={[s.button, loading && s.buttonDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Entrar</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F97316', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#78716C', marginBottom: 32 },
  card: { width: '100%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#1C1917', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '500', color: '#57534E', marginBottom: 4 },
  input: { width: '100%', borderWidth: 1, borderColor: '#D6D3D1', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1C1917', backgroundColor: '#FAFAF9', marginBottom: 16 },
  error: { color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  button: { width: '100%', backgroundColor: '#F97316', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#FDBA74' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
