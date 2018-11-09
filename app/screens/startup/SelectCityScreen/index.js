import React, {Component} from 'react';
import { Alert } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';

import { setUserData } from '../../../store/userData';
// import { loginUser, logoutUser } from '../store/session'
// import { getUser } from '../store/userRegister'
import { updateUserData } from '../../../store/firebaseData'
import { changeAppRoot } from '../../../store/app'

import LoadingIndicator from '../../../components/LoadingIndicator'

import Images from '../../../resource/Images';
import styles from './styles'
import Globals from '../../../Globals';

class SelectCityScreen extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      errors: '',
      visible: false,
      cityVal: '',
    };
  }

  componentDidUpdate(prevProps) {
  }

  componentWillReceiveProps (nextProps) {
  }

  onSubmit() {
    let errors = {};
    if (this.state.cityVal == "") {
      // errors[name] = 'Should not be empty';
    } else {
      Globals.signupCity = this.state.cityVal;

      this.props.dispatch(updateUserCity( this.props.user.uid, Globals.signupCity, 'selectCityPage' ));
      this.props.dispatch(changeAppRoot('after-login'))
      let r_user = this.props.user;
      r_user.city = Globals.signupCity;
      this.props.dispatch(setUserData(r_user));
      Globals.userData = r_user;
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }
  
  render() {
    let { errors = {}, ...data } = this.state;

    return (
      <View flex paddingH-25 paddingT-70 bg-white>
        <Text style={styles.titleContainer} >SIGN UP</Text>
        <Text style={styles.descriptContainer} style={{marginBottom: 20}}>Sign up your account now!</Text>

        <GooglePlacesAutocomplete
          placeholder='Select your city'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed='auto'    // true/false/undefined
          fetchDetails={true}
          renderDescription={(row) => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.setState({
              cityVal: data.description
            })
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            key: 'AIzaSyCU4YlcxKL5lleN5wKiRfLhoJPfGXOjTRs',
            // language: 'en', // language of the results
            language: 'fr', // language of the results
            types: '(cities)' // default: 'geocode'
          }}
          styles={{
            description: {
              fontWeight: 'bold'
            },
            textInputContainer: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
              borderBottomWidth: 2,
              borderColor: 'rgba(0, 0, 0, 0.8)'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}
    
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        />

        <Button text70 white backgroundColor="#fe1394" label="DONE" style={{marginBottom: 40}} onPress={this.onSubmit.bind(this)}/>
        { ( this.props.firebaseLoading ) && <LoadingIndicator />}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,

    firebaseUser: state.firebaseData.firebaseUser,
    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    firebasePageName: state.firebaseData.pageName
  };
  return props;
}

export default connect(mapStateToProps)( SelectCityScreen )