import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();


  return (

    <Stack.Navigator>
      {
        user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator