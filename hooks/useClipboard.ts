import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Alert, Platform, ToastAndroid } from 'react-native';

export function useClipboard() {
  const copiar = useCallback(async (texto: string, label?: string) => {
    await Clipboard.setStringAsync(texto);
    const msg = label ? `${label} copiado!` : 'Copiado!';

    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      // iOS não tem ToastAndroid, usa Alert discreto
      Alert.alert('', msg);
    }
  }, []);

  return { copiar };
}
