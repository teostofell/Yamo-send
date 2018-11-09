import { StyleSheet } from 'react-native';

import { METRICS } from '../../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white',
  },

  itemViewContainer: {
    height: 40,
    paddingTop: 10, 
    marginLeft: 20, 
    marginRight: 20, 
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexDirection: 'row',
  },

  selectedTextContainer: {
    fontSize: 17, 
    color: 'rgba(34, 34, 34, 1.0)',
  },

  unSelectedTextContainer: {
    fontSize: 17, 
    color: 'rgba(34, 34, 34, 0.44)',
  }
});
