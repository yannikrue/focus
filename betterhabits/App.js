import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from 'react';
import { firebase } from './config';

import Login from "./src/Login";
import Registration from "./src/Registration";
import Header from "./components/Header";
import Dashboard from "./src/Dashboard";
import Statistics from "./src/Statistics";
import Habits from "./src/Habits";

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;

    //if (false){
  if (!user) {
    return (
      <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ 
          headerTitle: () => <Header name="better habits" />,
           headerStyle:{
            height:150,
            borderBottomLeftRadius:50,
            borderBottomRightRadius:50,
            backgroundColor:'#CCD6A6',
            shadowColor:'#000',
            elevation:25
           },
           headerLeft: () => null,
          }}
          />
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{ 
          headerTitle: () => <Header name="better habits" />,
          headerStyle:{
            height:150,
            borderBottomLeftRadius:50,
            borderBottomRightRadius:50,
            backgroundColor:'#CCD6A6',
            shadowColor:'#000',
            elevation:25
          },
          headerLeft: () => null,
        }}
        />
    </Stack.Navigator>
    );
  }
  
  return (
    <Stack.Navigator>
      
      <Stack.Screen
        name="Habits"
        component={Habits}
        options={{
          gestureEnabled: false,
          animationEnabled: false,
        }}
        />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={{
          title: 'Statistics',
          headerLeft: () => null,
          gestureEnabled: false,
          animationEnabled: false,
        }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ 
            title: 'Dashboard',
            headerLeft: () => null,
            gestureEnabled: false,
            animationEnabled: false,
          }}
          />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  )
}