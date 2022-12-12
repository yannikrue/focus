import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config'
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/Footer';

const Statistics = () => {
  const date = new Date().toLocaleString()
  const [name, setName] = useState([]);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Footer />
    </SafeAreaView>
  )
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex:1,  
    alignItems:'center',
    marginTop:100,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'baseline'
  },
})