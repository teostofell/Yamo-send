import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, YellowBox, Dimensions, Alert } from 'react-native';
import AutoResponsive from 'autoresponsive-react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import { Switch } from 'react-native-switch';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import deepDiffer from 'react-native/lib/deepDiffer'
import geolib from "geolib";
import { NavigationActions, NavigationEvents } from 'react-navigation'

import CircleAvatarView from '../../../../components/CircleAvatarView'
import LoadingIndicator from '../../../../components/LoadingIndicator'

import Images from '../../../../resource/Images';
import styles from './styles'
import Globals from '../../../../Globals';
import { METRICS } from '../../../../resource/Metrics'

import { findUsers, updateUserCoordinate, getFilterData, setFilterData, getUserPhotos, detectOnlineUser } from '../../../../store/firebaseData'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;
const LATTITUDE_DELTA = 0.0922;
const LONGTITUDE_DELTA = LATTITUDE_DELTA * ASPECT_RATIO;

class FindPeopleScreen extends Component {
  
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
          state.params.handleModalStatudchange()
        }} >
          <Image source={Images.dropdownNavButton} style={{ width: 22, height: 25 }} />
        </TouchableOpacity>
      ),
      // headerRight: (
      //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
      //     <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
      //   </TouchableOpacity>
      // ),
      tabBarVisible: false,
    };
  };

  state = {
    userData: null,
    array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, -1, -1, -1],
    findUsers: [],
    isModalVisible: false,
    isModalMenSwitch: true,
    isModalWomenSwitch: false,
    farSliderValue: [5],
    ageSliderValue: [18, 30],
    errors: '',
    city: '',
    visible: false,
    coords: null,
    filterData: null,
    photoList: null,
    avatarNum: 0,
    avatarPhoto: null,
    showPlacesList: false,
    firstShowPlacesList: true,
  }

  static onEnterSomeView = () => {
  }

  enableScroll = () => this.setState({ scrollEnabled: true });
  disableScroll = () => this.setState({ scrollEnabled: false });

  constructor(props) {
    super(props);

    this.onSelectPeople = this.onSelectPeople.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentDidUpdate(prevProps) {
    if (deepDiffer(this.state.userData, Globals.userData)) {
      if (Globals.userData != null) {
        this.setState({
          userData: Globals.userData
        })
      }
    }

    if (!prevProps.filterData && this.props.filterData) {
      if (deepDiffer(this.state.filterData, this.props.filterData)) {
        this.setState({
          filterData: this.props.filterData
        })
        // this.props.dispatch(getUserPhotos( Globals.userData.uid, 'FindPeople' ))
        this.props.dispatch(findUsers( Globals.userData.uid, 'FindPeople' ))
      }
    }

    if (!prevProps.userList && this.props.userList) {
      if (deepDiffer(this.state.userList, this.props.userList)) {
        this.setState({
          findUsers: this.props.userList
        })
        // this.props.dispatch(getFilterData( Globals.userData.uid, 'FindPeople' ))
        this.props.dispatch(getUserPhotos( Globals.userData.uid, 'FindPeople' ))
      }
    }

    if (!prevProps.photoList && this.props.photoList && this.props.pageName == 'FindPeople') {
      var avatarNum = 0;
      for (var i = 0; i < this.props.photoList.length; i++) {
        if (this.props.photoList[i].isPrivate == true) {
          avatarNum = i + 1;
        }
      }
      this.setState({
        photoList: this.props.photoList,
        avatarNum: avatarNum,
        avatarPhoto: avatarNum > 0 ? this.props.photoList[avatarNum - 1] : null
      })
      Globals.userPhotos = this.props.photoList;
      Globals.avatarNum = avatarNum;
      Globals.avatarPhoto = avatarNum > 0 ? this.props.photoList[avatarNum - 1] : null
    }
  }

  componentDidMount() {
    this.setState({
      userData: Globals.userData
    })
    this.props.navigation.setParams({ handleModalStatudchange: this.onModalStatusChange });

    // this.props.dispatch(findUsers( Globals.userData.uid, 'FindPeople' ))
    this.props.dispatch(getFilterData( Globals.userData.uid, 'FindPeople' ))
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateGeoLocation(position.coords.latitude, position.coords.longitude);
      },
      (errors) => this.setState({ locationError: errors.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

    this.props.dispatch(detectOnlineUser(Globals.userData.uid));
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  onSelectPeople(n) {
    // Actions.clientprofile({ client: this.state.findUsers[n] });
    this.props.navigation.push('ClientProfile', { client: this.state.findUsers[n], avatarPhoto: this.state.avatarPhoto, from: 'FindPeople' });
  }

  componentWillMount() {
  }
 
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  getChildrenStyle() {
    return {
      width: Dimensions.get('window').width / 3 - 6,
      // height: parseInt(Math.random() * 20 + 12) * 10,
      height: 180,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      paddingTop: 4,
      // borderRadius: 8,
    };
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 6,
    };
  }

  onSubmit() {
    if (this.state.city != '') {
      this.onUpdateUserFilter(this.state.city);
    } else {
      Alert.alert(
        "Alert", "Please select your city"
      );
    }
  }

  renderChildren() {
    return this.state.findUsers.map((user, key) => {
      var dist = 0;
      if (user.coords != null && this.state.userData.coords != null) {
        dist = geolib.getDistance(
          {latitude: user.coords.lat, longitude: user.coords.long},
          {latitude: this.state.userData.coords.lat, longitude: this.state.userData.coords.long},
        );
        dist = dist / 1000;
      }

      return (
        <View style={ key % 3 == 1 ? this.getChildrenStyle() : [this.getChildrenStyle(), {marginTop: 50}] } key={key}>
          <TouchableOpacity onPress={()=>{this.onSelectPeople(key)}} style={{ flex: 1 }} >
            <CircleAvatarView width={ Dimensions.get('window').width / 3 - 6 } height={ 180 } name={user.name} status={user.isOnline == true ? 'online' : 'away'} farAway={'A ' + dist + 'km' } avatarSource={user.avatar != '' ? {uri: user.avatar} : Images.profileAvatar} isNewUser={user.isNew == 'new' ? 1 : 0} isFindPeople={true} />
          </TouchableOpacity>
        </View>
      );
    }, this);
  }

  onPressTitle = () => {
    this.setState({
      array: [...this.state.array, parseInt(Math.random() * 30)],
    });
  }

  onModalStatusChange = () => {
    let t_filterData = this.state.filterData;
    if (t_filterData == null) 
    {
      return;
    }
    var l_rangeArray = t_filterData.age.split(',');
    this.setState({
      isModalVisible: true,
      firstShowPlacesList: true,
      isModalMenSwitch: t_filterData.looking == 1 ? true : false,
      isModalWomenSwitch: t_filterData.looking == 0 ? true : false,
      farSliderValue: [parseInt(t_filterData.far, 10)],
      ageSliderValue: [parseInt(l_rangeArray[0], 10), parseInt(l_rangeArray[1], 10)],
      city: t_filterData.city
    });
  }

  _togleModal = () => {
    let t_filterData = this.state.filterData;
    if (t_filterData == null) 
    {
      return;
    }
    var l_rangeArray = t_filterData.age.split(',');
    this.setState({ 
      isModalVisible: !this.state.isModalVisible,
      isModalMenSwitch: t_filterData.looking == 1 ? true : false,
      isModalWomenSwitch: t_filterData.looking == 0 ? true : false,
      farSliderValue: [parseInt(t_filterData.far, 10)],
      ageSliderValue: [parseInt(l_rangeArray[0], 10), parseInt(l_rangeArray[1], 10)],
      city: t_filterData.city
    });
  }

  farSliderValueChange = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      farSliderValue: newValues
    });
  }

  ageSliderValueChange = (values) => {
    this.setState({
      ageSliderValue: values
    });
  }

  onUpdateUserFilter = (l_city) => {
    let l_lookingStr = this.state.isModalMenSwitch == true ? 1 : 0;

    this.props.dispatch(setFilterData( Globals.userData.uid, l_lookingStr, this.state.farSliderValue[0], this.state.ageSliderValue[0] + "," + this.state.ageSliderValue[1], l_city, 'FindPeople' ))
    // this.props.updateUserFilter(userData.email, userData.firebaseID, filter, 'PdiHnIR3tJAqD11o!QF7HZg', 'findPeoplePage');

    this._togleModal();
  }

  updateGeoLocation(lat, long) {
    let userData = Globals.userData;

    // let coords = '{"lat": "' + lat + '", "long": "' + long + '"}';
    // this.props.updateUserCoordinate(userData.email, userData.firebaseID, coords, 'PdiHnIR3tJAqD11o!QF7HZg', 'findPeoplePage')
    this.props.dispatch(updateUserCoordinate(userData.uid, lat, long, 'FindPeople'));
  }

  render() {
    let strLabel = {
      filter: {
        en: "Filter",
        fr: "Modifier"
      },
      lookingFor: {
        en: "I’m looking for",
        fr: "Je recherche"
      },
      men: {
        en: "Men",
        fr: "une femme"
      },
      women: {
        en: "Women",
        fr: "un homme"
      },
      farAway: {
        en: "How far away?",
        fr: "Distance"
      },
      ageRange: {
        en: "Age range",
        fr: "Tranche d’âge"
      },
      applyFilter: {
        en: "Apply Filters",
        fr: "Rechercher /Filtrer"
      },
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            if (this.state.filterData != null && Globals.userData != null) {
              this.props.dispatch(findUsers( Globals.userData.uid, 'FindPeople' ))
            }
          }}
        />
        <ScrollView style={[styles.container]}>
          <AutoResponsive {...this.getAutoResponsiveProps()} >
            {this.renderChildren()}
          </AutoResponsive>
          <View style={{ height: 60 }} />
        </ScrollView>
        
        <Modal isVisible={this.state.isModalVisible}>
            <View style={{ height: 560, width: WINDOW_WIDTH - 40 }}>
              <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="always" >
                <View style={[styles.modalContent]}>
                  <View style={[styles.modalFilterContainer]} >
                    <Text style={{ color: 'black', fontSize: 20,  }}>{strLabel.filter.fr}</Text>
                    <TouchableOpacity onPress={this._togleModal}>
                      <Icon name="cross" size={24} color="#aaaaaa" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: '#cecece', fontSize: 20, paddingTop: 36 }}>{strLabel.lookingFor.fr}</Text>
                  <View style={[styles.modalFilterContainer, {paddingTop: 16}]}>
                    <Text style={{ color: this.state.isModalMenSwitch ? 'black' : '#a9a9a9', fontSize: 18 }}>{strLabel.men.fr}</Text>
                    <Switch
                      value={this.state.isModalMenSwitch}
                      onValueChange={(val) => { this.state.isModalMenSwitch == false ? this.setState({isModalMenSwitch: true, isModalWomenSwitch: false}) : this.setState({isModalMenSwitch: false, isModalWomenSwitch: true}) }}
                      disabled={false}
                      activeText={''}
                      inActiveText={''}
                      backgroundActive={'#febcde'}
                      backgroundInactive={'#e8e8e8'}
                      circleActiveColor={'#fd2191'}
                      circleInActiveColor={'#a8a8a8'}
                      barHeight={Platform.OS === 'ios' ? 14 : 24}
                      circleSize={26}
                      circleBorderWidth={0}
                    />
                  </View>
                  <View style={[styles.modalFilterContainer, {paddingTop: 20}]}>
                    <Text style={{ color: this.state.isModalWomenSwitch ? 'black' : '#a9a9a9', fontSize: 18 }}>{strLabel.women.fr}</Text>
                    <Switch
                      value={this.state.isModalWomenSwitch}
                      onValueChange={(val) => { this.state.isModalWomenSwitch == false ? this.setState({isModalWomenSwitch: true, isModalMenSwitch: false}) : this.setState({isModalWomenSwitch: false, isModalMenSwitch: true}) }}
                      disabled={false}
                      activeText={''}
                      inActiveText={''}
                      backgroundActive={'#febcde'}
                      backgroundInactive={'#e8e8e8'}
                      circleActiveColor={'#fd2191'}
                      circleInActiveColor={'#a8a8a8'}
                      barHeight={Platform.OS === 'ios' ? 14 : 24}
                      circleSize={24}
                      circleBorderWidth={0}
                    />
                  </View>
                  <Text style={{ color: '#cecece', fontSize: 20, paddingTop: 36 }}>{strLabel.farAway.fr}</Text>
                  <View style={[styles.modalFilterContainer, {paddingTop: 30}]}>
                    <Text style={{ color: 'black', fontSize: 18, marginTop: Platform.OS === 'ios' ? -10 : -14 }}>{this.state.farSliderValue[0]}Km</Text>
                    <View style={{ width: 20 }} ></View>
                    <MultiSlider
                      values={ this.state.farSliderValue }
                      sliderLength={WINDOW_WIDTH * 0.5}
                      onValuesChange={this.farSliderValueChange}
                      min={0}
                      max={200}
                      step={1}
                      allowOverlap
                      // snapped
                      selectedStyle={{
                        backgroundColor: '#e8e8e8'
                      }}
                      unselectedStyle={{
                        backgroundColor: '#e8e8e8'
                      }}
                      trackStyle={{
                        // height: Platform.OS === 'ios' ? 7 : 2,
                        height: 7,
                        top: -4,
                      }}
                      markerStyle={{
                        backgroundColor: '#fd2191',
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                      }}
                      onValuesChangeStart={this.disableScroll}
                      onValuesChangeFinish={this.enableScroll}
                    />
                    <View style={{ width: 20 }} ></View>
                  </View>

                  <Text style={{ color: '#cecece', fontSize: 20, paddingTop: 5 }}>{strLabel.ageRange.fr}</Text>
                  <View style={[styles.modalFilterContainer, {paddingTop: 30}]}>
                    <Text style={{ color: 'black', fontSize: 18, marginTop: Platform.OS === 'ios' ? -10 : -14 }}>{this.state.ageSliderValue[0]}</Text>
                    <View style={{ width: 20 }} ></View>
                    <MultiSlider
                      values={[ this.state.ageSliderValue[0], this.state.ageSliderValue[1] ]}
                      sliderLength={WINDOW_WIDTH * 0.5}
                      onValuesChange={this.ageSliderValueChange}
                      min={18}
                      max={100}
                      step={1}
                      allowOverlap
                      // snapped
                      selectedStyle={{
                        backgroundColor: '#febcde'
                      }}
                      unselectedStyle={{
                        backgroundColor: '#e8e8e8'
                      }}
                      trackStyle={{
                        // height: Platform.OS === 'ios' ? 7 : 2
                        height: 7,
                        top: -4,
                      }}
                      markerStyle={{
                        backgroundColor: '#fd2191',
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                      }}
                      onValuesChangeStart={this.disableScroll}
                      onValuesChangeFinish={this.enableScroll}
                    />
                    <View style={{ width: 20 }} ></View>
                    <Text style={{ color: 'black', fontSize: 18, marginTop: -10 }}>{this.state.ageSliderValue[1]}</Text>
                  </View>

                  <GooglePlacesAutocomplete
                    placeholder='Select your city'
                    minLength={2} // minimum length of text to search
                    autoFocus={true}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    // listViewDisplayed='auto'    // true/false/undefined
                    listViewDisplayed={this.state.showPlacesList}
                    fetchDetails={true}
                    renderDescription={(row) => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                      this.setState({
                        city: data.description
                      })
                    }}
                    getDefaultValue={() => {
                      return this.state.city; // text input default value
                    }}
                    query={{
                      key: 'AIzaSyCU4YlcxKL5lleN5wKiRfLhoJPfGXOjTRs',
                      // language: 'en', // language of the results
                      language: 'fr', // language of the results
                      types: '(cities)', // default: 'geocode'
                      origin: 'http://mywebsite.com'
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
                    textInputProps={{
                      ref: (textInput) => {
                        setTimeout(() => {
                          if (this.state.firstShowPlacesList == true) {
                            textInput && textInput.blur();
                            this.setState({
                              firstShowPlacesList: false
                            });
                          }
                        }, 1);
                        // if (this.state.showPlacesList == false) {
                        //   textInput && textInput.blur();
                        // }
                      },
                      onFocus: () => this.setState({showPlacesList: true}),
                      onBlur: () => this.setState({showPlacesList: false}),
                    }}
                  />

                  <View style={{ alignItems: 'flex-end', paddingTop: 20 }}>
                    <TouchableOpacity onPress={this.onSubmit}>
                      <Text style={{ color: '#fd2191', fontSize: 18 }}>{strLabel.applyFilter.fr}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              {/* </ScrollView> */}
              </KeyboardAwareScrollView>
            </View>
        </Modal>
        { this.props.firebaseLoading && <LoadingIndicator /> }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,
    temp: state.userData.temp,

    loading: state.session.loading,
    error: state.session.error,
    firebaseAuth: state.session.firebaseAuth,

    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    photoList: state.firebaseData.photoList,
    userList: state.firebaseData.userList,
    filterData: state.firebaseData.filterData,
    pageName: state.firebaseData.pageName
  };
  return props;
}

export default connect( mapStateToProps )(FindPeopleScreen)
