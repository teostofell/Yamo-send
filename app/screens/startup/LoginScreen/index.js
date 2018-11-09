import React, {Component} from 'react';
import { TouchableOpacity, Dimensions, Alert } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box';
import { connect } from 'react-redux';

import { setUserData } from '../../../store/userData';
import { loginUser } from '../../../store/session'
import { readUserData } from '../../../store/firebaseData'
import { changeAppRoot } from '../../../store/app'

import LoadingIndicator from '../../../components/LoadingIndicator'

import Images from '../../../resource/Images';
import styles from './styles'
import Globals from '../../../Globals';
import UserData from '../../../Global/UserData';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
    
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.onClickCheckBox = this.onClickCheckBox.bind(this);

    this.state = {
      secureTextEntry: true,
      checkData: true,
      visible: false,
      firebaseUser: null,
      apiUser: null,
    };
  }

  componentWillMount() {
    // StatusBar.setHidden(true);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageName == "loginPage") {
      if (!prevProps.error && this.props.error) {
        this.setState({
          firebaseAuth: null
        })
        Alert.alert(
          "Login Error",
          this.props.error,
          [
            {text: 'OK', onPress: () => {
            }},
          ]
        );
        return;
      }
    }

    if ( !prevProps.firebaseAuth && this.props.firebaseAuth && this.props.pageName == "loginPage" ) {
      this.setState({
        firebaseAuth: this.props.firebaseAuth
      })
      this.props.dispatch(readUserData(this.props.firebaseAuth.uid, 'loginPage'));
    }

    if ( !prevProps.firebaseUser && this.props.firebaseUser && this.props.firebasePageName == "loginPage" ) {
      this.props.dispatch(changeAppRoot('after-login'))
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
    ['email', 'password']
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

  onSubmitEmail() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.password.blur();
  }

  onSubmit() {
    let errors = {};
    let values = {};

    ['email', 'password']
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } else {
          values[name] = value;
          if ('password' === name && value.length < 6) {
            errors[name] = 'Too short';
          }
        }
      });

      if (errors['email'] == null && errors['password'] == null) {
        this.email.blur();
        this.password.blur();
        this.login(values['email'], values['password']);
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
  
  onClickCheckBox() {

  }

  signup() {
    this.props.navigation.navigate('selectGenderScreen')
  }

  login(i_email, i_pass) {
    // this.props.login(i_email, i_pass);
    this.props.dispatch(loginUser(i_email, i_pass, "loginPage"))
  }

  render() {
    let { errors = {}, secureTextEntry, checkData, ...data } = this.state;

    let strLabel = {
      signupViaFacebook: {
        en: "SIGN UP VIA FACEBOOK",
        fr: "S’enregistrer via facebook"
      },
      youStillNoAccount: {
        en: "You still don't have an account?",
        fr: "You still don't have an account?"
      },
      signin: {
        en: "Sign In",
        fr: "Connexion"
      },
      signup: {
        en: "Sign Up",
        fr: "Inscription"
      },
      stayLoggedIn: {
        en: "Stay logged in",
        fr: "Restez connecté"
      },
      forgottenPassword: {
        en: "Forgotten password",
        fr: "Mot de passe oublié"
      },
      loginAccount: {
        en: "Log in to your account",
        fr: "Se connecter à son compte"
      },
    }

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps="always" >
          <View flex paddingH-25 paddingT-70 bg-white >
            <View style={{paddingVertical:16}}>
              <Text style={styles.titleContainer} >{strLabel.signin.fr}</Text>
            </View>
            
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
              returnKeyType='done'
              label='Password'
              placeHolder='Type your name'
              error={errors.password}
              title='Choose wisely'
              maxLength={30}
              characterRestriction={20}
              renderAccessory={this.renderPasswordAccessory}
            />

            <View style={styles.forgottenPasswordContainer}>
              <CheckBox 
                style={{ flex: 1, marginTop: 20 }} 
                onClick={()=>this.onClickCheckBox} 
                isChecked={checkData}
                checkBoxColor={'#fe1394'}
                rightText={strLabel.stayLoggedIn.fr}
              />
              <Button link text70 black label={strLabel.forgottenPassword.fr} marginT-20 />
            </View>

            <Button text70 white backgroundColor="#fe1394" label={strLabel.signin.fr} style={{marginTop: 40}}  onPress={this.onSubmit}/>
            <View style={{justifyContent :'center', alignItems: 'center', marginTop: 20}}>
              <Text>- OR -</Text>
            </View>
            
            <Button text70 white backgroundColor="#1c3b80" label={strLabel.signupViaFacebook.fr} style={{marginTop: 20}}/>

            <View style={styles.footer}>
              <Text style={{fontSize: 16}}>{strLabel.youStillNoAccount.fr}   </Text>
              <TouchableOpacity onPress={this.signup.bind(this)}>
                <Text style={{color: '#fe1394', fontSize: 18}}>{strLabel.signup.fr}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        { ( this.props.loading || this.props.firebaseLoading ) && <LoadingIndicator />}
      </View>
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

    // firebaseAuth: state.session.firebaseAuth,
    // loading: state.session.loading,
    // error: state.session.error,
    // firebaseUserDeleted: state.session.deleted,
    // restoring: state.session.restoring,
    // pageName: state.session.pageName,

    // firebaseApiPageName: state.userRegister.pageName,
  };
  return props;
}

export default connect(mapStateToProps)(LoginScreen)
