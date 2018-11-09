import { StyleSheet } from 'react-native';

import { METRICS } from '../../../resource/Metrics'

export default StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#ffffff', 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 68 * METRICS.scaleHeight,
    fontWeight: 'bold',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    // flex: 1,
    // width: null,
    // alignSelf: 'stretch'
    width: null, 
    height: null,
    flex: 1,
    resizeMode: "stretch",
    backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descBody: {
    // backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    top: 1540 * METRICS.scaleHeight,
    width: '100%',
    // height: 250 * Metrics.scaleHeight,
    paddingLeft: 35 * METRICS.scaleWidth,
    paddingRight: 35 * METRICS.scaleWidth,
  },
  title: {
    fontSize: 75 * METRICS.scaleHeight,
    color: 'white',
    alignItems: 'center',
  },
  desc: {
    fontSize: 60 * METRICS.scaleHeight,
    color: 'rgba(255, 255, 255, 1.0)',
    marginTop: 10 * METRICS.scaleHeight,
    alignItems: 'center',
    textAlign: 'center',
  },
  swipeDotStyle: {
    backgroundColor:'rgba(0,0,0,0.2)', 
    width: 20 * METRICS.scaleHeight, 
    height: 20 * METRICS.scaleHeight, 
    borderRadius: 16 * METRICS.scaleHeight, 
    marginLeft: 12 * METRICS.scaleHeight, 
    marginRight: 12 * METRICS.scaleHeight, 
    marginTop: 12 * METRICS.scaleHeight, 
    marginBottom: 12 * METRICS.scaleHeight,
  },
  swipeDotActiveStyle: {
    backgroundColor: '#ffffff', 
    width: 32 * METRICS.scaleHeight, 
    height: 32 * METRICS.scaleHeight, 
    borderRadius: 16 * METRICS.scaleHeight, 
    marginLeft: 12 * METRICS.scaleHeight, 
    marginRight: 12 * METRICS.scaleHeight, 
    marginTop: 12 * METRICS.scaleHeight, 
    marginBottom: 12 * METRICS.scaleHeight,
  }
});
