import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { METRICS } from '../../../../resource/Metrics'
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
  },

  profilePhotoContainer: {
    flex: 60, 
    backgroundColor: '#119990',
  },

  photoContainer: {
    width: null, 
    height: null,
    flex: 1,
    resizeMode: "stretch"
  },

  detailContainer: {
    flex: 40,
    // backgroundColor: 'transparent',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexDirection: 'column',
  },
  modal: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    top:0,
    left:0,
    backgroundColor: '#ededed',
    justifyContent: 'center',
  },
});
