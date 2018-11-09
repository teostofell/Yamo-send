import { StyleSheet } from 'react-native';

import { METRICS } from '../../../../resource/Metrics'

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
});
