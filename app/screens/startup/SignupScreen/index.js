import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import Geocoder from 'react-native-geocoder';
import { connect } from 'react-redux';

import { setUserData } from '../../../store/userData';
import { signupUser } from '../../../store/session'
// import { getUser } from '../store/userRegister'
import { writeUserData } from '../../../store/firebaseData'
import { changeAppRoot } from '../../../store/app'

import LoadingIndicator from '../../../components/LoadingIndicator'

import Images from '../../../resource/Images';
import styles from './styles'
import Globals from '../../../Globals';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUserName = this.onSubmitUserName.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.usernameRef = this.updateRef.bind(this, 'username');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.ageRef = this.updateRef.bind(this, 'age');
    
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      username: '',
      secureTextEntry: true,
    // Geo Location
      latitude: null,
      longitude: null,
      locationError: null,
      cityName: null,

      // Spinner
      visible: false,

      firebaseAuth: null,
      apiUser: null,
    };

    Globals.signupCity = "";
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  componentDidMount() {
    var myApiKey = "AIzaSyCU4YlcxKL5lleN5wKiRfLhoJPfGXOjTRs";
    Geocoder.fallbackToGoogle(myApiKey);

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateGeoLocation(position.coords.latitude, position.coords.longitude);
        if (Globals.signupCity == "") {
          var NY = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          Geocoder.geocodePosition(NY).then(res => {
            Globals.signupCity = res[0].locality + ", " + res[0].country;
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              locationError: null,
              cityName: res[0].locality,
            });
          })
          .catch(err => console.log(err))
        }
      },
      (errors) => this.setState({ locationError: errors.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      this.setState({
        firebaseAuth: null
      })
      Alert.alert(
        "Signup Error",
        this.props.error,
        [
          {text: 'OK', onPress: () => {
          }},
        ]
      );
      return;
    }
    
    if (!prevProps.firebaseAuth && this.props.firebaseAuth && this.props.pageName == 'signupPage' ) {
      this.setState({
        firebaseAuth: this.props.firebaseAuth
      })
      this.props.dispatch(writeUserData(Globals.signupEmail, Globals.signupUserName, Globals.signupAge, Globals.signupGender, null, Globals.signupCity, 'signupPage'));
    }

    if ( !prevProps.firebaseUser && this.props.firebaseUser && this.props.firebasePageName == "signupPage" ) {
      if ( Globals.signupCity == "" ) {
        this.props.navigation.navigate('selectCityScreen')
      } else {
        this.props.dispatch(changeAppRoot('after-login'))
      }
      
      this.props.dispatch(setUserData(this.props.firebaseUser));
      Globals.userData = this.props.firebaseUser;
    }
  }

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  onChangeText(text) {
    ['username', 'email', 'password', 'age']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onAccessoryPress() {
    this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
  }

  onSubmitUserName() {
    this.username.blur();
  }

  onSubmitEmail() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.username.focus();
  }

  onCallSignupAPI() {
    
  }

  onSubmit() {
    let errors = {};
    let values = {};

    ['username', 'email', 'password', 'age']
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } else {
          values[name] = value;
          if ('password' === name && value.length < 6) {
            errors[name] = 'Too short';
          }
          // if ('age' === name && value < 10) {
          //   errors[name] = 'Should select your age';
          // }
        }
      });

      if (errors['username'] == null && errors['email'] == null && errors['password'] == null && errors['age'] == null) {
        Globals.signupEmail = values['email'];
        Globals.signupUserName = values['username'];
        Globals.signupPassword = values['password'];
        Globals.signupAge = values['age'];
  
        this.props.dispatch(signupUser(Globals.signupEmail, Globals.signupPassword, 'signupPage'));
        
        this.setState({ errors });
      } else {
        this.setState({ errors });
      }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  renderPasswordAccessory() {
    let { secureTextEntry } = this.state;

    // let name = secureTextEntry?
    //   'visibility':
    //   'visibility-off';
    let name = secureTextEntry?
        'SHOW':
        'HIDE';

    return (
      <Text style={{color: '#959595'}} onPress={this.onAccessoryPress}>
        {name}
      </Text>
    );
  }

	signin() {
    this.props.navigation.navigate('loginScreen')
  }
  
  updateGeoLocation(lat, long) {
    this.setState({
      latitude: lat,
      longitude: long
    });
  }

  render() {
    let { errors = {}, secureTextEntry, ...data } = this.state;

    var ageIndex = [];
    for (var i = 1; i < 100; i++) {
      ageIndex[i - 1] = {value: i};
    }

    let strLabel = {
      signupSubLabel: {
        en: "Sign up your account now!",
        fr: "Enregistre-toi maintenant!"
      },
      typeYourName: {
        en: "Type your name",
        fr: "Saisi ton nom"
      },
      selectAge: {
        en: "Select your age",
        fr: "Choisi ton age"
      },
      nextStepSignup: {
        en: "Next step in sign up",
        fr: "Etape suivante d’enregistrement"
      },
      youAlreadyAccount: {
        en: "You already have an account?",
        fr: "Tu as déjà un compte ?"
      },
      signin: {
        en: "Sign In",
        fr: "Connexion"
      },
      signup: {
        en: "Sign Up",
        fr: "Inscription"
      }

    }

    return (
      <KeyboardAwareScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps="always" >
        <View flex paddingH-25 paddingT-70 bg-white>
          <Text style={styles.titleContainer} >{strLabel.signup.fr}</Text>
          <Text style={styles.descriptContainer} style={{marginBottom: 20}}>{strLabel.signupSubLabel.fr}</Text>

          <TextField
              ref={this.emailRef}
              value={data.email}
              // defaultValue={defaultEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              tintColor={'#fe1394'}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEmail}
              returnKeyType='next'
              label='Email Address'
              error={errors.email}
            />

          <TextField
            ref={this.passwordRef}
            value={data.password}
            secureTextEntry={secureTextEntry}
            autoCapitalize='none'
            tintColor={'#fe1394'}
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitPassword}
            returnKeyType='next'
            label='Password'
            placeHolder='Type your name'
            error={errors.password}
            title='Choose wisely'
            maxLength={30}
            characterRestriction={20}
            renderAccessory={this.renderPasswordAccessory}
          />

          <TextField
            ref={this.usernameRef}
            value={data.username}
            tintColor={'#fe1394'}
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitUserName}
            returnKeyType='done'
            label={strLabel.typeYourName.fr}
            error={errors.username}
          />

          <Dropdown 
            ref={this.ageRef}
            label={strLabel.selectAge.fr}
            data={ageIndex} 
            value={data.age}
            error={errors.age}
          />
          
          <Button text70 white backgroundColor="#fe1394" label={strLabel.nextStepSignup.fr} style={{marginTop: 40}} onPress={this.onSubmit.bind(this)}/>

          <View style={styles.bottomTextCont}>
            <Text style={[styles.signupText, {fontSize: 16}]}>{strLabel.youAlreadyAccount.fr}   </Text>
            <TouchableOpacity onPress={this.signin.bind(this)}><Text style={{color: '#fe1394', fontSize: 18}}>{strLabel.signin.fr}</Text></TouchableOpacity>
          </View>
        </View>
        { ( this.props.loading || this.props.firebaseLoading ) && <LoadingIndicator />}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,

    firebaseAuth: state.session.firebaseAuth,
    loading: state.session.loading,
    error: state.session.error,
    pageName: state.session.pageName,

    firebaseUser: state.firebaseData.firebaseUser,
    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    firebasePageName: state.firebaseData.pageName

  };
  return props;
}

export default connect(mapStateToProps)(SignupScreen)