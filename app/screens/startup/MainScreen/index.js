import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, StatusBar, YellowBox } from 'react-native';
import Swiper from 'react-native-swiper';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

import { setUserData } from '../../../store/userData';
import { restoreSession, logoutUser } from '../../../store/session'
import { readUserData } from '../../../store/firebaseData'
import { changeAppRoot } from '../../../store/app'

// import { getUser } from './store/userRegister'
// import { writeUserData, readUserData } from './store/firebaseApi'

import Globals from '../../../Globals';
import Images from '../../../resource/Images';
import styles from './styles'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module SafeAreaManager']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      firebaseUser: null,
      visibleSplash: true,
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.props.dispatch(restoreSession("mainScreen"));
  }

  componentWillMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageName == "mainScreen") {
      if (!prevProps.error && this.props.error) {
        this.setState({
          firebaseAuth: null,
          visibleSplash: false,
        })
        // SplashScreen.hide();
        return;
      }
    }

    if (!prevProps.restoringDone && this.props.restoringDone && this.props.restoringDone == true) {
      this.setState({
        visibleSplash: false
      })
    }

    if (!prevProps.firebaseAuth && this.props.firebaseAuth && this.props.firebasePageName == "mainScreen" ) {
      // firebase login callback props
      this.setState({
        firebaseAuth: this.props.firebaseAuth,
      })

      this.props.dispatch(readUserData(this.props.firebaseAuth.uid, 'mainScreen'));
    }

    if ( !prevProps.firebaseUser && this.props.firebaseUser && this.props.firebasePageName == "mainScreen" ) {
      // SplashScreen.hide();
      this.props.dispatch(setUserData(this.props.firebaseUser));

      this.props.dispatch(changeAppRoot('after-login'))
      Globals.userData = this.props.firebaseUser;
    }
  }

  onPressSignUp() {
    this.props.navigation.navigate('selectGenderScreen')
  }

  onPressSignIn() {
    this.props.navigation.navigate('loginScreen')
  }

  render() {
    let strLabel = {
      signup: {
        en: "SIGN UP",
        fr: "Inscription"
      },
      signin: {
        en: "SIGN IN",
        fr: "Connexion"
      },
      findsomeoneyoulike: {
        en: "Find someone you like",
        fr: "Rencontre près de chez toi…"
      },
      findpeopleyoulike: {
        en: "Find people you like",
        fr: "Inscription / Connexion"
      },
      chatwithpeople: {
        en: "Chat with people",
        fr: "Seul et  Célibataire?"
      },
      afteryoumatch: {
        en: "After you match with someone, go and chat with them",
        fr: "Découvre qui tu as croisé et discute avec eux !"
      },
      gooutandmeet: {
        en: "Go out and meet them",
        fr: "Saisi ta chance..."
      },
      asktheperson: {
        en: "Ask the person out and meet them.",
        fr: "Invite ton « coup de foudre » du quartier!"
      },
      welikeeachother: {
        en: "We like each other!",
        fr: "Attiré par une personne du voisinage ?"
      },
      findaperfect: {
        en: "Find a perfect person for you",
        fr: "Viens lui parler sur Yamo !"
      },
    }

    return (
      <View style={{flex: 1}}>
        <View style={{ flex: 1, zIndex: 1 }}>
          <View style={{flex: 75}}>
            <Swiper dot={<View style={ styles.swipeDotStyle } />} 
                    activeDot={<View style={ styles.swipeDotActiveStyle } />}
            >
              <View style={styles.slide}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} >
                  <Image source={Images.firstStepImage} style={styles.backgroundImage} />
                </View>
                <View style={styles.descBody}>
                  <Text style={styles.title}>
                    { strLabel.findsomeoneyoulike.fr }
                  </Text>
                  <Text style={styles.desc}>
                    { strLabel.findpeopleyoulike.fr }
                  </Text>
                </View>
              </View>
              <View style={styles.slide}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} >
                  <Image source={Images.secondStepImage} style={styles.backgroundImage} />
                </View>
                <View style={styles.descBody}>
                  <Text style={styles.title}>
                    { strLabel.chatwithpeople.fr }
                  </Text>
                  <Text style={styles.desc}>
                    { strLabel.afteryoumatch.fr }
                  </Text>
                </View>
              </View>
              <View style={styles.slide}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} >
                  <Image source={Images.thirdStepImage} style={styles.backgroundImage} />
                </View>
                <View style={styles.descBody}>
                  <Text style={styles.title}>
                    { strLabel.gooutandmeet.fr }
                  </Text>
                  <Text style={styles.desc}>
                    { strLabel.asktheperson.fr }
                  </Text>
                </View>
              </View>
              <View style={styles.slide}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} >
                  <Image source={Images.fourthStepImage} style={styles.backgroundImage} />
                </View>
                <View style={styles.descBody}>
                  <Text style={styles.title}>
                    { strLabel.welikeeachother.fr }
                  </Text>
                  <Text style={styles.desc}>
                    { strLabel.findaperfect.fr }
                  </Text>
                </View>
              </View>
            </Swiper>
          </View>
          
          <View style={{flex: 7, flexDirection: 'row'}} >
            <TouchableOpacity onPress={this.onPressSignUp.bind(this)} style={[styles.buttonContainer, {backgroundColor: '#ffffff'}]}>
              <Text style={[ styles.buttonText, {color: '#fa448a'}]}> { strLabel.signup.fr } </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressSignIn.bind(this)} style={[styles.buttonContainer, {backgroundColor: '#790030'}]}>
              <Text style={[ styles.buttonText, {color: '#ffffff'}]}> { strLabel.signin.fr } </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        { this.state.visibleSplash == true && 
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 2 }}>
            <Image source={Images.splashImage} style={styles.backgroundImage} />
          </View>
        }

        {(this.props.restoring || this.props.loading || this.props.firebaseLoading) && <LoadingIndicator />}
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
    firebaseUserDeleted: state.session.deleted,
    restoring: state.session.restoring,
    pageName: state.session.pageName,
    restoringDone: state.session.restoringDone,

    firebaseUser: state.firebaseData.firebaseUser,
    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    firebasePageName: state.firebaseData.pageName

    // firebaseApiPageName: state.userRegister.pageName,
  };
  return props;
}

export default connect( mapStateToProps )(MainScreen)
