import { StyleSheet } from 'react-native';

import { METRICS } from '../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    flex: 1, 
  },
  headerContainer: {
    height: 80, 
    backgroundColor: '#ffffff', 
    alignItems: 'center',
  },
  headerTextContainer: {
    marginTop: 36, 
    fontSize: 22, 
    color: '#474747',
  },
  avatarViewContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  avatarImageContainer: {
    width: METRICS.screenWidth * 0.36, 
    height: METRICS.screenWidth * 0.455, 
    resizeMode: 'stretch',
  },
  avatarTextContainer: {
    color: '#ffffff', 
    fontSize: 18, 
    marginTop: 10,
  }
});
