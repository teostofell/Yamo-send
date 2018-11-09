import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, YellowBox, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import styles from './styles'
import Images from '../../../../resource/Images';
import Globals from '../../../../Globals';
import { METRICS } from '../../../../resource/Metrics'

import { setUserData } from '../../../../store/userData';
import { updateUserInformation } from '../../../../store/firebaseData';

class InformationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Informations',
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
      // headerRight: (
      //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{ params.handleSave() }} >
      //     <Text style={{ color: '#aaaaaa', fontSize: 18, paddingRight: 20 }}>Save</Text>
      //   </TouchableOpacity>
      // ),
      headerMode: 'Float',
    };
  };
  
  state = {
    selectedNum: 0,
    listInformationDetails: [],
    userInformation: null,
  }

  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    // if (!prevProps.apiFailed && this.props.apiFailed) {
    //   Alert.alert(
    //     "Failed", this.props.apiFailed
    //   );
    //   return;
    // }
    // if (!prevProps.apiError && this.props.apiError) {
    //   Alert.alert(
    //     "Error", this.props.apiError
    //   );
    //   return;
    // }
    // if (this.props.apiPageName == 'profileInformationPage') {
    //   if (!prevProps.apiInformationSuccess && this.props.apiInformationSuccess) {
    //     let userData = this.props.user;
    //     userData.information = this.state.userInformation
    //     this.props.setUserData(userData.firebaseID, userData);
    //     this.setState({ selectedNum: this.state.serviceNum });
    //   }
    // }
  }

  onBackAction() {
    // Actions.pop({ refresh: {test: Math.random()}});
  }

  componentWillMount() {
    // Actions.refresh({ 
    //   title: Globals.profileInfoTitle.toUpperCase(), 
    // }); 
  }

  componentDidMount() {
    let userData = Globals.userData;

    let l_listInfo = {
      en: [],
      fr: []
    };

    var l_selectedService = '';
    switch (Globals.profileInfoTitle) {
      case 'Appearance':
        l_selectedService = userData && userData.information && userData.information.appearance ? userData.information.appearance : '';
        // l_listInfo = ['No answer', 'Gros/Grasse', 'Dodu', 'En forme', 'Mince', 'Pas tes affaires'];
        l_listInfo = {
          en: ['No answer', 'Fat', 'Slim', 'In good shape', 'Not your business'],
          fr: ['No answer', 'Gros/Grasse', 'Dodu', 'En forme', 'Mince', 'Pas tes affaires']
        }
        break;
      case 'Children':
        l_selectedService = userData && userData.information && userData.information.children ? userData.information.children : '';
        // l_listInfo = ['No answer', 'No', 'Yes'];
        l_listInfo = {
          en: ['No answer', 'No', 'Yes'],
          fr: ['No answer', 'non', 'Oui']
        }
        break;
      case 'Drinking':
        l_selectedService = userData && userData.information && userData.information.drinking ? userData.information.drinking : '';
        // l_listInfo = ['No answer', 'No', 'Yes'];
        l_listInfo = {
          en: ['No answer', 'No', 'Yes'],
          fr: ['No answer', 'non', 'Oui']
        }
        break;
      case 'About':
        l_selectedService = userData && userData.information && userData.information.about ? userData.information.about : '';
        // l_listInfo = ['No answer', 'A propos'];
        l_listInfo = {
          en: ['No answer', 'A propos'],
          fr: ['No answer', 'A propos']
        }
        break;
      case 'I speak':
        l_selectedService = userData && userData.information && userData.information.language ? userData.information.language : '';
        // l_listInfo = ['No answer', 'English', 'French'];
        l_listInfo = {
          en: ['No answer', 'English', 'French'],
          fr: ['No answer', 'Anglais', 'Francais']
        }
        break;
      case 'Living':
        l_selectedService = userData && userData.information && userData.information.living ? userData.information.living : '';
        // l_listInfo = ['No answer', 'Alone', 'With parents', 'With housemate (s)', 'With parents'];
        l_listInfo = {
          en: ['No answer', 'Alone', 'With parents', 'With housemate (s)', 'With parents'],
          fr: ['No answer', 'seul', 'avec mon partenaire', 'avec un colocataire', 'avec mes parents']
        }
        break;
      case 'Relationship':
        l_selectedService = userData && userData.information && userData.information.relashionship ? userData.information.relashionship : '';
        // l_listInfo = ['No answer', 'Single', 'In a relation', 'It\'s complicated'];
        l_listInfo = {
          en: ['No answer', 'Single', 'In a relation', 'It\'s complicated'],
          fr: ['No answer', 'célibataire', 'en relation', 'c’est compliqué']
        }
        break;
      case 'Sexuality':
        l_selectedService = userData && userData.information && userData.information.sexuality ? userData.information.sexuality : '';
        // l_listInfo = ['No answer', 'Straigh', 'Bi', 'Gay'];
        l_listInfo = {
          en: ['No answer', 'Straigh', 'Bi', 'Gay'],
          fr: ['No answer', 'hétéro', 'homo', 'gay']
        }
        break;
      case 'Smoking':
        l_selectedService = userData && userData.information && userData.information.smoking ? userData.information.smoking : '';
        // l_listInfo = ['No answer', 'No', 'Yes'];
        l_listInfo = {
          en: ['No answer', 'No', 'Yes'],
          fr: ['No answer', 'non', 'Oui']
        }
        break;
    }

    var l_selectedNum = 0;
    l_listInfo.fr
      .map((value, key) => {
        if (value == l_selectedService) {
          l_selectedNum = key;
        }
      });

    this.setState({ 
      listInformationDetails: l_listInfo.fr,
      selectedNum: l_selectedNum,
      userData: userData
    });    
  }

  onSetService(serviceNum) {
    if (!this.state.userData)
    {
      return;
    }

    let userData = this.state.userData;
    var l_appearance = '', l_chidren = '', l_drinking = '', l_language = '', l_living = '', l_relashionship = '', l_sexuality = '', l_smoking = '';

    if (serviceNum == 0) {
      l_appearance = Globals.profileInfoTitle == "Appearance" ? '' : userData && userData.information && userData.information.appearance ? userData.information.appearance : '';
      l_chidren = Globals.profileInfoTitle == "Children" ? '' : userData && userData.information && userData.information.children ? userData.information.children : '';
      l_drinking = Globals.profileInfoTitle == "Drinking" ? '' : userData && userData.information && userData.information.drinking ? userData.information.drinking : '';
      l_language = Globals.profileInfoTitle == "I speak" ? '' : userData && userData.information && userData.information.language ? userData.information.language : '';
      l_living = Globals.profileInfoTitle == "Living" ? '' : userData && userData.information && userData.information.living ? userData.information.living : '';
      l_relashionship = Globals.profileInfoTitle == "Relashionship" ? '' : userData && userData.information && userData.information.relashionship ? userData.information.relashionship : '';
      l_sexuality = Globals.profileInfoTitle == "Sexuality" ? '' : userData && userData.information && userData.information.sexuality ? userData.information.sexuality : '';
      l_smoking = Globals.profileInfoTitle == "Smoking" ? '' : userData && userData.information && userData.information.smoking ? userData.information.smoking : '';
    } else {
      l_appearance = Globals.profileInfoTitle == "Appearance" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.appearance ? userData.information.appearance : '';
      l_chidren = Globals.profileInfoTitle == "Children" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.children ? userData.information.children : '';
      l_drinking = Globals.profileInfoTitle == "Drinking" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.drinking ? userData.information.drinking: '';
      l_language = Globals.profileInfoTitle == "I speak" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.language ? userData.information.language : '';
      l_living = Globals.profileInfoTitle == "Living" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.living ? userData.information.living : '';
      l_relashionship = Globals.profileInfoTitle == "Relashionship" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.relashionship ? userData.information.relashionship : '';
      l_sexuality = Globals.profileInfoTitle == "Sexuality" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.sexuality ? userData.information.sexuality : '';
      l_smoking = Globals.profileInfoTitle == "Smoking" ? this.state.listInformationDetails[serviceNum] : userData && userData.information && userData.information.smoking ? userData.information.smoking : '';
    }

    // let userInformation = '{' + 
    //                         '"appearance": "' + l_appearance + '", ' +
    //                         '"children": "' + l_chidren + '", ' +
    //                         '"drinking": "' + l_drinking + '", ' +
    //                         '"language": "' + l_language + '", ' +
    //                         '"living": "' + l_living + '", ' +
    //                         '"relashionship": "' + l_relashionship + '", ' +
    //                         '"sexuality": "' + l_sexuality + '", ' +
    //                         '"smoking": "' + l_smoking + '"' +
    //                       '}';
    let l_userInformation = {
      appearance: l_appearance,
      children: l_chidren,
      drinking: l_drinking,
      language: l_language,
      living: l_living,
      relashionship: l_relashionship,
      sexuality: l_sexuality,
      smoking: l_smoking
    };

    this.setState({
      userInformation: {
        "appearance": l_appearance,
        "children": l_chidren,
        "drinking": l_drinking,
        "language": l_language,
        "living": l_living,
        "relashionship": l_relashionship,
        "sexuality": l_sexuality,
        "smoking": l_smoking
      },
      selectedNum: serviceNum
    })

    // this.serviceNum = serviceNum;
    // this.props.updatePersonalInfo(userData.email, userData.firebaseID, userInformation, 'PdiHnIR3tJAqD11o!QF7HZg', 'profileInformationPage')
    this.props.dispatch(updateUserInformation( userData.uid, l_userInformation, 'Information' ));
    userData.information = l_userInformation;
    this.props.dispatch(setUserData(userData));
    Globals.userData = userData;
  }

  renderChildren() {
    return this.state.listInformationDetails
    .map((value, key) => {
      return (
        <View style={ [styles.itemViewContainer] } key={key} >
          <TouchableOpacity style={{ flex: 1 }} onPress={()=>{ this.onSetService(key) }} >
            <Text style={ this.state.selectedNum == key ? styles.selectedTextContainer : styles.unSelectedTextContainer } >{value}</Text>
          </TouchableOpacity>
          {
            this.state.selectedNum == key ? <Icon name="check" size={30} color="#1bb404" /> : null
          }
        </View>
      );
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 20 }} />
        {
          this.renderChildren()
        }
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

export default connect(mapStateToProps)(InformationScreen)
