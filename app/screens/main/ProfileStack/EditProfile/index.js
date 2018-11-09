import React, {Component} from 'react';

import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ScrollView, Platform, Alert, YellowBox } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import deepDiffer from 'react-native/lib/deepDiffer'
import { NavigationActions, NavigationEvents } from 'react-navigation';

import { logoutUser } from '../../../../store/session'
import { changeAppRoot } from '../../../../store/app'
import { setUserData } from '../../../../store/userData';
import { uploadPhoto, getUserPhotos, deletePhoto, setDefaultPhoto } from '../../../../store/firebaseData';

import LoadingIndicator from '../../../../components/LoadingIndicator'

import Images from '../../../../resource/Images';
import styles from './styles'
import Globals from '../../../../Globals';
import { METRICS } from '../../../../resource/Metrics'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

class EditProfileScreen extends Component {
  state = {
    isModalVisible: false,
    isRefreshScreen: false,
    informationList: [],
    photoList: [],
    avatarNum: 0,

    avatarPath: '',
    avatarThumb: '',
    avatarID: '',
    basePhotoURL: '',

    isSpinnerVisible: false,
    isGalleryButtonActive: false,
    selectedPhotoNum: 0,
    selectedPhotoURL: '',

    userData: null
  }

  static onEnterSomeView() {
    Actions.refresh({action: new Date().getTime() });
  }

  componentDidMount() {
    this.setState({
      informationList: ['Appearance', 'Children', 'Drinking', 'I speak', 'Living', 'Relationship', 'Sexuality', 'Smoking'],
      photoList: Globals.userPhotos,
      avatarNum: Globals.avatarNum
    });

    if (deepDiffer(this.state.userData, Globals.userData)) {
      if (Globals.userData != null) {
        this.setState({
          userData: Globals.userData
        })
      }
      // this.getUserPictures(Globals.userData);
    }
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
      }
      this.getUserPictures(Globals.userData);
    }

    if (!prevProps.photoList && this.props.photoList && this.props.pageName == 'EditProfile') {
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
      Globals.userPhotos = this.props.photoList;
      Globals.avatarNum = avatarNum;
      Globals.avatarPhoto = avatarNum > 0 ? this.props.photoList[avatarNum - 1] : null
    }

    // if (prevProps.loading && !this.props.loading && !this.props.firebaseUser) {
    //   Globals.startupPage = true;
    //   Actions.main({ panHandlers: null })
    // }
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
    // if (this.props.apiPageName == 'editProfilePage') {
    //   if (!prevProps.apiPhotoSuccess && this.props.apiPhotoSuccess) {
    //     if (this.props.apiPhotoAPIType == 1) {
    //       // add photo api
    //       var l_avatarPath = '', l_avatarThumb = '', l_avatarID = '';
    //       var l_photoList = this.props.apiPhotoAsset.assetList;
    //       var l_basePhotoURL = this.props.apiPhotoAsset.basePath;

    //       if (this.props.apiPhotoAsset.avatar.isAvatar && this.props.apiPhotoAsset.avatar.path != '' && this.props.apiPhotoAsset.avatar.thumbnail != '' ) {
    //         l_avatarPath = l_basePhotoURL + this.props.apiPhotoAsset.avatar.path;
    //         l_avatarThumb = l_basePhotoURL + this.props.apiPhotoAsset.avatar.thumbnail;
    //         l_avatarID = this.props.apiPhotoAsset.avatar.assetID;
            
    //         this.setState({
    //           avatarPath: l_avatarPath,
    //           avatarThumb: l_avatarThumb,
    //           photoList: l_photoList,
    //           avatarID: l_avatarID,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = l_avatarPath;
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       } else {
    //         this.setState({
    //           avatarPath: 'http://195.201.223.18/default_avatar.png',
    //           avatarThumb: 'http://195.201.223.18/default_avatar.png',
    //           avatarID: '',
    //           photoList: l_photoList,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = 'http://195.201.223.18/default_avatar.png';
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       }
    //     }
    //     if (this.props.apiPhotoAPIType == 2) {
    //       // delete photo api
    //       var l_avatarPath = '', l_avatarThumb = '', l_avatarID = '';
    //       var l_photoList = this.props.apiPhotoAsset.assetList;
    //       var l_basePhotoURL = this.props.apiPhotoAsset.basePath;

    //       if (this.props.apiPhotoAsset.avatar.isAvatar && this.props.apiPhotoAsset.avatar.path != '' && this.props.apiPhotoAsset.avatar.thumbnail != '' ) {
    //         l_avatarPath = l_basePhotoURL + this.props.apiPhotoAsset.avatar.path;
    //         l_avatarThumb = l_basePhotoURL + this.props.apiPhotoAsset.avatar.thumbnail;
    //         l_avatarID = this.props.apiPhotoAsset.avatar.assetID;
            
    //         this.setState({
    //           avatarPath: l_avatarPath,
    //           avatarThumb: l_avatarThumb,
    //           photoList: l_photoList,
    //           avatarID: l_avatarID,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = l_avatarPath;
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       } else {
    //         this.setState({
    //           avatarPath: '',
    //           avatarThumb: '',
    //           avatarID: '',
    //           photoList: l_photoList,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = 'http://195.201.223.18/default_avatar.png';
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       }
    //       Alert.alert(
    //         "Success",
    //         "Photo was removed successfully",
    //         [
    //           {text: 'OK', onPress: () => {
    //             this.setState({
    //               selectedPhotoURL: this.state.avatarPath,
    //               selectedPhotoNum: 0,
    //             })
    //           }},
    //         ]
    //       );          
    //     }
    //     if (this.props.apiPhotoAPIType == 3) {
    //       // set default photo api
    //       var l_avatarPath = '', l_avatarThumb = '', l_avatarID = '';
    //       var l_photoList = this.props.apiPhotoAsset.assetList;
    //       var l_basePhotoURL = this.props.apiPhotoAsset.basePath;

    //       if (this.props.apiPhotoAsset.avatar.isAvatar && this.props.apiPhotoAsset.avatar.path != '' && this.props.apiPhotoAsset.avatar.thumbnail != '' ) {
    //         l_avatarPath = l_basePhotoURL + this.props.apiPhotoAsset.avatar.path;
    //         l_avatarThumb = l_basePhotoURL + this.props.apiPhotoAsset.avatar.thumbnail;
    //         l_avatarID = this.props.apiPhotoAsset.avatar.assetID;
            
    //         this.setState({
    //           avatarPath: l_avatarPath,
    //           avatarThumb: l_avatarThumb,
    //           photoList: l_photoList,
    //           avatarID: l_avatarID,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = l_avatarPath;
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(this.props.clientSessionID, l_user);
    //       } else {
    //         this.setState({
    //           avatarPath: '',
    //           avatarThumb: '',
    //           avatarID: '',
    //           photoList: l_photoList,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = 'http://195.201.223.18/default_avatar.png';
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(this.props.clientSessionID, l_user);
    //       }
    //       Alert.alert(
    //         "Success",
    //         "This photo was setted as the primary photo.",
    //         [
    //           {text: 'OK', onPress: () => {}},
    //         ]
    //       );          
    //     }
    //     if (this.props.apiPhotoAPIType == 4) {
    //       // get photo list
    //       var l_avatarPath = '', l_avatarThumb = '', l_avatarID = '';
    //       var l_photoList = this.props.apiPhotoAsset.assetList;
    //       var l_basePhotoURL = this.props.apiPhotoAsset.basePath;

    //       if (this.props.apiPhotoAsset.avatar.isAvatar && this.props.apiPhotoAsset.avatar.path != '' && this.props.apiPhotoAsset.avatar.thumbnail != '' ) {
    //         l_avatarPath = l_basePhotoURL + this.props.apiPhotoAsset.avatar.path;
    //         l_avatarThumb = l_basePhotoURL + this.props.apiPhotoAsset.avatar.thumbnail;
    //         l_avatarID = this.props.apiPhotoAsset.avatar.assetID;
            
    //         this.setState({
    //           avatarPath: l_avatarPath,
    //           avatarThumb: l_avatarThumb,
    //           photoList: l_photoList,
    //           avatarID: l_avatarID,
    //           basePhotoURL: l_basePhotoURL,
    //         });
            
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = l_avatarPath;
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       } else {
    //         this.setState({
    //           avatarPath: '',
    //           avatarThumb: '',
    //           avatarID: '',
    //           photoList: l_photoList,
    //           basePhotoURL: l_basePhotoURL,
    //         });
    //         var l_user = this.props.user;
    //         l_user.defaultAvatar = 'http://195.201.223.18/default_avatar.png';
    //         l_user.avatar = this.props.apiPhotoAsset.avatar;
    //         this.props.setUserData(l_user.firebaseID, l_user);
    //       }
    //     }
    //     if (this.props.apiPhotoAPIType == 5) {
    //       // get photo list api's failed
    //       var l_basePhotoURL = this.props.apiPhotoAsset.basePath;
    //       this.setState({
    //         avatarPath: '',
    //         avatarThumb: '',
    //         avatarID: '',
    //         photoList: [],
    //         basePhotoURL: l_basePhotoURL,
    //       });
    //     }
    //   }
    // }
  }

  onAddInterests() {
    // Actions.interests({ refresh: { test: Math.random() } });
    this.props.navigation.navigate('Interests');
  }

  goInformation(title) {
    Globals.profileInfoTitle = title;
    this.props.navigation.navigate('Information');
    // Actions.profileinformation();
  }

  goAbout() {
    // Actions.aboutyouview();
    this.props.navigation.navigate('AboutYou');
  }
  
  getUserPictures(userData) {
    // this.props.getPhotoList(this.props.user.firebaseID, '1080', '1920', 'PdiHnIR3tJAqD11o!QF7HZg', 'editProfilePage')
    // this.props.dispatch(getUserPhotos( userData.uid, 'EditProfile' ))
  }

  removeThisPhoto(assetID) {
    // this.props.deletePhoto(this.props.user.firebaseID, assetID, 'PdiHnIR3tJAqD11o!QF7HZg', 'editProfilePage')
    this.props.dispatch(deletePhoto( Globals.userData.uid, assetID, 'EditProfile' ))
  }

  removePhoto(num) {
    Alert.alert(
      "Alert",
      "Etes-vous sur de vouloir supprimer cette photo?",
      [
        {text: 'Non', onPress: () => {}},
        {text: 'Oui', onPress: () => {
          this.removeThisPhoto(this.state.photoList[num].createdAt);
        }},
      ]
    );
  }

  removeCurrentPhoto() {
    Alert.alert(
      "Alert",
      "Etes-vous sur de vouloir supprimer cette photo?",
      [
        {text: 'Non', onPress: () => {}},
        {text: 'Oui', onPress: () => {
          this.removeThisPhoto(this.state.photoList[this.state.selectedPhotoNum].createdAt);
        }},
      ]
    );
  }

  setDefaultPhoto() {
    // if (this.state.photoList.length == 0 || this.state.selectedPhotoNum  == 0 || this.state.selectedPhotoNum > this.state.photoList.length ) {
    //   return
    // }
    
    // this.props.setDefaultPhoto(this.props.user.firebaseID, this.state.photoList[this.state.selectedPhotoNum - 1].assetID, 'PdiHnIR3tJAqD11o!QF7HZg', 'editProfilePage')
    this.props.dispatch(setDefaultPhoto( Globals.userData.uid, this.state.photoList[this.state.selectedPhotoNum].createdAt, 'EditProfile' ))
  }

  onSetDefaultPhoto() {
    Alert.alert(
      "Alert", 
      "Are you sure to set this photo as primary?",
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => { this.setDefaultPhoto() } },
      ]
    );
  }

  onPhotoSelect(num) {
    // switch (num) {
    //   case 0:
    //     this.setState({
    //       isModalVisible: true,
    //       selectedPhotoURL: this.state.avatarPath,
    //       selectedPhotoNum: num,
    //     })
    //     break;
    //   default:
    //     this.setState({
    //       isModalVisible: true,
    //       selectedPhotoURL: this.state.basePhotoURL + this.state.photoList[num - 1].path,
    //       selectedPhotoNum: num,
    //     })
    //     break;
    // }
    this.setState({
      isModalVisible: true,
      selectedPhotoURL: this.state.photoList[num].url,
      selectedPhotoNum: num,
    })

  }

  selectPhoto(num) {
    if (this.state.photoList.length == 0) {
      return
    }

    var t_url = "";
    var t_num = 0;

    if (num > 0) {
      if (this.state.selectedPhotoNum == (this.state.photoList.length - 1)) {
        t_num = 0;
        t_url = this.state.photoList[t_num].url;
      } else {
        t_num = this.state.selectedPhotoNum + 1;
        t_url = this.state.photoList[t_num].url;
      }
    } else {
      if (this.state.selectedPhotoNum == 0) {
        t_num = this.state.photoList.length - 1;
        t_url = this.state.photoList[t_num].url;
      } else {
        t_num = this.state.selectedPhotoNum - 1;
        t_url = this.state.photoList[t_num].url;
      }
    }
    this.setState({
      selectedPhotoNum: t_num,
      selectedPhotoURL: t_url
    })
  }

  onAddPhoto() {
    this.setState({
      isModalAddPhotoVisible: true,
    });
  }

  addNewPhoto(asset) {
    let userData = this.state.userData;

    this.setState({
      // isSpinnerVisible: true,
      isGalleryButtonActive: false
    })

    // this.props.addPhoto(this.props.user.firebaseID, 'jpg', { uri: asset, type: 'image/jpeg', name: 'photo_' }, 'PdiHnIR3tJAqD11o!QF7HZg', 'editProfilePage')
    
    // const uploadUri = Platform.OS === 'ios' ? asset.replace('file://', '') : asset
    this.props.dispatch(uploadPhoto(userData.uid, asset, 'EditProfile'));
    // this.props.dispatch(setUserData(userData));
  }

  onGalleryOpen(num) {
    var options = {
      title: 'Select Avatar',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    this.setState({
      isGalleryButtonActive: true,
    })

    if (num == 1) {
      // Open Image Library:
      ImagePicker.launchImageLibrary(options, (response)  => {
        // Same code as in above section! 
        // console.log('Response = ', response);

        if (response.didCancel) {
          // console.log('User cancelled image picker');
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else if (response.error) {
          // console.log('ImagePicker Error: ', response.error);
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else if (response.customButton) {
          // console.log('User tapped custom button: ', response.customButton);
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else {
          // let source = { uri: response.uri };
          this.setState({
            isModalAddPhotoVisible: false,
            // avatarSource: source,
          })
    
          // this.addNewPhoto(source);
          this.addNewPhoto(response.uri);
      
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

          // this.setState({
          //   avatarSource: source
          // });
        }    
      });
    } else {
      // Launch Camera:
      ImagePicker.launchCamera(options, (response)  => {
        // Same code as in above section! 
        if (response.didCancel) {
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else if (response.error) {
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else if (response.customButton) {
          this.setState({
            isModalAddPhotoVisible: false,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
        }
        else {
          // let source = { uri: response.uri };
          
          this.setState({
            isModalAddPhotoVisible: false,
            // avatarSource: source,
          })
          setTimeout(() => {
            this.setState({
              isGalleryButtonActive: false
            });
          }, 500);
      
          // this.addNewPhoto(source);
          this.addNewPhoto(response.uri);
        }    
      });
    }
  }

  setCurrentLocation() {
    this.props.navigation.navigate('CurrentLocation');
  }

  onLogout() {
    // this.props.firebaseLogout();
    this.props.dispatch(logoutUser());
    this.props.dispatch(changeAppRoot('login'));
    this.props.dispatch(setUserData(null));

    Globals.userData = null;
  }

  render() {
    let userData = this.state.userData;

    let strLabel = {
      about: {
        en: "ABOUT YOU",
        fr: "A propos de moi"
      },
      information: {
        en: "INFORMATION",
        fr: "INFORMATION"       // Information
      },
      interests: {
        en: "INTERESTS",
        fr: "Mes Intérêts"
      },
      Location: {
        en: "LOCATION",
        fr: "Localisation"
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
      currentLocation: {
        en: "Current location",
        fr: "Localisation actuelle"
      },
      add: {
        en: "Add",
        fr: "Ajouter"
      },
      addInterests: {
        en: "Add Interests",
        fr: "Ajouter des Centres d'Intérêts"
      },
      logout: {
        en: "Logout",
        fr: "Déconnection"
      },
      addInfo: {
        en: "Add",
        fr: "Définir"
      }
    }

    let m_appearance = userData == null || userData.information == null || userData.information.appearance == null || userData.information.appearance == "" ? strLabel.addInfo.fr : userData.information.appearance;
    let m_children = userData == null || userData.information == null || userData.information.children == null || userData.information.children == "" ? strLabel.addInfo.fr : userData.information.children;
    let m_drinking = userData == null || userData.information == null || userData.information.drinking == null || userData.information.drinking == "" ? strLabel.addInfo.fr : userData.information.drinking;
    let m_language = userData == null || userData.information == null || userData.information.language == null || userData.information.language == "" ? strLabel.addInfo.fr : userData.information.language;
    let m_living = userData == null || userData.information == null || userData.information.living == null || userData.information.living == "" ? strLabel.addInfo.fr : userData.information.living;
    let m_relashionship = userData == null || userData.information == null || userData.information.relashionship == null || userData.information.relashionship == "" ? strLabel.addInfo.fr : userData.information.relashionship;
    let m_sexuality = userData == null || userData.information == null || userData.information.sexuality == null || userData.information.sexuality == "" ? strLabel.addInfo.fr : userData.information.sexuality;
    let m_smoking = userData == null || userData.information == null || userData.information.smoking == null || userData.information.smoking == "" ? strLabel.addInfo.fr : userData.information.smoking;

    let l_about = userData && userData.about ? userData.about : '';

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            if (deepDiffer(this.state.userData, Globals.userData)) {
              if (Globals.userData != null) {
                this.setState({
                  userData: Globals.userData
                })
              }
              // this.getUserPictures(Globals.userData);
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
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: 25, paddingLeft: 15, paddingRight: 15 }} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >PHOTOS</Text>
              <TouchableOpacity onPress={()=>{ this.onAddPhoto(); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#fd2191' }} >{strLabel.add.fr}</Text>
                  <View style={{ width: 5 }}></View>
                  <Icon2 name="circle-with-plus" size={28} color="#fd2191" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 15, paddingLeft: 15, paddingRight: 15, width: WINDOW_WIDTH, height: WINDOW_WIDTH * 0.54, flexDirection: 'row' }} >
            <View style={{ flex: 42, }}>
              {
                this.state.avatarNum > 0 && this.state.photoList.length > 0 ? (
                  <TouchableOpacity style={{ flex: 1 }} onPress={()=>{ this.onPhotoSelect(this.state.avatarNum - 1); }}>
                    <View style={{ flex: 1, paddingRight: 4, paddingTop: 5 , borderRadius: 5 }} >
                      <Image 
                        source={{ uri: this.state.photoList[this.state.avatarNum - 1].url }} 
                        style={{ width: null, height: null, flex: 1, borderRadius: 10 }} resizeMode={'stretch'} />
                      <TouchableOpacity onPress={()=>{ this.removePhoto(this.state.avatarNum - 1); }} style={{ position: 'absolute', right: 0, top: 0 }} >
                        <Icon3 name="md-close-circle" size={30} color="#fd2191" backgroundColor="white" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flex: 1, paddingRight: 4, paddingTop: 5 , borderRadius: 5, borderWidth: 0.5 }} >
                    <Image 
                      source={ Images.profileAvatar } 
                      style={{ width: null, height: null, flex: 1, borderRadius: 10 }} resizeMode={'stretch'} />
                  </View>
                )
              }
            </View>
            <View style={{ flex: 58, paddingLeft: 4, backgroundColor: '#f0f0f0' }}>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{flexGrow: 1}} horizontal={true}>
                <View style={{ height: WINDOW_WIDTH * 0.54, width: this.state.photoList.length % 2 == 0 ? (WINDOW_WIDTH * 0.58 / 2 - 10) * this.state.photoList.length / 2 : (WINDOW_WIDTH * 0.58 / 2 - 10) * (this.state.photoList.length + 1) / 2 }}>
                {
                  this.state.photoList
                  .map((value, index) => {
                    return (
                      <View style={{ height: WINDOW_WIDTH * 0.54 / 2 - 5, width: WINDOW_WIDTH * 0.58 / 2 - 10, left: (WINDOW_WIDTH * 0.58 / 2 - 10) * Math.floor(index / 2), top: index % 2 == 0 ? 0 : WINDOW_WIDTH * 0.54 / 2 , position: 'absolute' }} key={index }>
                        <TouchableOpacity style={{ flex: 1 }} onPress={()=>{ this.onPhotoSelect(index); }}>
                          <View style={{ flex: 1, paddingRight: 6, paddingTop: 5 }} >
                            <Image 
                              source={{ uri: value.url }} 
                              style={{ width: null, height: null, flex: 1, resizeMode: 'stretch', borderRadius: 10 }} />
                            <TouchableOpacity onPress={()=>{ this.removePhoto(index); }} style={{ position: 'absolute', right: 0, top: 0 }} >
                              <Icon3 name="md-close-circle" size={22} color="#fd2191" backgroundColor="white" />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                }
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={{ marginTop: 25, paddingLeft: 15, paddingRight: 15 }}>
            <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.about.fr}</Text>
          </View>
          <View style={{ marginTop: 0, paddingLeft: 10, paddingRight: 10, paddingBottom: 5, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2}}>
            <TouchableOpacity style={{ padding: 10, flex: 1 }} onPress={()=>{ this.goAbout(); }} >
              <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: '#222222', textAlign: 'justify' }} >{l_about}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 25, paddingLeft: 15, paddingRight: 15 }}>
            <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.information.fr}</Text>
          </View>

          <View style={{ marginTop: 15, paddingLeft: 15, paddingRight: 15, }}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Appearance.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Appearance'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_appearance} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Children.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Children'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_children} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Drinking.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Drinking'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_drinking} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Speak.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('I speak'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_language} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 7, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Living.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Living'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_living} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 48 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Relationship.fr }</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Relationship'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 48 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_relashionship} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Sexuality.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Sexuality'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_sexuality} ></Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
              <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{strLabel.Smoking.fr}</Text>
              <TouchableOpacity style={{ width: 160 }} onPress={()=>{ this.goInformation('Smoking'); }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                  <Text style={{ flex: 1, fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', textAlign: 'right' }} >{m_smoking} ></Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
            <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.interests.fr}</Text>
          </View>

          <View style={{ marginTop: 10, paddingLeft: 15, paddingRight: 15 }}>
            <TouchableOpacity onPress={()=>{ this.onAddInterests() }} >
              <View style={{ flex: 1, height: 60, borderRadius: 20, borderColor: '#fd2191', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} >
                <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: '#fd2191', alignItems: 'center' }} >{strLabel.addInterests.fr}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
            <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)' }} >{strLabel.Location.fr}</Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingLeft: 15, paddingRight: 15 }} >
            <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222', alignItems: 'center' }} >{''}</Text>
            <TouchableOpacity onPress={()=>{ this.setCurrentLocation() }} >
              <View style={{ flexDirection: 'row' }} >
                <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(0, 0, 0, 0.3)', alignItems: 'center' }} >{ (userData && userData.city) ? userData.city : '' } ></Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
            <TouchableOpacity onPress={()=>{ this.onLogout() }} >
              <View style={{ flex: 1, height: 60, borderRadius: 20, borderColor: '#fd2191', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} >
                <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: '#fd2191', alignItems: 'center' }} >{strLabel.logout.fr}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        { (this.props.loading || this.props.firebaseLoading) && <LoadingIndicator /> }

        <Modal isVisible={this.state.isModalAddPhotoVisible} >
          <View style={{ backgroundColor: 'white', borderRadius: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: '#222222' }}>ADD PHOTOS</Text>
              <TouchableOpacity onPress={()=>{ this.setState({ isModalAddPhotoVisible: false }) }} >
                <Icon name="close" size={28} color="#a9a9a9" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, paddingTop: 5, paddingBottom: 10, borderBottomColor: 'rgba(34, 34, 34, 0.5)', borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={()=>{ this.onGalleryOpen(1) }} disabled={this.state.isGalleryButtonActive} >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Image source={Images.gallerySelectIcon} style={{ width: 44, height: 47 }} />
                  <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222' }}>GALLERY</Text>
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(34, 34, 34, 0.5)' }}>Select Photo from your gallery</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', padding: 20, paddingTop: 20, marginBottom: 10, borderBottomColor: 'rgba(34, 34, 34, 0.5)', }}>
              <TouchableOpacity onPress={()=>{ this.onGalleryOpen(2) }} disabled={this.state.isGalleryButtonActive} >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Image source={Images.takePhotoIcon} style={{ width: 44, height: 33, marginTop: 4 }} />
                  <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: '#222222' }}>TAKE PHOTO</Text>
                    <Text style={{ fontSize: 54 * METRICS.scaleHeight, color: 'rgba(34, 34, 34, 0.5)' }}>Take photo of yourself now</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this.setState({ isModalVisible: false })}>
          <View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT, left: -20 }}>
            {/* <Image source={{ uri: this.state.selectedPhotoURL }} style={{ width: null, height: null, flex: 1, backgroundColor: '#119990' }} resizeMode={'stretch'} /> */}
            <Image source={{ uri: this.state.selectedPhotoURL }} style={{ width: null, height: null, flex: 1, backgroundColor: '#efefef' }} resizeMode={'contain'} />

            <View style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 80, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => this.setState({isModalVisible: false}) } style={{ left: 20, top: 20, }}  >
                <Icon2 name="cross" size={30} color="gray" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={()=>{ this.removeCurrentPhoto(); }} style={{ top: 20 }} >
                <Image source={Images.deletePhotoIcon} style={{ width: 29, height: 35 }} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={()=>{ this.onSetDefaultPhoto() }} style={{ right: 20, top: 24 }} >
                <Text style={{ fontSize: 60 * METRICS.scaleHeight, color: 'gray', alignItems: 'center' }} >Set Primary Photo</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ position: 'absolute', width: WINDOW_WIDTH, height: 80, top: WINDOW_HEIGHT / 2 - 40 }}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>
                <TouchableOpacity onPress={()=>{ this.selectPhoto(-1); }} >
                  <Icon2 name="chevron-thin-left" size={45} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ this.selectPhoto(1); }} >
                  <Icon2 name="chevron-thin-right" size={45} color="white" />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>
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

export default connect(mapStateToProps)(EditProfileScreen)
