import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppTabs from './src/navigation/AppTabs';
import { colors } from './src/theme/index.js';
import { ReservasProvider } from './src/context/ReservasContext';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ReservasProvider>
        <NavigationContainer theme={temaNavegacion}>
          <StatusBar style="dark" />
          <AppTabs />
        </NavigationContainer>
      </ReservasProvider>
    </SafeAreaProvider>
  );
}



