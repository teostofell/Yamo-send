import React, {Component} from 'react';
import { StyleSheet, FlatList, Image, View, WebView } from 'react-native';
import { YellowBox } from 'react-native';

import styles from './styles';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module SafeAreaManager']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

class HelpDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      headerTitle: state.params.data.title,
    };
  };

  constructor(props) {
    super(props);
  };

  componentWillMount() {
    // Actions.refresh({ 
    //   title: this.props.data.title, 
    // }); 
  }

  render() {
    let data = this.props.navigation.state.params.data;
    // const {setParams} = this.props.navigation;
    // setParams({ title: data.title })

    return (
      <WebView
        source={{uri: data.url}}
        style={styles.webview} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    );
  }
}

export default HelpDetailsScreen