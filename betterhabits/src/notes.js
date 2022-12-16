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
