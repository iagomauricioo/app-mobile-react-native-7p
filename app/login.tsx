import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';
import { biometricService } from '../services/biometricService';
import { isTokenValid } from '../utils/jwt';

export default function LoginScreen() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricVisible, setBiometricVisible] = useState(false);
  const storeLogin = useAuthStore((s) => s.login);

  // Checa se biometria tá disponível e habilitada — nunca bloqueia nada
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const available = await biometricService.isAvailable();
        if (!available || cancelled) return;
        const enabled = await biometricService.isEnabled();
        if (!cancelled && enabled) {
          setBiometricVisible(true);
        }
      } catch { /* ignora */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Login com senha — fluxo principal, nunca bloqueado por biometria
  const handleLogin = async () => {
    console.log('[LOGIN] handleLogin chamado');
    setError('');
    if (!login.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login(login.trim(), password);
      const token = response.data.data.token;
      console.log('[LOGIN] token recebido');

      // Salva token e redireciona PRIMEIRO
      storeLogin(token);

      // Depois oferece biometria (fire-and-forget, não bloqueia)
      offerBiometric(token);
    } catch (err: any) {
      console.log('[LOGIN] ERRO:', err?.message);
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  // Oferece ativar biometria — roda depois do login, nunca bloqueia
  const offerBiometric = async (token: string) => {
    try {
      const available = await biometricService.isAvailable();
      const enabled = await biometricService.isEnabled();
      if (available && !enabled) {
        Alert.alert(
          'Acesso rápido',
          'Deseja usar biometria para entrar na próxima vez?',
          [
            { text: 'Agora não', style: 'cancel' },
            { text: 'Ativar', onPress: () => biometricService.enable(token).catch(() => {}) },
          ],
        );
      } else if (enabled) {
        biometricService.updateToken(token).catch(() => {});
      }
    } catch { /* ignora */ }
  };

  // Login com biometria — fluxo alternativo
  const handleBiometricLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const token = await biometricService.authenticate();
      if (token && isTokenValid(token)) {
        storeLogin(token);
      } else if (token) {
        setError('Sessão expirada. Faça login com senha.');
        biometricService.disable().catch(() => {});
        setBiometricVisible(false);
      }
      // null = usuário cancelou, sem erro
    } catch {
      setError('Erro na autenticação biométrica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.inner}>
        <Text style={s.title} accessibilityRole="header" accessibilityLabel="Caldos e Sopas CG">🍲 Caldos e Sopas CG</Text>
        <Text style={s.subtitle}>Painel Administrativo</Text>
        <View style={s.card}>
          <Text style={s.cardTitle}>Entrar</Text>
          <Text style={s.label}>Login</Text>
          <TextInput style={s.input} placeholder="Seu usuário" placeholderTextColor="#a8a29e" value={login} onChangeText={setLogin} autoCapitalize="none" autoCorrect={false} editable={!loading} accessibilityLabel="Login" />
          <Text style={s.label}>Senha</Text>
          <TextInput style={s.input} placeholder="Sua senha" placeholderTextColor="#a8a29e" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} accessibilityLabel="Senha" />
          {error ? <Text style={s.error} accessibilityLiveRegion="polite">{error}</Text> : null}
          <TouchableOpacity style={[s.button, loading && s.buttonDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Entrar">
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText} maxFontSizeMultiplier={1.5}>Entrar</Text>}
          </TouchableOpacity>

          {biometricVisible && (
            <TouchableOpacity
              style={s.biometricButton}
              onPress={handleBiometricLogin}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Entrar com biometria"
            >
              <Ionicons name="finger-print-outline" size={28} color="#F97316" />
              <Text style={s.biometricText}>Entrar com biometria</Text>
            </TouchableOpacity>
          )}
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
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 10,
  },
  biometricText: { fontSize: 15, fontWeight: '500', color: '#F97316' },
});
