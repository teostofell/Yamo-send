import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { METRICS } from '../../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    // flex: 1, 
    backgroundColor:'#efeff4',
  },

  titleContainer: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'justify'
    // fontWeight: 'bold',
  },

  descriptContainer: {
    height: 200,
    borderWidth: 1,
    marginTop: 20,
    // marginBottom: 20,
    padding: 10,
    borderColor: Colors.dark60,
  },
});
