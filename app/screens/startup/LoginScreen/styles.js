import { StyleSheet } from 'react-native';

import { METRICS } from '../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    // flex: 1, 
    backgroundColor:'#ffffff',
  },
  logoContainer: {
    width: METRICS.screenWidth * 0.5,
    height: METRICS.screenWidth * 0.5 * 0.28,
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
  forgottenPasswordContainer: {
    flexDirection:'row',
    justifyContent :'space-between',
  },  
  footer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 40,
    flexDirection:'row',
    justifyContent :'space-between',
    alignItems:'flex-end',
  },
});
