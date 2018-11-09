import React, {Component} from 'react';
import { StyleSheet, FlatList, Image, View, WebView, Linking, Alert, YellowBox} from 'react-native';
import { Cell, Separator, TableView, } from 'react-native-tableview-simple';

import Images from '../../../../resource/Images';
import styles from './styles';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module SafeAreaManager']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

const data = [
  { id: 1, title: 'FAQ', image: Images.faqIconImage, url: 'http://yamo.africa/faq_mobile.php' },
  { id: 2, title: 'LICENCES', image: Images.licencesIconImage, url: '' },
  { id: 3, title: 'TERMS AND CONDITIONS', image: Images.termsIconImage, url: 'http://yamo.africa/terms_mobile.php' },
  { id: 4, title: 'CONTACT US', image: Images.contactIconImage, url: 'http://yamo.africa/about_mobile.php' },
];

class HelpScreen extends Component {
  constructor(props) {
    super(props);

  };

  render() {
    return (
      <FlatList
      data={data}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={({ item, separators }) =>
        <Cell
          cellStyle="Basic"
          contentContainerStyle={{ paddingVertical: 10 }}
          accessory="DisclosureIndicator"
          title={item.title}
          image={
            <Image
              style={{ borderRadius: 0 }}
              source={ item.image }
              resizeMode={"contain"}
            />
          }
          onPress={() => {
            if (item.title == 'LICENCES' && item.url == '') {
              return
            }
            // Actions.infoWebView({data: item});
            // this.props.navigation.navigate('HelpDetails', {data: item});
            this.props.navigation.push('HelpDetails', {data: item});
          }}
        />}
        ItemSeparatorComponent={({ highlighted }) =>
        <Separator isHidden={highlighted} />}
      />
    );
  }
}

export default HelpScreen