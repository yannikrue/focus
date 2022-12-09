import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import React from 'react'

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button title='Statistics' onPress={() => navigation.navigate("Statistics")} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen