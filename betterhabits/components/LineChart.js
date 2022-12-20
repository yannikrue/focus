import { Svg, Path } from 'react-native-svg';
import { StyleSheet, View, Text } from 'react-native';

const LineChart = ({ data, stroke, strokeWidth }) => {
  const spacing = 370 / data.length;

  let pathData = `M 15 ${680 - data[0]}`;
  for (let i = 1; i < data.length; i++) {
    pathData += `L ${15 + i * spacing} ${680 - (5 * data[i])}`;
  }

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Dailys improvement</Text>
        <Svg style={styles.plot}>
            <Path d={pathData} stroke={stroke} strokeWidth={strokeWidth} />
        </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    plot: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // Add some padding to the plot
      padding: 30,
      paddingTop: 10,
      // Add a border to the plot
      borderWidth: 1,
      borderColor: '#ccc',
      // Add some background color to the plot
      backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 20,
        marginBottom: 15,
    }
  });

export default LineChart;
