import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, YellowBox, Alert } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { Cell, Separator } from 'react-native-tableview-simple';
import { connect } from 'react-redux';
import Moment from 'moment';
import { NavigationActions, NavigationEvents } from 'react-navigation'

import { getActivity, getUserPhotos } from '../../../../store/firebaseData'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import LoadingIndicator from '../../../../components/LoadingIndicator'
import Globals from '../../../../Globals'
import Images from '../../../../resource/Images'
import styles from './styles'

// var moment = require("moment");

class FavouriteScreen extends Component {

  state = {
    selectedIndex: 0,
    visits: [],
    matches: [],
    likes: [],
    visible: false,
    photoList: null,
    avatarNum: 0,
    avatarPhoto: null
    
  };

  constructor(props) {
    super(props);

  };

  componentWillMount() {
  }

  componentDidMount() {
    this.getActivityFunc()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.likedList && this.props.likedList) {
      this.setState({
        matches: this.props.likedList.maches,
        likes: this.props.likedList.likedMe,
        visits: this.props.likedList.visitedMe,
      });
    }
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  }

  getActivityFunc() {
    let userData = Globals.userData;
    this.setState({
      userData: userData,
      photoList: Globals.userPhotos,
      avatarNum: Globals.avatarNum,
      avatarPhoto: Globals.avatarPhoto
    })
    // this.props.dispatch(getUserPhotos( userData.uid, 'Favourite' ))
    this.props.dispatch(getActivity( userData.uid, 'Favourite' ))
  }

  getDateDifference(oldDate) {
    var date_now = new Date();
    var date_visit = new Date(oldDate);

    var diff = Moment.duration(Moment(date_now).diff(Moment(date_visit)));
    var days = parseInt(diff.asDays());
    var hours = parseInt(diff.asHours());
    hours = hours - days*24;
    var minutes = parseInt(diff.asMinutes());
    minutes = minutes - (days*24*60 + hours*60);

    var strDifference = "il y'a ";
    if (days > 0) {
      strDifference = strDifference + days + " Jours";
      // if (days > 7) {
      //   strDifference = "il y'a " + Math.floor(days / 7) + " Semaines";
      // }
      if (days > 30) {
        strDifference = "il y'a " + Math.floor(days / 30) + " Mois";
      }
    } else if (hours > 0) {
      strDifference = strDifference + hours + " Heures";
    } else {
      strDifference = strDifference + minutes + " Minutes";
    }

    return strDifference;
  }

  findPerson(personInfo) {
    let r_personInfo = { 
      uid: personInfo.uid,
      name: personInfo.name,
      createdAt: '',
      gender: '',
      coords: null,
      age: 0,
      city: '',
      avatar: ''
    }
    // Actions.clientprofile({ client: r_personInfo });
    this.props.navigation.push('ClientProfile', { client: r_personInfo, avatarPhoto: this.state.avatarPhoto, from: 'Favourite' });
  }

  render() {
    let strLabel = {
      matches: {
        en: "Matches",
        fr: "Mes Béguins"
      },
      likeMe: {
        en: "They like me",
        fr: "Mes J’aimes"
      },
      visitedMe: {
        en: "They visited me",
        fr: "Mes visites"
      },
      activities: {
        en: "Activities",
        fr: "Activités"
      }
    }

    return (
      <View style={styles.container} >
        <NavigationEvents
          onWillFocus={payload => {
            this.getActivityFunc()
          }}
        />
        <SegmentedControlTab tabsContainerStyle={styles.tabsContainerStyle}
          tabStyle={styles.tabStyle}
          tabTitleStyle={styles.tabTitleStyle}
          activeTabStyle={styles.activeTabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          values={[strLabel.matches.fr, strLabel.likeMe.fr, strLabel.visitedMe.fr]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
          // onPress= {index => this.setState({selected:index})}
        />
        {this.state.selectedIndex === 0 &&
          <FlatList
          data={this.state.matches}
          keyExtractor={(item, index) => item.uid}
          renderItem={({ item, separators }) =>
            <Cell
              onPress={() => { this.findPerson(item) }}
              cellContentView={
                <View
                  style={{ alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10, height: 120 }}
                >
                  <Image
                    style={{ borderRadius: 45, width: 90, height: 90, backgroundColor: '#cccccc' }}
                    source={ item.avatar != null ? { uri: item.avatar } : Images.profileAvatar}
                  />
                  <View style={{ paddingHorizontal: 10, flex: 1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text
                      allowFontScaling
                      numberOfLines={1}
                      style={{ fontSize: 20, textAlign: 'center' }}
                    >
                      { item.name }
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', paddingTop: 4 }} >
                      { this.getDateDifference(item.likedAt) }
                    </Text>
                  </View>
                </View>
              }
            />
            }
            ItemSeparatorComponent={({ highlighted }) =>
            <Separator isHidden={highlighted} />}
          />
        }
        {this.state.selectedIndex === 1 &&
          <FlatList
          data={this.state.likes}
          keyExtractor={(item, index) => item.uid}
          renderItem={({ item, separators }) =>
            <Cell
              onPress={() => { this.findPerson(item) }}
              cellContentView={
                <View
                  style={{ alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10, height: 120 }}
                >
                  <Image
                    style={{ borderRadius: 45, width: 90, height: 90, backgroundColor: '#cccccc' }}
                    source={ item.avatar != null ? { uri: item.avatar } : Images.profileAvatar}
                  />
                  <View style={{ paddingHorizontal: 10, flex: 1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text
                      allowFontScaling
                      numberOfLines={1}
                      style={{ fontSize: 20, textAlign: 'center' }}
                    >
                      { item.name }
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', paddingTop: 4 }} >
                      { this.getDateDifference(item.likedAt) }
                    </Text>
                  </View>
                </View>
              }
            />
            }
            ItemSeparatorComponent={({ highlighted }) =>
            <Separator isHidden={highlighted} />}
          />
        }
        {this.state.selectedIndex === 2 &&
          <FlatList
          data={this.state.visits}
          keyExtractor={(item, index) => item.uid}
          renderItem={({ item, separators }) =>
            <Cell
              onPress={() => { this.findPerson(item) }}
              cellContentView={
                <View
                  style={{ alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10, height: 120 }}
                >
                  <Image
                    style={{ borderRadius: 45, width: 90, height: 90, backgroundColor: '#cccccc' }}
                    source={ item.avatar != null ? { uri: item.avatar } : Images.profileAvatar}
                  />
                  <View style={{ paddingHorizontal: 10, flex: 1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text
                      allowFontScaling
                      numberOfLines={1}
                      style={{ fontSize: 20, textAlign: 'center' }}
                    >
                      { item.name }
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', paddingTop: 4 }} >
                      { this.getDateDifference(item.visitedAt) }
                    </Text>
                  </View>
                </View>
              }
            />
            }
            ItemSeparatorComponent={({ highlighted }) =>
            <Separator isHidden={highlighted} />}
          />
        }
        { this.props.firebaseLoading && <LoadingIndicator /> }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,

    firebaseLoading: state.firebaseData.loading,
    firebaseError: state.firebaseData.error,
    likedList: state.firebaseData.likedList,

  };
  return props;
}

export default connect(mapStateToProps)(FavouriteScreen)
