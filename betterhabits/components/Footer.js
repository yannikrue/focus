import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettIcon from 'react-native-vector-icons/Feather';
import Stats from 'react-native-vector-icons/Ionicons';
import HabitIcon from 'react-native-vector-icons/Octicons';

const Footer = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=>navigation.navigate('Habits')}
          style={styles.buttons}
        >
          <HabitIcon name="list-unordered" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigation.navigate('Statistics')}
          style={styles.buttons}
        >
          <Stats name="stats-chart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigation.navigate('Dashboard')}
          style={styles.buttons}
        >
          <SettIcon name="settings" size={30} color="black" />
        </TouchableOpacity>
      </View>
  )
}

export default Footer

const styles = StyleSheet.create({
    footer: {
      height: 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginBottom: 25,
    },
    buttons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'baseline'
    },
})