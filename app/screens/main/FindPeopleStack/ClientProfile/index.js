import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Platform, YellowBox, Alert , Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-swiper';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import { connect } from 'react-redux';
import deepDiffer from 'react-native/lib/deepDiffer'
import geolib from "geolib";
import { NavigationActions } from 'react-navigation'

import LoadingIndicator from '../../../../components/LoadingIndicator'

import Images from '../../../../resource/Images';
import styles from './styles'
import Globals from '../../../../Globals';
import { METRICS } from '../../../../resource/Metrics'

import { getUserPhotos, likeUser, getLikeThisUser, visitUser, readUserData } from '../../../../store/firebaseData'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;


class ClientProfileScreen extends Component {

  state = {
    clientBase: {
    },
    photoList: [],
    avatarNum: 0,
    visible: false,
    modalY: new Animated.Value(WINDOW_HEIGHT),
    likedMe: false
  }

  constructor(props) {
    super(props);

  };

  componentDidMount() {
    let userData = Globals.userData;

    this.setState({
      clientBase: this.props.navigation.state.params.client,
      from: this.props.navigation.state.params.from,
    });

    this.props.dispatch(visitUser( userData.uid, userData.name, userData.email, this.props.navigation.state.params.avatarPhoto ? this.props.navigation.state.params.avatarPhoto.url : null, this.props.navigation.state.params.client.uid, 'ClientProfile' ))

    this.props.dispatch(readUserData(this.props.navigation.state.params.client.uid, 'ClientProfile'));
    // this.props.dispatch(getLikeThisUser( userData.uid, this.props.navigation.state.params.client.uid, 'ClientProfile' ))
    // this.props.dispatch(getUserPhotos( this.props.navigation.state.params.client.uid, 'ClientProfile' ))

    console.log("== client profile 0 ==")
    console.log(this.props.navigation.state.params.client)
    console.log("== client profile 1 ==")
  }

  componentWillMount() {
    const setParamsAction = NavigationActions.setParams({
      params: {hideTabBar: true}
    });
    this.props.navigation.dispatch(setParamsAction);
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    let userData = Globals.userData;
    if (!prevProps.firebaseError && this.props.firebaseError) {
      Alert.alert(
        "Error", this.props.firebaseError
      );
      return;
    }

    if (this.props.pageName == "ClientProfile") {
      if (deepDiffer(this.state.clientBase, this.props.firebaseUser)) {
        if (this.props.firebaseUser != null && this.props.firebaseUser.email != null ) {
          this.setState({
            clientBase: this.props.firebaseUser
          });
          this.props.dispatch(getLikeThisUser( userData.uid, this.props.navigation.state.params.client.uid, 'ClientProfile' ))
        }
      }
  
      if (this.state.likedMe != this.props.likedMe) {
        if (this.props.likedMe != null) {
          this.setState({
            likedMe: this.props.likedMe
          })
          if (this.state.photoList.length == 0) {
            this.props.dispatch(getUserPhotos( this.props.navigation.state.params.client.uid, 'ClientProfile' ))
          }
        }
      }

      if (!prevProps.photoList && this.props.photoList) {
        var avatarNum = 0;
        for (var i = 0; i < this.props.photoList.length; i++) {
          let item = this.props.photoList[i];
          if (item.isPrivate) {
            avatarNum = i + 1;
          }
        }
  
        this.setState({
          photoList: this.props.photoList,
          avatarNum: avatarNum
        })
      }

    }
  }

  onLikeThisPerson() {
    let userData = Globals.userData;

    this.props.dispatch(likeUser( userData.uid, userData.name, userData.email, this.props.navigation.state.params.avatarPhoto ? this.props.navigation.state.params.avatarPhoto.url : null, this.state.clientBase.uid, 'ClientProfile' ))
  }

  onMessageWith() {
    // this.props.navigation.navigate('Second');
    Globals.isMessageTab = true;

    switch (this.state.from) {
      case 'FindPeople':
        Globals.tabClientNumber = 1;
        break;
      case 'Favourite':
        Globals.tabClientNumber = 3;
        break;
      default:
        Globals.tabClientNumber = 1;
        break;
    }

    this.props.navigation.navigate('Message', {client: this.state.clientBase, avatar: this.state.photoList.length > 0 && this.state.avatarNum > 0 ? this.state.photoList[this.state.avatarNum - 1].url : ''});
  }

  back() {
    switch (this.state.from) {
      case 'FindPeople':
        this.props.navigation.goBack();
        this.props.navigation.navigate("FindPeople");
        break;
      case 'Favourite':
        this.props.navigation.goBack();
        this.props.navigation.navigate("Favourite");
        break;
      default:
        this.props.navigation.goBack();
        break;
    }
    Globals.tabClientNumber = 0;
  }

  openModal() {
    Animated.timing(this.state.modalY, {
        duration: 300,
        toValue: 0
     }).start();
    }

  closeModal() {
    Animated.timing(this.state.modalY, {
      duration: 300,
      toValue: WINDOW_HEIGHT
    }).start();
  }

  render() {
    let strLabel = {
      like: {
        en: "Like?",
        fr: "J’aime?"
      },
      logout: {
        en: "Logout",
        fr: "Logout"
      },
      about: {
        en: "ABOUT",
        fr: "A propos"
      },
      interests: {
        en: "INTERESTS",
        fr: "Mes Intérêts"
      },
      profile: {
        en: "PROFILE",
        fr: "Profil"
      },
      information: {
        en: "INFORMATION",
        fr: "Information"
      },
      Appearance: {
        en: "Appearance",
        fr: "Apparence"
      },
      Children: {
        en: "Children",
        fr: "Enfants"
      },
      Drinking: {
        en: "Drinking",
        fr: "Je Bois"        // Drinking
      },
      Speak: {
        en: "I Speak",
        fr: "Je Parle"
      },
      Living: {
        en: "Living",
        fr: "Je vis"
      },
      Relationship: {
        en: "Relationship",
        fr: "Relation"
      },
      Sexuality: {
        en: "Sexuality",
        fr: "Sexualité"
      },
      Smoking: {
        en: "Smoking",
        fr: "Je fume"         // Smoking
      },
      SendAMessage: {
        en: "Send a message",
        fr: "Send a message"
      }
    }

    let userData = Globals.userData;
    var dist = 0;
    if (this.state.clientBase != null && this.state.clientBase.coords != null && userData.coords != null) {
      dist = geolib.getDistance(
        {latitude: userData.coords.lat, longitude: userData.coords.long},
        {latitude: this.state.clientBase.coords.lat, longitude: this.state.clientBase.coords.long},
      );
      dist = dist / 1000;
    }

    return (
      <View style={styles.container}>
        <View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT, left: 0, top: 0, position: 'absolute' }}>
          <View style={{ position: 'absolute', zIndex: 100, height: 40, width: WINDOW_WIDTH, marginTop: Platform.OS === 'ios' ? 30 : 10 }}>
            <View style={{ height: 40, width: WINDOW_WIDTH, justifyContent: 'center', position: 'absolute'}}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: 'bold' }}>{strLabel.profile.fr}</Text>
            </View>
            <View style={{ paddingTop: 2, paddingLeft: 20, paddingRight: 20, height: 40, }}>
              <TouchableOpacity onPress={()=>{ this.back(); }}>
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
                  <Image source={( this.state.photoList.length > 0 && this.state.avatarNum > 0 ) ? {uri: this.state.photoList[this.state.avatarNum - 1].url} : Images.profileAvatar} style={ styles.photoContainer } />
                </View>
              </View>
            }
            renderTouchableFixedForeground={() =>
              <TouchableOpacity onPress={()=>{ this.openModal() }}>
                <View style={{ height: WINDOW_HEIGHT * 0.6, backgroundColor: 'transparent' }} />
              </TouchableOpacity>
            }
          >
            <View style={styles.detailContainer}>
              <View style={{ height: 90, padding: 15, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.4)', borderBottomWidth: 1 }} >
                <View style={{ justifyContent: 'center', width: '65%' }} >
                  <Text style={{ fontSize: 22, color: 'black' }} >{this.state.clientBase.name}, {this.state.clientBase.age}</Text>
                  <Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.5)', paddingTop: 1 }} >{this.state.clientBase.city} ({'A ' + dist + 'km'})</Text>
                </View>
                
                { !this.state.likedMe && <TouchableOpacity onPress={()=>{ this.onLikeThisPerson() }} disabled={this.state.likedMe} style={{ opacity: this.state.likedMe ? 0.3 : 1 }} >
                  <View style={{ width: 100, height: 40, borderRadius: 16, backgroundColor: '#fd2191' }} >
                    <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                      <Text style={{ fontSize: 16, color: 'white' }} >{ strLabel.like.fr }</Text>
                      <View style={{ width: 5 }} ></View>
                      <Icon2 name="heart" size={20} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>}

                { this.state.likedMe && <View style={{ width: 100, height: 40, borderRadius: 16, backgroundColor: '#ffffff' }} >
                    <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                      <Image source={Images.appIconImage} style={{ width: 100, height: 40, resizeMode: "contain" }} />
                    </View>
                  </View>}
              </View>

              <View style={{ padding: 15, paddingBottom: 5 }} >
                <View style={{ paddingBottom: 5 }} >
                  <Text style={{ fontSize: 17, color: 'rgba(0, 0, 0, 0.3)' }} >{ strLabel.about.fr }</Text>
                  <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.7)' }} >
                  { this.state.clientBase.about }
                  </Text>
                </View>

                <View style={{ marginTop: 10, }} >
                  <Text style={{ fontSize: 17, color: 'rgba(0, 0, 0, 0.3)' }} >{ strLabel.information.fr }</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                  { this.state.clientBase.information != null && this.state.clientBase.information.appearance != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Appearance.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.appearance != '' ? this.state.clientBase.information.appearance : 'Add' }</Text>
                    </View>
                  </View>}

                  { this.state.clientBase.information != null && this.state.clientBase.information.children != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Children.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.children != '' ? this.state.clientBase.information.children : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.drinking != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Drinking.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.drinking != '' ? this.state.clientBase.information.drinking : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.language != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Speak.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.language != '' ? this.state.clientBase.information.language : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.living != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Living.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.living != '' ? this.state.clientBase.information.living : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.relashionship != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Relationship.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.relashionship != '' ? this.state.clientBase.information.relashionship : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.sexuality != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Sexuality.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.sexuality != '' ? this.state.clientBase.information.sexuality : 'Add' }</Text>
                    </View>
                  </View>}
                  
                  { this.state.clientBase.information != null && this.state.clientBase.information.smoking != '' && <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Smoking.fr}</Text>
                    <View style={{ flex: 1 }} >
                      <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{this.state.clientBase.information != null && this.state.clientBase.information.smoking != '' ? this.state.clientBase.information.smoking : 'Add' }</Text>
                    </View>
                  </View>}
                </View>

                <View style={{ marginTop: 20, }} >
                  <Text style={{ fontSize: 17, color: 'rgba(0, 0, 0, 0.3)' }} >{ strLabel.interests.fr }</Text>
                  {
                    this.state.clientBase.interests == null ? (
                      null
                    ) : (

                      <Text style={{ fontSize: 16, color: '#fd2191', paddingTop: 2 }} >
                        {
                          this.state.clientBase.interests
                          .map((value, key) => {
                            return (
                              "#" + value + " "
                            );
                          })
                        }
                      </Text>
                    )
                  }
                </View>

                <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                  <TouchableOpacity onPress={()=>{ this.onMessageWith() }} >
                    <View style={{ flex: 1, height: 60, borderRadius: 20, borderColor: '#fd2191', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} >
                      <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: '#fd2191', alignItems: 'center' }} >{strLabel.SendAMessage.fr}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 80 }} />
              </View>
            </View>
          </HeaderImageScrollView>
        </View>

        <Animated.View style={[ styles.modal, { transform: [ {translateY: this.state.modalY}] }]}>
          {(() => {
            if (this.state.photoList.length > 1) {
              return <Swiper
                loop={false}
                dot={
                  <View />
                }
                activeDot={
                  <View />
                }
              >
              {(() => {
                let row = []
                for (var i = 0; i < this.state.photoList.length; i++) {
                  // row[i] = <Image source={{ uri: this.state.photoList[i] }} style={ [styles.photoContainer, {resizeMode: 'contain'}] } key={i} />
                  row[i] = <Image source={{uri: this.state.photoList[i].url}} style={ [styles.photoContainer, {resizeMode: 'contain'}] } key={i} />
                }
                return row
              })()}
              </Swiper>
            } else if (this.state.photoList.length == 1) {
              // return <Image source={{ uri: this.state.photoList[0] }} style={ [styles.photoContainer, {resizeMode: 'contain'}] } />
              return <Image source={{uri: this.state.photoList[0].url}} style={ [styles.photoContainer, {resizeMode: 'contain'}] } />
            } else {
              return <Image source={Images.profileAvatar} style={ styles.photoContainer } />
            }
          })()}
          <TouchableOpacity onPress={() => this.closeModal() } style={{ position: 'absolute', left: 20, top: 20, }}  >
            <Icon3 name="cross" size={30} color="gray" />
          </TouchableOpacity>

        </Animated.View>
        { this.props.firebaseLoading && <LoadingIndicator /> }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,

    // loading: state.session.loading,
    // error: state.session.error,
    // firebaseAuth: state.session.firebaseAuth,

    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    firebaseUser: state.firebaseData.firebaseUser,
    photoList: state.firebaseData.photoList,
    // userList: state.firebaseData.userList,
    // filterData: state.firebaseData.filterData,
    // likedList: state.firebaseData.likedList,
    likedMe: state.firebaseData.likedMe,
    pageName: state.firebaseData.pageName
  };
  return props;
}

export default connect( mapStateToProps )(ClientProfileScreen)
