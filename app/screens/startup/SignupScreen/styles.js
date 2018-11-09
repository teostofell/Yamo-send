import { StyleSheet } from 'react-native';

import { METRICS } from '../../../resource/Metrics'

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
  bottomTextCont : {
      flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:22,
    marginTop: 80,
    flexDirection:'row'
  }
});
