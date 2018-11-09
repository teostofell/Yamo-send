import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { METRICS } from '../../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    // flex: 1, 
    backgroundColor:'#ffffff',
  },
  titleContainer: {
    fontSize: 50,
    color: '#000000',
    fontWeight: 'bold',
  },
  descriptContainer: {
    fontSize: 20,
    color: '#959595',
    fontWeight: 'bold',
  },  
  inputWrapper: {
    marginTop: 80,
    flexDirection: 'row'
  },
  inputValue: {
    height: 40,
    width: 300,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
});
