import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator /> 
    </NavigationContainer>
  );
}
