import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProjectsProvider } from './src/context/ProjectsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ProjectsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ProjectsProvider>
    </SafeAreaProvider>
  );
}
