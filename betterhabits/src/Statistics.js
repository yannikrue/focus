import { Dimensions, PanResponder, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState, useEffect} from 'react'
import { firebase } from '../config'
import Footer from '../components/Footer';
import LineChart from '../components/LineChart';
import moment from 'moment';
import { update } from 'lodash';

let todayPercent;
let yesterdayPercent;

let currentDate = new Date();
let date = new Date();
let lastWeekDate = new Date();
let formatedDate;

date.setDate(date.getDate()-1);
lastWeekDate.setDate(lastWeekDate.getDate()-7);

const Statistics = () => {
  const [menu, setMenu] = useState("Overview");
  const [dailyData, setDailyData] = useState();
  const [weeklyData, setWeeklyData] = useState();
  const [dailyPlot, setDailyPlot] = useState();
  

  const SWIPE_THRESHOLD = 100;
  const SWIPE_DIRECTION = 'horizontal';
  const SWIPE_DISTANCE = '10%';
  const elementWidth = Dimensions.get('window').width;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderMove: (evt, gestureState) => {},
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (SWIPE_DIRECTION === 'horizontal' || SWIPE_DIRECTION === 'right') {
        if (gestureState.dx > (SWIPE_DISTANCE.indexOf('%') !== -1 ? elementWidth * (parseInt(SWIPE_DISTANCE, 10) / 100) : SWIPE_DISTANCE)) {
          onSwipeRight();
        }
      }
      if (SWIPE_DIRECTION === 'horizontal' || SWIPE_DIRECTION === 'left') {
        if (gestureState.dx < -(SWIPE_DISTANCE.indexOf('%') !== -1 ? elementWidth * (parseInt(SWIPE_DISTANCE, 10) / 100) : SWIPE_DISTANCE)) {
          onSwipeLeft();
        }
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  });

  const onSwipeRight = () => {
    setMenu("Overview");
  }
  
  const onSwipeLeft = () => {
    setMenu("Plot");
  }

  useEffect(() => {
    getData();
  }, [menu]);

  const getData = async () => {
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc("Daily").get().then(( snaphot ) => {
      if (snaphot.exists) {
        setDailyData(snaphot.data());
      } else {
        console.log("does not exist");
      }
    })
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc("Weekly").get().then(( snaphot ) => {
      if (snaphot.exists) {
        setWeeklyData(snaphot.data());
      } else {
        console.log("does not exist");
      }
    })
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc("Stats").get().then(( snaphot ) => {
      if (snaphot.exists) {
        setDailyPlot(snaphot.data());
      } else {
        console.log("does not exist");
      }
    })
  }

  const updateStats = async (updateArr) => {
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc("Stats").update({
      "values": updateArr
    })
  }

  const listDays = () => {
    if (menu === "Overview") {
      let todayCount = 0;
      let todayLength = 0;
      let yesterdayCount = 0;
      let yesterdayLength = 0;
  
      if (dailyData != null) {
        for (const day in dailyData) {
          if (day === formatDate(currentDate, true)) {
            todayLength = dailyData[day].length;
            for (const habit in dailyData[day]) {
              for (let key of Object.keys(dailyData[day][habit])) {
                if (dailyData[day][habit][key] === true) {
                  todayCount++;
                }
              }
            }
          } else if (day === formatDate(date, true)) {
            yesterdayLength = dailyData[day].length;
            for (const habit in dailyData[day]) {
              for (let key of Object.keys(dailyData[day][habit])) {
                if (dailyData[day][habit][key] === true) {
                  yesterdayCount++;
                }
              }
            }
          }
        }
      }
      todayPercent = Math.round(todayCount * 100 / todayLength);
      yesterdayPercent = Math.round(yesterdayCount * 100 / yesterdayLength);
      const jsx = 
      <View style={styles.dailyContainer}>
        <View style={styles.days}>
          <Text>Today's Stats</Text>
          <Text></Text>
          <Text>Total: {todayLength}</Text>
          <Text>Completed: {todayCount}</Text>
          <Text>Percentage: {todayPercent}%</Text>
        </View>
        <View style={styles.days}>
          <Text>Yesterday's Stats</Text>
          <Text></Text>
          <Text>Total: {yesterdayLength}</Text>
          <Text>Completed: {yesterdayCount}</Text>
          <Text>Percentage: {yesterdayPercent}%</Text>
        </View>
      </View>
  
      return jsx;
    } else if (menu === "Plot") {
      
      const jsx =
      <View style={styles.dailyContainer}>
        <Text>Hier kommt die heatmap</Text>
      </View>

      return jsx;
    }
  }

  const listWeeks = () => {
    if (menu === "Overview") {
      let thisWeekCount = 0;
      let thisWeekLength = 0;
      let lastWeekCount = 0;
      let lastWeekLength = 0;
      
      if (weeklyData != null) {
        for (const day in weeklyData) {
          if (day === formateWeek(currentDate)) {
            thisWeekLength = weeklyData[day].length;
            for (const habit in weeklyData[day]) {
              for (let key of Object.keys(weeklyData[day][habit])) {
                if (weeklyData[day][habit][key] === true) {
                  thisWeekCount++;
                }
              }
            }
          } else if (day === formateWeek(lastWeekDate)) {
            lastWeekLength = weeklyData[day].length;
            for (const habit in weeklyData[day]) {
              for (let key of Object.keys(weeklyData[day][habit])) {
                if (weeklyData[day][habit][key] === true) {
                  lastWeekCount++;
                }
              }
            }
          }
        }
      }
      const jsx =
      <View style={styles.weeklyContainer}>
        <View style={styles.weeks}>
          <Text>This Week's Stats</Text>
          <Text></Text>
          <Text>Total: {thisWeekLength}</Text>
          <Text>Completed: {thisWeekCount}</Text>
          <Text>Percentage: {Math.round(thisWeekCount * 100 / thisWeekLength)}%</Text>
        </View>
        <View style={styles.days}>
          <Text>Last Week's Stats</Text>
          <Text></Text>
          <Text>Total: {lastWeekLength}</Text>
          <Text>Completed: {lastWeekCount}</Text>
          <Text>Percentage: {Math.round(lastWeekCount * 100 / lastWeekLength)}%</Text>
        </View>
      </View>

      return jsx;
    }
}


return (
    <View style={styles.container}>
      <View style={styles.content} {...panResponder.panHandlers}>
        {listDays()}
        {listWeeks()}
      </View>
      <Footer />
    </View>
  )
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date, withYear) {
  let s = padTo2Digits(date.getDate()) + "-" + padTo2Digits(date.getMonth() + 1);
  withYear ? s = s + "-" + date.getFullYear():"";
  return s;
}

function formateWeek(date) {
  let weekDay = (date.getDay()+6)%7;
  let firstDay = new Date();
  firstDay.setDate(date.getDate() - weekDay);
  let lastDay = new Date();
  lastDay.setDate(date.getDate() + (6-weekDay));
  return formatDate(firstDay, false) + " bis " + formatDate(lastDay, false);
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex:1,  
  },
  content: {
    flex: 1,
  },
  dailyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  weeklyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  graph: {
    flex: 1,
  },
  days: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeks: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})