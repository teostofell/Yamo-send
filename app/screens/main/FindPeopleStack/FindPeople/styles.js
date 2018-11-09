import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { METRICS } from '../../../../resource/Metrics'

export default StyleSheet.create({
  title: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleText: {
    color: '#d0bbab',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'rgb(58, 45, 91)',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1, 
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    padding: 2,
    // paddingLeft: 10,
    backgroundColor: '#ffffff',
  },
  box: {
    margin: 2,
    width: Dimensions.get('window').width / 3 - 6,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1c40f',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  modalFilterContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
});
