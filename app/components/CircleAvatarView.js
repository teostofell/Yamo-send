import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
// import UserAvatar from 'react-native-user-avatar';
import {AvatarHelper, Colors, Typography} from 'react-native-ui-lib';
import { Avatar } from 'react-native-elements';

export default class CircleAvatarView extends React.Component {
  constructor(props) {
    super(props);
    this.onAvatarPress = this.onAvatarPress.bind(this);

    this.state = {
      title: this.props.name,
      label: AvatarHelper.getInitials(this.props.name),
      backgroundColor: this.props.status=='online' ? Colors.blue20 : this.props.status == 'away' ? Colors.yellow30 : this.props.status == 'offline' ? Colors.dark60 : null,
      imageSource: {uri: this.props.avatarSource},
      // status: Avatar.modes.ONLINE,
      size: this.props.width,
      // hsize: this.props.height,
      // farAway: this.props.farAway,
      // badgeNumber: this.props.badgeNumber,
      isNewUser: this.props.isNewUser,
      isFindPeople: this.props.isFindPeople,
    }
  }

  onAvatarPress(item) {
    
  }

  render() {
    var sampleProfile = this.state;
    let strLabel = {
      new: {
        en: "New",
        fr: "Nouveau"
      },
    }
    return (
      <View style={[styles.container, { width: this.props.width, height: this.props.height }]} onPress={()=> this.onAvatarPress(sampleProfile)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          {/* <Avatar {...sampleProfile} /> */}

          <Avatar
            // small
            width={this.props.width}
            height={this.props.width}
            title={ AvatarHelper.getInitials(this.props.name) }
            rounded
            // source={{uri: this.props.avatarSource}}
            source={this.props.avatarSource}
            // source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
            // onPress={() => {}}
            activeOpacity={0.7}
          />

          <View style={[styles.onlineBadge, {left: this.props.width / 2 - 7, top: this.state.isFindPeople == true? this.props.width - 5 : this.props.width - 9}]} >
            <View style={[styles.onlineBadgeInner, {backgroundColor: this.props.status=='online' ? Colors.green30 : this.props.status == 'away' ? 'rgba(255, 180, 16, 0.6)' : this.props.status == 'offline' ? 'rgba(0, 0, 0, 0.4)' : null}]} />
          </View>

          <Text style={styles.textContainer}>{this.props.farAway}</Text>

          {this.state.isFindPeople == true ?
            <Text style={[styles.textContainer, { marginTop: 0, color: '#fd2191' }]}>{this.state.isNewUser == 1 ? strLabel.new.fr : ''}</Text> :
            null
          }
          {this.state.isFindPeople == true ?
            <Text style={[{ color: '#1e1e1e', bottom: this.props.width * 0.29, position: 'absolute' }]}>{this.props.name}</Text> :
            null
          }

          {this.props.badgeNumber > 0 ? 
            <View style={{ backgroundColor: '#fd2191', right: -2, top: -2, position: 'absolute' }}><Text style={{ color: 'white', width: this.props.badgeNumber > 9 ? null : 15, textAlign: 'center' }} >{this.props.badgeNumber}</Text></View> : 
            null
          }

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
  },
  textContainer: {
    color: Colors.dark30,
    marginTop: 24,
  },
  onlineBadge: {
    height: 14,
    width: 14,
    padding: 1.0,
    borderRadius: 999,
    backgroundColor: Colors.white,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  onlineBadgeInner: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: Colors.green30,
  },
});