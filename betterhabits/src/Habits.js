import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '../components/Footer';

let currentDate = new Date();
let date = new Date();

date.setDate(date.getDate());

const Habits = () => {
  const [name, setName] = useState([]);
  const navigation = useNavigation();
  const [menu, setMenu] = useState("Daily");

  let menuContent = null;

  if (menu === "Daily") {
    menuContent = daily(date);
  } else if (menu === "Weekly") {
    menuContent = weekly(date);
  } else if (menu === "Overview") {
    menuContent = overview();
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity
          onPress={()=>setMenu("Daily")}
          style={styles.buttons}
        >
          <Text style={menu  === "Daily" ? styles.buttonText : styles.buttonDisText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>setMenu("Weekly")}
          style={styles.buttons}
        >
          <Text style={menu  === "Weekly" ? styles.buttonText : styles.buttonDisText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>setMenu("Overview")}
          style={styles.buttons}
        >
          <Text style={menu  === "Overview" ? styles.buttonText : styles.buttonDisText}>Overview</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.date}>
          {menuContent}
        </View>
      </View>
      <Footer />
    </View>
  )
}

function daily() {
  return (
    <Text>{formatDate(date, true)}</Text>
  )
}

function weekly() {
  // Calculate the week of the year
  let weekDay = (date.getDay()+6)%7;

  let firstDay = new Date();
  firstDay.setDate(date.getDate() - weekDay);

  let lastDay = new Date();
  lastDay.setDate(date.getDate() + (6-weekDay));

  let week = formatDate(firstDay, false) + " - " + formatDate(lastDay, false);
  return (
    <Text>{week}</Text>
  )
}

function overview() {
  return (
    <Text>overview test</Text>
  )
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date, withYear) {
  let s = padTo2Digits(date.getDate()) + "." + padTo2Digits(date.getMonth() + 1);
  withYear ? s = s + "." + date.getFullYear():"";
  return s;
}

export default Habits

const styles = StyleSheet.create({
  container: {
    flex:1,  
    alignItems:'center',
  },
  top: {
    height: 30,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'baseline',
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#5c5c5c'
  },
  buttonDisText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#adadad'
  },
  content: {
    flex: 1,
  }
})