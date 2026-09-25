import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesScreen from '../screens/SalesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MoreScreen from '../screens/MoreScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import PurchasesScreen from '../screens/PurchasesScreen';
import BackupScreen from '../screens/BackupScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import InvestorsScreen from '../screens/InvestorsScreen';
import LoansScreen from '../screens/LoansScreen';
import LentMoneyScreen from '../screens/LentMoneyScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON = {
  Home: 'dashboard',
  Stock: 'inventory',
  Sales: 'sales',
  Reports: 'analytics',
  More: 'settings',
};

function Tabs() {
  const { t } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textMuted,
        tabBarStyle: {
          backgroundColor: t.nav,
          borderTopColor: t.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => <Icon name={TAB_ICON[route.name]} size={size ? size - 2 : 20} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Stock" component={InventoryScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { t } = useApp();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Purchases" component={PurchasesScreen} />
      <Stack.Screen name="Backup" component={BackupScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Investors" component={InvestorsScreen} />
      <Stack.Screen name="Loans" component={LoansScreen} />
      <Stack.Screen name="LentMoney" component={LentMoneyScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Stack.Navigator>
  );
}
