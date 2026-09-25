import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import LockScreen from './src/screens/LockScreen';

function Root() {
  const { t, locked, themeName } = useApp();

  const navTheme = {
    ...(themeName === 'light' ? DefaultTheme : DarkTheme),
    colors: {
      ...(themeName === 'light' ? DefaultTheme.colors : DarkTheme.colors),
      background: t.bg,
      card: t.nav,
      text: t.text,
      border: t.border,
      primary: t.accent,
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      <StatusBar style={themeName === 'light' ? 'dark' : 'light'} />
      {locked ? (
        <LockScreen />
      ) : (
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
