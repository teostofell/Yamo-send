import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { View, Text, Button, StyleSheet, Image, Animated, Easing, TouchableOpacity, Platform, YellowBox } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import MainScreen from './screens/startup/MainScreen';
import SignupScreen from './screens/startup/SignupScreen';
import LoginScreen from './screens/startup/LoginScreen';
import SelectGenderScreen from './screens/startup/SelectGenderScreen'
import SelectCityScreen from './screens/startup/SelectCityScreen'

import FindPeopleScreen from './screens/main/FindPeopleStack/FindPeople';
import ClientProfileScreen from './screens/main/FindPeopleStack/ClientProfile';

import MessageScreen from './screens/main/MessageStack/Message';

import FavouriteScreen from './screens/main/FavouriteStack/Favourite';

import ProfileScreen from './screens/main/ProfileStack/Profile';
import EditProfileScreen from './screens/main/ProfileStack/EditProfile';
import AboutYouScreen from './screens/main/ProfileStack/AboutYou';
import InformationScreen from './screens/main/ProfileStack/Information';
import InterestScreen from './screens/main/ProfileStack/Interests';
import CurrentLocationScreen from './screens/main/ProfileStack/CurrentLocation';

import HelpScreen from './screens/main/HelpStack/Help';
import HelpDetailsScreen from './screens/main/HelpStack/HelpDetails'

import Images from './resource/Images';
import { METRICS } from './resource/Metrics'
import Globals from './Globals';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const strLabel = {
  editProfile: {
    en: "Edit Profile",
    fr: "Modifier mon profil"
  },
  findPeople: {
    en: "FIND PEOPLE",
    fr: "Votre entourage"
  }
}

const FirstTabStack = createStackNavigator({
  FindPeople: {
    screen: FindPeopleScreen,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (
      //   <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
      //   }} >
      //     <Image source={Images.dropdownNavButton} style={{ width: 22, height: 25 }} />
      //   </TouchableOpacity>
      // ),
      headerTitle: strLabel.findPeople.fr,
      // headerRight: (
      //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
      //     <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
      //   </TouchableOpacity>
      // ),
    })
  },
  ClientProfile: {
    screen: ClientProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
});

//set tab bar options here use whatever logic you like to enable/disable tab bar
FirstTabStack.navigationOptions = ({ navigation }) => {
  if (navigation.state.index == 1) {
      return {
          tabBarVisible: false,
      };
  }
  return {
      tabBarVisible: true,
  };
};

const SecondTabStack = createStackNavigator({
  Message: {
    screen: MessageScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  }
});

const ThirdTabTabStack = createStackNavigator({
  Favourite: {
    screen: FavouriteScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Activités',
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
          <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
        </TouchableOpacity>
      ),
      headerMode: 'Float',
    })
  }
});

const FourthTabStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
          // navigation.state.params.updateFavorites(23)
          navigation.goBack();
        }} >
          <Icon name="arrow-left" size={30} color="#aaaaaa" />
        </TouchableOpacity>
      ),
      headerTitle: 'EDIT PROFILE',
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
          <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
        </TouchableOpacity>
      ),
      headerMode: 'Float',
    })
  },
  AboutYou: {
    screen: AboutYouScreen,
  },
  Information: {
    screen: InformationScreen,
  },
  Interests: {
    screen: InterestScreen,
  },
  CurrentLocation: {
    screen: CurrentLocationScreen,
  }
},
{
  initialRouteName: 'Profile',
});

const FifthTabStack = createStackNavigator({
  Help: {
    screen: HelpScreen,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      // headerLeft: (
      //   <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
      //     // navigation.state.params.updateFavorites(23)
      //     navigation.goBack();
      //   }} >
      //     <Icon name="arrow-left" size={30} color="#aaaaaa" />
      //   </TouchableOpacity>
      // ),
      headerTitle: 'Aide',
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
          <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
        </TouchableOpacity>
      ),
      headerMode: 'Float',
    })
  },
  HelpDetails: {
    screen: HelpDetailsScreen,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
          // navigation.state.params.updateFavorites(23)
          navigation.goBack();
        }} >
          <Icon name="arrow-left" size={30} color="#aaaaaa" />
        </TouchableOpacity>
      ),
      // headerTitle: '',
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{  }} >
          <Image source={Images.notificationNavButton} style={{ width: 22, height: 25 }} />
        </TouchableOpacity>
      ),
      headerMode: 'Float',
    })
  },
},
{
  initialRouteName: 'Help',
}
);

export const Main = createBottomTabNavigator(
  {
    First: {
      screen: FirstTabStack,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarIcon: ({focused, tintColor }) => <Image style={{ width: METRICS.screenWidth / 5 * 0.4, height: METRICS.screenWidth / 5 * 0.4 * 1.15 }} source={focused ? Images.firstTabIconRed : Images.firstTabIcon} />,
      }),
    },
    Second: {
      screen: SecondTabStack,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarIcon: ({focused, tintColor }) => <Image style={{ width: METRICS.screenWidth / 5 * 0.4, height: METRICS.screenWidth / 5 * 0.4 }} source={focused ? Images.secondTabIconRed : Images.secondTabIcon} />,
        tabBarVisible: false
      }),
    },
    Third: {
      screen: ThirdTabTabStack,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarIcon: ({focused, tintColor }) => <Image style={{ width: METRICS.screenWidth / 5 * 0.4, height: METRICS.screenWidth / 5 * 0.4 }} source={focused ? Images.thirdTabIconRed : Images.thirdTabIcon} />,
      }),
    },
    Fourth: {
      screen: FourthTabStack,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarIcon: ({focused, tintColor }) => <Image style={{ width: METRICS.screenWidth / 5 * 0.4, height: METRICS.screenWidth / 5 * 0.4 }} source={focused ? Images.fourthTabIconRed : Images.fourthTabIcon} />,
        tabBarVisible: false
      }),
    },
    Fifth: {
      screen: FifthTabStack,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarIcon: ({focused, tintColor }) => <Image style={{ width: METRICS.screenWidth / 5 * 0.4, height: METRICS.screenWidth / 5 * 0.4}} source={focused ? Images.fifthTabIconRed : Images.fifthTabIcon} />,                
      }),
    }
  },
  {
    initialRouteName: 'First',
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    backBehavior: 'none',
    tabBarOptions: {
      activeTintColor: '#667ed6',
      inactiveTintColor: '#4c4c4c',
      showLabel: false,
      labelStyle: {
      },
      backBehavior: 'none',
      style: {
        backgroundColor:'rgb(255, 255, 255)',
      },
    },
    navigationOptions: {
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        switch (navigation.state.key) {
          case "First":
            Globals.tabNumber = 1;
            Globals.isMessageTab = false;
            break;
          case "Second":
            // Globals.tabNumber = 2;
            Globals.isMessageTab = true;
            break;
          case "Third":
            Globals.tabNumber = 3;
            Globals.isMessageTab = false;
            break;
          case "Fourth":
            // Globals.tabNumber = 4;
            Globals.isMessageTab = false;
            break;
          case "Fifth":
            Globals.tabNumber = 5;
            Globals.isMessageTab = false;
            break;
          default:
            Globals.tabNumber = 1;
            Globals.isMessageTab = false;
            break;
        }
        defaultHandler();
      }
    }
  }
);
  
export const InitialRoot = createStackNavigator(
  {
    mainScreen: { screen: MainScreen },
    signupScreen: { screen: SignupScreen },
    loginScreen: { screen: LoginScreen },
    selectGenderScreen: { screen: SelectGenderScreen },
    selectCityScreen: { screen: SelectCityScreen }
  }, {
    headerMode: 'none',
    initialRouteName: 'mainScreen'
  }
)