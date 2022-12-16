import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import {Picker} from '@react-native-picker/picker';
import DraggableFlatList from 'react-native-draggable-flatlist';


import Footer from '../components/Footer';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

let currentDate = new Date();
let date = new Date();
let formatedDate;

date.setDate(date.getDate());

const Habits = () => {
  const [name, setName] = useState([]);
  const [data, setData] = useState([]);
  const [habits, setHabits] = useState([]);
  const navigation = useNavigation();
  const [menu, setMenu] = useState("Daily");
  const [addHabitField, setAddHabitField] = useState(false);
  const [newHabit, setNewHabit] = useState([]);
  const [newHabitValue, setNewHabitValue] = useState("7");
  
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

    const [items, setItems] = useState(habits.map((habit, index) => ({ habit, value: values[index] })));

    const onDragEnd = ({ listData }) => {
      setItems(listData);
    };

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

      // List of all current habits
      const renderItem = ({ item, index, drag, isActive }) => (
        <TouchableOpacity
          key={index}
          style={styles.habitDone}
          onPress={() => console.log(index)}
        >
          <View style={styles.overviewHabits}>
            <Text style={{ textAlign: 'left' }}>{item.habit}</Text>
            <Text style={{ textAlign: 'right' }}>{item.value}</Text>
          </View>
        </TouchableOpacity>
      );

      const deleteButton = <TouchableOpacity
        style={[styles.habitNotDone, {marginBottom: 50, width: 160}]}
        onPress={()=> {
          console.log("delete");
        }}>
          <Text>Delete</Text>
        </TouchableOpacity>
      const editButton = <TouchableOpacity
      style={[styles.habitNotDone, {marginBottom: 50, width: 160}]}
      onPress={()=> {
        console.log("edit");
      }}>
        <Text>Edit</Text>
      </TouchableOpacity>
      
      return (
        <View>
          {addButton}
          {addHabitField ? habitField : null}
          <DraggableFlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.habit}
            onDragEnd={onDragEnd}
          />
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
      return <ScrollView>{jsx}</ScrollView>
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
})