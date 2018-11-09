import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';

import Images from '../../../resource/Images';
import styles from './styles'
import Globals from '../../../Globals'

export default class SelectGenderScreen extends Component {
  constructor(props) {
    super(props);

  }

  onSignup(gender) {
    if (gender == 1) 
      Globals.signupGender = "male";
    else 
      Globals.signupGender = "female";

    this.props.navigation.navigate('signupScreen')
  }

  render() {
    let strLabel = {
      youare: {
        en: "YOU ARE?",
        fr: "Vous êtes ?"
      },
    }
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer} >
          <Text style={styles.headerTextContainer}>{strLabel.youare.fr}</Text>
        </View>
        <View style={styles.container} >
          <TouchableOpacity style={[styles.avatarViewContainer, {backgroundColor: '#ffffff'}]} onPress={()=>{this.onSignup(0)}}>
            <Image source={Images.femaleImage} style={styles.avatarImageContainer} />
            {/* <Text style={styles.avatarTextContainer}>I'm female</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.avatarViewContainer, {backgroundColor: '#ffffff'}]} onPress={()=>{this.onSignup(1)}}>
            <Image source={Images.maleImage} style={styles.avatarImageContainer} />
            {/* <Text style={styles.avatarTextContainer}>I'm male</Text> */}
          </TouchableOpacity>
      </View>
    </View>
    );
  }
}
