import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { View, Text, Colors } from 'react-native-ui-lib';
import { connect } from 'react-redux';

import styles from './styles'

import { setUserData } from '../../../../store/userData'
import { updateUserAbout } from '../../../../store/firebaseData'

import Globals from '../../../../Globals';

class AboutYouScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'About me',
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center'
      },
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
          // navigation.state.params.updateFavorites(23)
          navigation.goBack();
        }} >
          <Icon name="arrow-left" size={30} color="#aaaaaa" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{ params.handleSave() }} >
          <Text style={{ color: '#aaaaaa', fontSize: 18, paddingRight: 20 }}>Save</Text>
        </TouchableOpacity>
      ),
      headerMode: 'Float',
    };
  };

  state = {
    aboutText: '',
    userInformation: null,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  
  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.handleSave
    })

    let userData = Globals.userData;
    let l_about = (userData && userData.about) ? userData.about : '';

    this.setState({
      aboutText: l_about,
    });
  }

  componentDidUpdate(prevProps) {

  }

  handleChange(value) {
    if (value.endsWith("\n")) {
      Keyboard.dismiss();
      return;
    }
    this.setState({
      aboutText: value,
    });
  }

  handleSave() {
    Keyboard.dismiss();
    if (this.state.aboutText != null) {
      this.onSetService(this.state.aboutText);
    } else {
      this.onSetService('');
    }
  }

  onSetService(text) {
    let userData = Globals.userData;

    userData.about = text;
    this.props.dispatch(updateUserAbout( userData.uid, text, 'AboutYou' ))
    this.props.dispatch(setUserData(userData));
    Globals.userData = userData;
  }

  render() {
    return (
      <View flex paddingH-15 paddingT-10 bg-white>
        <Text style={styles.titleContainer}>
          What makes you stand out? The more you share, the more interesting and real you become.
        </Text>

        <View style={ styles.descriptContainer } >
          <TextInput
            style={{ flex: 1, }}
            multiline={true}
            blurOnSubmit={false}
            editable={true}
            autoCorrect={false}
            // maxLength={40}
            onChangeText={(txt) => {
              this.handleChange(txt)
            }}
            onFocus={() => {
              this.setState({
                aboutText: this.state.aboutText + " "
              })
            }}
            value={this.state.aboutText}
            onSubmitEditing={() => {
            }}
          />
        </View>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,
  };
  return props;
}

export default connect(mapStateToProps)(AboutYouScreen)
