import {Dimensions, StatusBar} from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const Metrics = {
  screenWidth: screenWidth,
  screenHeight: screenHeight,
};

const updateMetrics = () => {
  screenWidth = Dimensions.get('window').width;
  screenHeight = Dimensions.get('window').height - StatusBar.currentHeight;

  Metrics.screenWidth = screenWidth;
  Metrics.screenHeight = screenHeight;
};

Dimensions.addEventListener('change', updateMetrics);

export default Metrics;
