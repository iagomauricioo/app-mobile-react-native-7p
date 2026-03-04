import { Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';

function TabIconWithDivider({ name, color, size, showDivider }: { name: keyof typeof Ionicons.glyphMap; color: string; size: number; showDivider: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name={name} size={size} color={color} />
      {showDivider && (
        <View style={{ position: 'absolute', right: -27, height: 24, width: 1, backgroundColor: '#E7E5E4' }} importantForAccessibility="no" accessibilityElementsHidden={true} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#A8A29E',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
        tabBarItemStyle: { paddingVertical: 6 },
        tabBarStyle: {
          position: 'absolute',
          bottom: 23,
          marginHorizontal: 30,
          height: 64,
          borderRadius: 50,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
        },
        headerStyle: { backgroundColor: '#FFF7ED' },
        headerTintColor: '#1C1917',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitle: 'Caldos e Sopas CG',
        headerRight: () => (
          <TouchableOpacity onPress={() => useAuthStore.getState().logout()} style={{ marginRight: 16 }} accessibilityLabel="Sair da conta" accessibilityRole="button">
            <Ionicons name="log-out-outline" size={24} color="#F97316" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size, focused }) => <TabIconWithDivider name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={size} showDivider /> }} />
      <Tabs.Screen name="pedidos" options={{ title: 'Pedidos', tabBarIcon: ({ color, size, focused }) => <TabIconWithDivider name={focused ? 'receipt' : 'receipt-outline'} color={color} size={size} showDivider /> }} />
      <Tabs.Screen name="produtos" options={{ title: 'Produtos', tabBarIcon: ({ color, size, focused }) => <TabIconWithDivider name={focused ? 'fast-food' : 'fast-food-outline'} color={color} size={size} showDivider /> }} />
      <Tabs.Screen name="cupons" options={{ title: 'Cupons', tabBarIcon: ({ color, size, focused }) => <TabIconWithDivider name={focused ? 'pricetag' : 'pricetag-outline'} color={color} size={size} showDivider={false} /> }} />
    </Tabs>
  );
}
