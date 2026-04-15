import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'caldos-admin-token';
const BIOMETRIC_ENABLED_KEY = 'caldos-admin-biometric-enabled';

export const biometricService = {
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  },

  async isEnabled(): Promise<boolean> {
    try {
      const val = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async enable(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
  },

  async disable(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');
  },

  async authenticate(): Promise<string | null> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para entrar',
      cancelLabel: 'Usar senha',
      disableDeviceFallback: false,
    });
    if (!result.success) return null;
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async updateToken(token: string): Promise<void> {
    const enabled = await this.isEnabled();
    if (enabled) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },
};
