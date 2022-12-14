import { PanResponder } from 'react-native-gesture-handler';

//...

const panResponder = PanResponder.create({
  // Detect when the user swipes from right to left on the element
  onMoveShouldSetPanResponder: (evt, gestureState) => {
    if (gestureState.dx < -10) {
      return true;
    }
    return false;
  },

  // When the user swipes from right to left, open the delete option
  onPanResponderRelease: (evt, gestureState) => {
    if (gestureState.dx < -10) {
      // Open the delete option here
    }
  }
});

//...

<TouchableOpacity
  key={index}
  style={styles.habitDone}
  // Attach the panResponder to the TouchableOpacity element
  {...panResponder.panHandlers}
  onPress={()=> {
    //funtion to edit habit name
  }}
  >
    <View style={





const arr1 = [
  {
    "habit1": 7,
  },
  {
    "habit2": 7,
  },
  {
    "habit3": "7",
  },
];

const arr2 = [
  {
    "habit1": false,
  },
  {
    "habit2": true,
  },
];

const arr3 = arr1.map(obj => {
  // Die Angewohnheit des aktuellen Objekts aus arr1
  const habit = Object.keys(obj)[0];

  // Der Wert der Angewohnheit im zweiten Array
  const value = arr2.find(o => Object.keys(o)[0] === habit);

  // Wenn der Wert gefunden wurde, wird er verwendet, ansonsten ist der
