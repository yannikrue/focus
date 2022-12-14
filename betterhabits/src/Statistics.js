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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Statistics page</Text>
      </View>
      <Footer />
    </View>
  )
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex:1,  
    alignItems:'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
})