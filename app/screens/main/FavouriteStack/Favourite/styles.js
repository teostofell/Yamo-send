import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { METRICS } from '../../../../resource/Metrics'

export default StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white',
  },
  tabsContainerStyle: {
    //custom styles
    height: 50,
    backgroundColor: "white",
    borderRadius: 0,
  },
  tabStyle: {
    //custom styles
    backgroundColor: 'transparent', 
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    },
  tabTitleStyle: {
    //custom styles
  },
  activeTabStyle: {
    //custom styles
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#fd2191',
    //borderRadius: 10
  },
  tabTextStyle: {
    color: "#a9a9a9",
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabTextStyle: {
    //custom styles
    color: "#fd2191",
    fontSize: 14,
    fontWeight: '500',
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
  tabContent: {
    color: '#fff',
    fontSize: 18,
    margin: 24,
  },
});
