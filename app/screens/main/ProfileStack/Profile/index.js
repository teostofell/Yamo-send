import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Image, Platform, YellowBox, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import axios from 'axios';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { connect } from 'react-redux';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import deepDiffer from 'react-native/lib/deepDiffer'

import LoadingIndicator from '../../../../components/LoadingIndicator'

import Images from '../../../../resource/Images';
import styles from './styles'
import Globals from '../../../../Globals';
import { METRICS } from '../../../../resource/Metrics'

import { getUserPhotos } from '../../../../store/firebaseData';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

class ProfileScreen extends Component {
  state = {
    profilePercent: 1,
    userData: null,
    spinnerVisible: false,
    photoList: [],
    avatarNum: 0,
    randomVal: 0,
  }

  static onEnterSomeView() {
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      Alert.alert(
        "Error", this.props.error
      );
      return;
    }

    if (!prevProps.firebaseError && this.props.firebaseError) {
      Alert.alert(
        "Error", this.props.firebaseError
      );
      return;
    }

    if (deepDiffer(this.state.userData, Globals.userData)) {
      if (Globals.userData != null) {
        this.setState({
          userData: Globals.userData
        })
        // this.props.dispatch(getUserPhotos( Globals.userData.uid, 'Profile' ))
      }
    }

    // if (!prevProps.photoList && this.props.photoList && this.props.pageName == 'Profile') {
    //   console.log(this.props.photoList);
    //   var avatarNum = 0;
    //   for (var i = 0; i < this.props.photoList.length; i++) {
    //     let item = this.props.photoList[i];
    //     if (item.isPrivate) {
    //       avatarNum = i + 1;
    //     }
    //   }

    //   this.setState({
    //     photoList: this.props.photoList,
    //     avatarNum: avatarNum
    //   })
    // }
  }
  
  componentWillReceiveProps (nextProps) {
  }

  componentDidMount() {
    if (deepDiffer(this.state.userData, Globals.userData)) {
      if (Globals.userData != null) {
        this.setState({
          userData: Globals.userData,
          photoList: Globals.userPhotos,
          avatarNum: Globals.avatarNum
        })
        // this.props.dispatch(getUserPhotos( Globals.userData.uid, 'Profile' ))
      }
    }


  }

  back(number) {
    // this.props.navigation.navigate('First');
    
    // this.props.navigation.navigate.bind(null, "FirstTabStack")

    // Promise.all([
    //   navigation.dispatch(
    //     NavigationActions.reset({
    //       index: 0,
    //       // TabNav is a TabNavigator nested in a StackNavigator
    //       actions: [NavigationActions.navigate({ routeName: 'TabNav' })]
    //     })
    //   )
    // ]).then(() => navigation.navigate('specificScreen'))

    // this.props.navigation.navigate('FirstTabStack')
    // this.props.navigation.navigate(this.props.FirstTabStack);

    switch (Globals.tabNumber) {
      case 1:
        this.props.navigation.navigate("First");
        break;
      case 2:
        this.props.navigation.navigate("Second");
        break;
      case 3:
        this.props.navigation.navigate("Third");
        break;
      case 4:
        this.props.navigation.navigate("Fourth");
        break;
      case 5:
        this.props.navigation.navigate("Fifth");
        break;
      default:
        this.props.navigation.navigate("First");
        break;
    }
  }

  onLogout() {
    // this.setState({
    //   spinnerVisible: true,
    // });
    // const data = new FormData();
    // data.append('clientSessionID', this.props.clientSessionID);

    // axios({
    //   method: 'post',
    //   url: Globals.BaseUrl + '/users/logout',
    //   data: data
    // })
    // .then(response => {
    //   let r_status = response.status;
    //   let r_data = response.data;
    //   if (r_status = 200) {
    //     if (r_data.status == "OK") {
    //       global.storage.remove({
    //         key: 'loginState'
    //       });
    //       // Actions.main();
    //       Actions.main({ panHandlers: null })
    //     }
    //   }
    //   setTimeout(() => {
    //     this.setState({
    //       spinnerVisible: false,
    //     });
    //   }, 500)
    // })
    // .catch(error => {
    //   setTimeout(() => {
    //     this.setState({
    //       spinnerVisible: false,
    //     });
    //   }, 500)
    // });
  }

  onProfileEdit() {
    // Actions.editprofile();
    this.props.navigation.navigate('EditProfile');
  }

  render() {
    let userData = this.state.userData;
    let l_about = (userData && userData.about) ? userData.about : '';

    console.log("== interests 1 ==")
    console.log(userData);
    console.log("== interests 2 ==")

    var str_interests = "";
    if (userData && userData.interests) {
      for (var i = 0; i < userData.interests.length; i++)
      {
        str_interests = str_interests + "#" + userData.interests[i] + " ";
      }
    }

    let strLabel = {
      edit: {
        en: "Edit",
        fr: "Modifier"
      },
      logout: {
        en: "Logout",
        fr: "Déconnection"
      },
      about: {
        en: "ABOUT",
        fr: "A propos de moi"
      },
      interests: {
        en: "INTERESTS",
        fr: "Mes Intérêts"
      },
      profile: {
        en: "Profile",
        fr: "Profil"
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            if (deepDiffer(this.state.userData, Globals.userData)) {
              console.log("== interests 01 ==")
              if (Globals.userData != null) {
                console.log("== interests 02 ==")
                this.setState({
                  userData: Globals.userData,
                })
              }
            }
            if (deepDiffer(this.state.photoList, Globals.userPhotos)) {
              if (Globals.userData != null) {
                this.setState({
                  photoList: Globals.userPhotos,
                  avatarNum: Globals.avatarNum
                })
              }
            }
            this.setState({
              randomVal: Math.floor(Math.random() * 100) + 1
            })
          }}
        />
        <View  style={styles.container}>
          <View style={{ position: 'absolute', zIndex: 100, height: 40, width: WINDOW_WIDTH, marginTop: Platform.OS === 'ios' ? 30 : 10 }}>
            <View style={{ height: 40, width: WINDOW_WIDTH, justifyContent: 'center', position: 'absolute'}}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: 'bold' }}>{strLabel.profile.fr}</Text>
            </View>

            <View style={{ paddingTop: 2, marginLeft: 20, paddingRight: 20, height: 40, width: 60, }}>
              <TouchableOpacity onPress={()=>{ this.back(Globals.tabNumber); }}>
                <Icon name="arrow-left" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          <HeaderImageScrollView
            maxHeight={WINDOW_HEIGHT * 0.6}
            minHeight={80}
            renderHeader={() => 
              <View style={{ height: WINDOW_HEIGHT * 0.6, backgroundColor: 'transparent' }}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#efefef' }} >
                  <Image source={( this.state.photoList && this.state.photoList.length > 0 && this.state.avatarNum > 0 ) ? {uri: this.state.photoList[this.state.avatarNum - 1].url} : Images.profileAvatar} style={ styles.photoContainer } />
                </View>
        
                <View style={{ height: 40, width: WINDOW_WIDTH, marginTop: Platform.OS === 'ios' ? 30 : 10 }}>
                </View>
        
                <View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20, height: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                </View>
              </View>
            }
          >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View style={styles.detailContainer}>
                <View style={{ height: 270 * METRICS.scaleHeight, padding: 60 * METRICS.scaleHeight, paddingTop: 60 * METRICS.scaleHeight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.4)', borderBottomWidth: 1 }} >
                  <View style={{ justifyContent: 'center' }} >
                    <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: 'black' }} >{(userData && userData.name) ? userData.name : ''}, {(userData && userData.age) ? userData.age : ''}</Text>
                    <Text style={{ fontSize: 44 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.5)', paddingTop: 1 }} >{(userData && userData.city) ? userData.city : ''}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ width: 30 * METRICS.scaleWidth }} ></View>

                    <TouchableOpacity onPress={()=>{ this.onProfileEdit(); }}>
                      <View style={{ width: 257 * METRICS.scaleWidth, height: 125 * METRICS.scaleHeight, borderRadius: 45 * METRICS.scaleHeight, borderColor: '#fd2191', borderWidth: 2 * METRICS.scaleHeight, }} >
                        <View style={{ flex: 1, paddingLeft: 5 * METRICS.scaleWidth, paddingRight: 5 * METRICS.scaleWidth, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                          <Text style={{ fontSize: 44 * METRICS.scaleHeight, color: '#fd2191' }} >{strLabel.edit.fr}</Text>
                          <View style={{ width: 12 * METRICS.scaleWidth }} ></View>
                          <Image source={Images.profileEditIcon} style={{ width: 58 * METRICS.scaleHeight, height: 58 * METRICS.scaleHeight }} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ padding: 15, paddingBottom: 5 }} >
                  <View style={{ paddingBottom: 5 }} >
                    <Text style={{ fontSize: 48 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.about.fr}</Text>
                    <Text style={{ fontSize: 40 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.7)' }} >
                      { l_about }
                    </Text>
                  </View>

                  <View style={{ marginTop: 10, }} >
                    <Text style={{ fontSize: 48 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.interests.fr}</Text>
                    <Text style={{ fontSize: 40 * METRICS.scaleHeight, color: '#fd2191', paddingTop: 2 }} >
                    {str_interests}
                    </Text>
                  </View>
                  <View style={{ height: 30 }}></View>
                </View>
              </View>

              <View style={{ height: 300 }}></View>

            </View>
          </HeaderImageScrollView>
        </View>
        {/* { this.props.apiLoading && <LoadingIndicator /> }         */}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,

    loading: state.session.loading,
    error: state.session.error,
    firebaseAuth: state.session.firebaseAuth,

    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    photoList: state.firebaseData.photoList,
    pageName: state.firebaseData.pageName

  };
  return props;
}

export default connect(mapStateToProps)(ProfileScreen)
