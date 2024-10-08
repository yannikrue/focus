import { Dimensions, PanResponder, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React,{useState, useEffect} from 'react';
import { firebase } from '../config';
import {Picker} from '@react-native-picker/picker';


import Footer from '../components/Footer';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

let currentDate = new Date();
let date = new Date();
let formatedDate;

currentDate.setDate(currentDate.getDate());
date.setDate(date.getDate());

const Habits = () => {
  const [data, setData] = useState([]);
  const [menu, setMenu] = useState("Daily");
  const [addHabitField, setAddHabitField] = useState(false);
  const [newHabit, setNewHabit] = useState();
  const [newHabitValue, setNewHabitValue] = useState("7");
  const [deleteState, setDeleteState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editFieldState, setEditFieldState] = useState(false);
  const [editHabit, setEditHabit] = useState("");
  
  const SWIPE_THRESHOLD = 150;
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
      // Check if the user swiped far enough and in the correct direction
      if (SWIPE_DIRECTION === 'horizontal' || SWIPE_DIRECTION === 'right') {
        if (gestureState.dx > SWIPE_THRESHOLD && gestureState.dx > (SWIPE_DISTANCE.indexOf('%') !== -1 ? elementWidth * (parseInt(SWIPE_DISTANCE, 10) / 100) : SWIPE_DISTANCE)) {
          onSwipeRight();
        }
      }
      if (SWIPE_DIRECTION === 'horizontal' || SWIPE_DIRECTION === 'left') {
        if (gestureState.dx < -SWIPE_THRESHOLD && gestureState.dx < -(SWIPE_DISTANCE.indexOf('%') !== -1 ? elementWidth * (parseInt(SWIPE_DISTANCE, 10) / 100) : SWIPE_DISTANCE)) {
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
    if (date.getDate() - currentDate.getDate() >= 0){
      date.setDate(date.getDate()-1);
      renderContent();
    }
  }
  
  const onSwipeLeft = () => {
    if (currentDate.getDate() - date.getDate() >= 0) {
      date.setDate(date.getDate()+1);
      renderContent();
    }
  }

  let contentTitle = null;
  
  if (menu === "Daily") {
    contentTitle = daily(date);
    formatedDate = formatDate(date, true);
  } else if (menu === "Weekly") {
    contentTitle = weekly(date);
    formatedDate = formateWeek(date);
  } else if (menu === "Overview") {
    contentTitle = overview();
  }
  
  useEffect(() => {
    renderContent();
  }, [menu]);

  const renderContent = async () => {
    let cpData = null;
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).get().then(( snaphot ) => {
      if (snaphot.exists) {
        setData(snaphot.data());
        cpData = snaphot.data();
      } else {
        console.log("does not exist");
      }
    })
    let found = false;

    for (const key in cpData) {
      if (key === formatedDate) {
        found = true;
      }
    }
    if (!found) {
      let docId = menu;
      if (!(docId === "Overview")){
        await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(docId).update({
          [formatedDate]: []
        })
        updateDatabase(docId);
      }
    }
  }

  const prepareData = (data, fieldId, habits, values) => {
    for (const key in data) {
      if (key === fieldId) {
        for (const index in data[key]) {
          for (const habit in data[key][index]) {
            habits.push(habit);
            values.push(data[key][index][habit])
          }
        }
      }
    }
  }
  
  /**
   * Displays all Habits from the betterhabits datebase
   * @returns all habits rendered in jsx
  */
 const listHabits = () => {
   const habits = [];
   const values = [];
   if (menu === "Overview") {
     prepareData(data, "Daily", habits, values);
     prepareData(data, "Weekly", habits, values);

     // Add button
    const addButton = 
      <TouchableOpacity
      style={styles.habitNotDone}
      onPress={()=> {
        setAddHabitField(!addHabitField);
      }}
      >
        <Text>add new habit</Text>
      </TouchableOpacity>;

      // habit field to enter new habit
      const habitField = 
      <View style={styles.addHabitField}>
        <View style={[styles.inputField, {justifyContent: 'space-between', margin: 10, paddingBottom: 10}]}>
          <TextInput
            style={styles.textInput}
            placeholder="habit" 
            onChangeText={(habit) => setNewHabit(habit)}
            autoCapitalize="none"
            autoCorrect={false}
          >
          </TextInput>
          <Picker
            style={styles.picker}
            itemStyle={{ fontSize: 15, height: 100}}
            selectedValue={newHabitValue}
            onValueChange={(itemValue, itemIndex) =>
              setNewHabitValue(itemValue, itemIndex)
            }>
            <Picker.Item label="Daily" value="7" />
            <Picker.Item label="Weekly" value="1" />
          </Picker>
        </View>
        <View style={styles.inputField}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={()=>setAddHabitField(false)}
            >
            <Text style={{textAlign: 'center'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={()=>{
              addHabit(newHabit, newHabitValue);
              setAddHabitField(false);
            }}
          >
            <Text style={{textAlign: 'center'}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      const editField = 
        <KeyboardAvoidingView style={styles.editField}>
          <TextInput
            style={styles.textInput}
            placeholder="change habit" 
            onChangeText={(habit) => setEditHabit(habit)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </KeyboardAvoidingView>

      // List of all current habits
      const jsx =  habits.map((habit, index) => 
        <View key={index}>
          <TouchableOpacity
            style={editFieldState[index] ? styles.habitNotDone : styles.habitDone}
            onPress={() => {
              if (deleteState === true) {
                removeHabit(habit, values[index]);
                setDeleteState(false);
              } else if (editState === true) {
                let arr = editFieldState;
                arr[index] = true;
                setEditFieldState(arr);
                renderContent();
              }
            }}
            >
            <View style={styles.overviewHabits}>
              <Text style={{ textAlign: 'left' }}>{habit}</Text>
              <Text style={{ textAlign: 'right' }}>{"Daily"}</Text>
            </View>
          </TouchableOpacity>
          {editFieldState[index] ? editField : null}
        </View>);

      const deleteButton = (
        <TouchableOpacity
          style={[styles.habitDone, {marginBottom: 50, width: 160}, deleteState ? {backgroundColor: 'red'}: null]}
          onPress={()=> {
            if (!deleteState && !editState) {
              setDeleteState(true);
            } else if (!deleteState && editState) {
              setEditState(false);
              setDeleteState(true);
            } else {
              setDeleteState(false);
            }
          }}>
          <Text>Delete</Text>
        </TouchableOpacity>);

      const editButton = (
      <TouchableOpacity
        style={[editState ? styles.habitNotDone : styles.habitDone, {marginBottom: 50, width: 160}]}
        onPress={()=> {
          if (!deleteState && !editState) {
            setEditState(true);
            setEditFieldState(Array(habits.length).fill(false))
          } else if (deleteState && !editState) {
            setEditState(true);
            setDeleteState(false);
            setEditFieldState(Array(habits.length).fill(false))
          } else {
            setEditState(false);
            if (editFieldState.indexOf(true) >= data["Daily"].length) {
              let i = editFieldState.indexOf(true) - data["Daily"].length;
              if (editHabit.length > 0) {
                changeHabit(editHabit, "1", i);
              }
            } else {
              let i = editFieldState.indexOf(true);
              if (editHabit.length > 0) {
                changeHabit(editHabit, "7", i);
              }
            }
            setEditFieldState(Array(habits.length).fill(false))
          }
        }}>
        <Text>Edit</Text>
      </TouchableOpacity>);

      return (
        <View>
          {addButton}
          {addHabitField ? habitField : null}
          <ScrollView>
            {jsx}
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            {editButton}
            {deleteButton}
          </View>
        </View>
      );
    } else {
      prepareData(data, formatedDate, habits, values);
      
      const jsx =  habits.map((habit, index) => 
        <TouchableOpacity
          key={index}
          style={values[index] ? styles.habitDone : styles.habitNotDone}
          onPress={()=> {
            updateHabit(index, habits[index], values[index]);
          }}
          >
          <Text>{habit}</Text>
        </TouchableOpacity>
      );
      return <ScrollView {...panResponder.panHandlers}>{jsx}</ScrollView>
    }
  }

  const addHabit = async (habit, value) => {
    const fieldId = value == 7 ? "Daily" : "Weekly";
    let arr = data[fieldId];
    arr.push({[habit]: value});
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: arr
    });
    await addHabitDatabase("Daily");
    await addHabitDatabase("Weekly");
  }
  
  const removeHabit = async (habit, value) => {
    const fieldId = value == 7 ? "Daily" : "Weekly";
    let arr = data[fieldId];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].hasOwnProperty(habit)) {
        arr.splice(i, 1);
        break;
      }
    }
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: arr
    });
    await addHabitDatabase("Daily");
    await addHabitDatabase("Weekly");
  }

  const changeHabit = async (habit, value, i) => {
    const fieldId = value === "7" ? "Daily" : "Weekly";
    let arr = data[fieldId];
    arr[i] = {[habit]: value}
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: arr
    });
    await addHabitDatabase("Daily");
    await addHabitDatabase("Weekly");
  }

  const addHabitDatabase = async (menu) => {
    const fieldId = menu === "Daily" ? formatDate(date, true) : formateWeek(date);
    const habits = [];
    const values = [];
    const oldHabits = [];
    const oldValues = [];

    let oldData;

    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).get().then(( snaphot ) => {
      if (snaphot.exists) {
        oldData = snaphot.data();
      } else {
        console.log("does not exist");
      }
    })
    
    prepareData(data, menu, habits, values);
    prepareData(oldData, fieldId, oldHabits, oldValues);
    
    const newHabits = data[menu].map(obj => {
      // Die Angewohnheit des aktuellen Objekts aus arr1
      const habit = Object.keys(obj)[0];
    
      // Der Wert der Angewohnheit im zweiten Array
      const value = oldData[fieldId]?.find(o => Object.keys(o)[0] === habit);
      
      if (value != null) {
        return value;
      } else {
          return {
            [habit]: false
          }
      }
    });

    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: newHabits
    });
  }

  const updateDatabase = async (docId) => {
    const fieldId = formatedDate;
    let habits = null;
    let list = [];
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc("Overview").get().then(( snaphot ) => {
      habits = snaphot.data();
    });

    for (const obj of habits[docId]) {
      const newObj = { [Object.keys(obj)[0]]: false };
      list.push(newObj);
    }

    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: list
    })
    renderContent();
  }

  /**
   * Updates the state of the habit pressed in the database
   * @param {String} habit variable key of the habit object 
   * @param {boolean} value inidcates wheter the habit is done or not
   */
  const updateHabit = async (index, habit, value) => {
    let fieldId = formatedDate;
    let habits = data[fieldId];
    habits[index][habit] = !value
    await firebase.firestore().collection("data").doc(firebase.auth().currentUser.uid).collection("habits").doc(menu).update({
      [fieldId]: habits
    })
    renderContent();
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Main function
   * renders all the elements
   */
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity
          onPress={()=> {
            setMenu("Daily");
          }}
          style={styles.buttons}
          >
          <Text style={menu  === "Daily" ? styles.buttonText : styles.buttonDisText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> {
            setMenu("Weekly");
          }}
          style={styles.buttons}
          >
          <Text style={menu  === "Weekly" ? styles.buttonText : styles.buttonDisText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> {
            setMenu("Overview");
          }}
          style={styles.buttons}
          >
          <Text style={menu  === "Overview" ? styles.buttonText : styles.buttonDisText}>Overview</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.date}>
          {contentTitle}
        </View>
          {listHabits(menu, data)}
      </View>
      <Footer />
    </View>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function daily() {
  return (
    <Text style={styles.title}>{formatDate(date, true).replaceAll("-", ".")}</Text>
    )
  }
  
function weekly() {
  return (
    <Text style={styles.title}>{formateWeek(date).replaceAll("-", ".")}</Text>
  )
}

function overview() {
  return (
    <Text style={styles.title}>overview</Text>
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
  title: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  habitDone: {
    width: 330,
    height: 50,
    backgroundColor: '#D6E2E0',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  habitNotDone: {
    width: 330,
    height: 50,
    backgroundColor: '#8AB6A9',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  overviewHabits: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addHabitField: {
    width: 330,
    flexDirection: 'column',
    margin: 5,
    marginBottom: 10,
    backgroundColor: '#D6E2E0',
    borderRadius: 15,
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  textInput: {
    padding: 10,
    width: 200,
    height: 50,
    paddingTop: 20,
    borderBottomWidth : 1.0,
  },
  picker: {
    width: 130,
    height: 80,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8AB6A9',
    margin: 7,
    height: 45,
    justifyContent: 'center',
    borderRadius: 15,
  },
  editField: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})