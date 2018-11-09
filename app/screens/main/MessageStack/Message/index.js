import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  YellowBox
} from "react-native";
import { Button } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Switch } from "react-native-switch";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/Feather";
import Icon2 from "react-native-vector-icons/Ionicons";
import { NavigationEvents } from "react-navigation";
import deepDiffer from "react-native/lib/deepDiffer";
import EmojiInput from "react-native-emoji-input";

import CircleAvatarView from "../../../../components/CircleAvatarView";
import LoadingIndicator from "../../../../components/LoadingIndicator";

import { setUserData } from "../../../../store/userData";
import {
  sendMessage,
  loadMessages,
  loadFriendList,
  clearUnreadMessages,
  loadUnreadMessageCounts
} from "../../../../store/chat";
import { setOnlineUserStatus } from "../../../../store/firebaseData";
import { getChatItems } from "../../../../store/chat/selectors";

import Globals from "../../../../Globals";
import Images from "../../../../resource/Images";
import styles from "./styles";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module SafeAreaManager"
]);
YellowBox.ignoreWarnings(["Class RCTCxxModule"]);

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export const isIphoneX = () => {
  let d = Dimensions.get("window");
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === "ios" &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};

class MessageScreen extends Component {
  state = {
    userList: [],
    isModalMenSwitch: true,
    avatarNum: 0,
    messages: [],
    originalMessages: [],
    messageRoom1: "",
    messageRoom2: "",
    client: null,
    avatar: "",
    user: null,
    isEmojiSwitch: false,
    customMessage: ""
  };

  constructor(props) {
    super(props);

    this.onAvatarPress = this.onAvatarPress.bind(this);

    this.setEmoji = this.setEmoji.bind(this);
    this.setCustomMessage = this.setCustomMessage.bind(this);
    this.pushCustomMessage = this.pushCustomMessage.bind(this);
  }

  setEmoji() {
    const emoji = this.state.isEmojiSwitch;
    this.setState({
      isEmojiSwitch: !emoji
    });
  }

  setCustomMessage(text) {
    this.setState({
      customMessage: text
    });
  }

  pushCustomMessage(text) {
    const oldText = this.state.customMessage;
    const newText = oldText + text.char;
    console.log("checking", text);
    this.setState({
      customMessage: newText
    });
  }

  componentDidMount() {
    this.setState({
      user: Globals.userData
    });

    this.props.dispatch(loadFriendList(Globals.userData.uid));
    this.props.dispatch(setOnlineUserStatus(Globals.userData.uid));
    this.props.dispatch(loadUnreadMessageCounts(Globals.userData.uid));
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages) {
      const data = getChatItems(this.props.messages).reverse();
      let messageList = [];
      if (deepDiffer(data, this.state.originalMessages) && data.length > 0) {
        data.forEach(item => {
          let messageItem = {
            _id: item.id,
            text: item.text,
            createdAt: item.createdAt,
            user:
              item.user.id == Globals.userData.uid
                ? {}
                : {
                    _id: item.user.id,
                    name: item.user.name,
                    // avatar: item.user.avatar,
                    avatar:
                      this.state.client && this.state.client.avatar != ""
                        ? this.state.client.avatar
                        : item.user.avatar
                  }
            // user: {},
            // system: true,
          };
          messageList.push(messageItem);
        });
        this.setState({
          originalMessages: data,
          messages: messageList
        });
      }
      if (this.state.client != null && Globals.isMessageTab == true) {
        this.props.dispatch(
          clearUnreadMessages(Globals.userData.uid, this.state.client.uid)
        );
      }
    }

    if (this.props.friends) {
      const data = getChatItems(this.props.friends).reverse();
      if (deepDiffer(data, this.state.userList) && data.length > 0) {
        this.setState({
          userList: data
        });

        if (this.state.client == null) {
          this.onAvatarPress(data[0]);
        }
      }
    }
  }

  componentWillFocus() {}

  setInitialClient() {}

  back(number) {
    Globals.isMessageTab = false;
    // this.setState({
    //   client: null,
    // })

    switch (Globals.tabNumber) {
      case 1:
        this.props.navigation.navigate("First");
        break;
      case 2:
        this.props.navigation.navigate("Second");
        break;
      case 3:
        if (Globals.tabClientNumber == 3) {
          this.props.navigation.navigate("First");
        } else {
          this.props.navigation.navigate("Third");
        }
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

  getChildrenStyle() {
    return {
      width: Dimensions.get("window").width * 0.18,
      // height: parseInt(Math.random() * 20 + 12) * 10,
      height: WINDOW_WIDTH * 0.24 - 2,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 1)"
    };
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 6
    };
  }

  onAvatarPress(item) {
    this.setState({
      avatarNum: item.userId,
      client: {
        uid: item.userId,
        name: item.userName,
        roomId: item.roomId,
        avatar: item.avatar
      },
      avatar: item.avatar,
      originalMessages: [],
      messages: []
    });
    this.props.dispatch(loadMessages(Globals.userData.uid, item.userId));
    this.props.dispatch(clearUnreadMessages(Globals.userData.uid, item.userId));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#efefef"
          },
          right: {
            backgroundColor: "#5564d5"
          }
        }}
        textStyle={{
          right: {
            color: "white",
            // fontFamily: 'Montserrat-Light',
            fontSize: 17
          },
          left: {
            color: "#222222",
            // fontFamily: 'Montserrat-Light',
            fontSize: 17
          }
        }}
      />
    );
  }

  renderChatFooter = (props, pushCustomMessage) => {
    if (props) {
      return (
        <View
          style={{
            height: isIphoneX()
              ? WINDOW_HEIGHT * 0.8 - WINDOW_WIDTH * 1 + 10
              : WINDOW_HEIGHT * 0.8 - WINDOW_WIDTH * 1 + 10,
            width: WINDOW_WIDTH,
            backgroundColor: "white"
          }}
        >
          <EmojiInput onEmojiSelected={emoji => pushCustomMessage(emoji)} />
        </View>
      );
    } else {
      return <View />;
    }
  };

  renderFooter = setEmoji => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: isIphoneX() ? WINDOW_HEIGHT * 0.065 : WINDOW_HEIGHT * 0.065,
          width: WINDOW_WIDTH,
          backgroundColor: "white"
        }}
      >
        <Image
          source={require("../../../../assets/003.png")}
          style={{ height: 30, width: 33 }}
          resizeMod="cover"
        />

        <Image
          style={{ height: 30, width: 17 }}
          resizeMod="cover"
          source={require("../../../../assets/005.png")}
        />
        <Image
          style={{ height: 30, width: 35 }}
          resizeMod="cover"
          source={require("../../../../assets/001.png")}
        />
        <Image
          style={{ height: 30, width: 35 }}
          resizeMod="cover"
          source={require("../../../../assets/006.png")}
        />
        <Image
          style={{ height: 30, width: 30 }}
          resizeMod="cover"
          source={require("../../../../assets/004.png")}
        />
        <TouchableOpacity onPress={() => setEmoji()}>
          <Image
            style={{ height: 30, width: 30 }}
            resizeMod="cover"
            source={require("../../../../assets/002.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Icon2 name="md-send" size={30} color="#fe1394" />
        </View>
      </Send>
    );
  }

  onSend(messages = []) {
    // { text: 'Hi',
    // user: {},
    // createdAt: Fri Sep 07 2018 23:41:58 GMT+0800 (CST),
    // _id: '8add5027-da28-447d-917f-458fc4fa5d80' }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    this.props.dispatch(
      sendMessage(
        this.state.user.uid,
        this.state.client.uid,
        messages[0].text,
        this.state.user.name,
        Globals.avatarPhoto != null
          ? Globals.avatarPhoto.url
          : Globals.BaseDefaultAvatarMale,
        this.state.client.name,
        this.state.avatar != null || this.state.avatar != ""
          ? this.state.avatar
          : Globals.BaseDefaultAvatarMale
      )
    );
  }

  setCustomText(text) {
    // this.props.updateMessage(text)
  }

  renderChildren() {
    const rUserList = this.state.userList;
    var bTemp = false;
    if (this.state.client != null) {
      this.state.userList.forEach(element => {
        if (element.userId == this.state.client.uid) {
          bTemp = true;
        }
      });
    }

    if (!bTemp && this.state.client != null) {
      let elementUser = {
        avatar: this.state.client.avatar,
        isOnline: false,
        roomId: this.state.client.roomId,
        unseenCounts: 0,
        userId: this.state.client.uid,
        userName: this.state.client.name
      };
      rUserList.push(elementUser);
    }

    return rUserList.map((item, key) => {
      return (
        <View
          style={[
            this.getChildrenStyle(),
            this.state.avatarNum == item.userId
              ? { borderBottomWidth: 2, borderBottomColor: "#fd2191" }
              : null
          ]}
          key={key}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.onAvatarPress(item)}
          >
            <View
              style={{
                flex: 1,
                padding: 2,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width:
                    this.state.avatarNum == item.userId
                      ? WINDOW_WIDTH * 0.18 - 10
                      : WINDOW_WIDTH * 0.18 - 22,
                  height:
                    this.state.avatarNum == item.userId
                      ? WINDOW_WIDTH * 0.24 - 2
                      : WINDOW_WIDTH * 0.24 - 14,
                  position: "absolute",
                  bottom: -5
                }}
              >
                <CircleAvatarView
                  width={
                    this.state.avatarNum == item.userId
                      ? WINDOW_WIDTH * 0.18 - 10
                      : WINDOW_WIDTH * 0.18 - 22
                  }
                  height={
                    this.state.avatarNum == item.userId
                      ? WINDOW_WIDTH * 0.24 - 2
                      : WINDOW_WIDTH * 0.24 - 14
                  }
                  name={item.userName}
                  status={item.isOnline == true ? "online" : "away"}
                  farAway={""}
                  avatarSource={
                    item.avatar != ""
                      ? { uri: item.avatar }
                      : Images.profileAvatar
                  }
                  badgeNumber={item.unseenCounts}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }, this);
  }

  render() {
    let strLabel = {
      autoDelete: {
        en: "Auto delete",
        fr: "Effacement\n automatique"
      },
      writeYourMessage: {
        en: "Write your message",
        fr: "Ecris ton message"
      }
    };

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            if (this.state.client != null) {
              this.props.dispatch(
                clearUnreadMessages(Globals.userData.uid, this.state.client.uid)
              );
            }

            if (payload.state.params) {
              if (deepDiffer(this.state.client, payload.state.params.client)) {
                if (payload.state.params.client != null) {
                  this.setState({
                    avatarNum: payload.state.params.client.uid,
                    client: {
                      uid: payload.state.params.client.uid,
                      name: payload.state.params.client.name,
                      roomId:
                        Globals.userData.uid +
                        "-" +
                        payload.state.params.client.uid,
                      avatar:
                        payload.state.params && payload.state.params.avatar
                          ? payload.state.params.avatar
                          : ""
                    },
                    avatar:
                      payload.state.params && payload.state.params.avatar
                        ? payload.state.params.avatar
                        : "",
                    originalMessages: [],
                    messages: []
                  });
                  this.props.dispatch(
                    loadMessages(
                      Globals.userData.uid,
                      payload.state.params.client.uid
                    )
                  );
                }
              }
            }

            if (this.state.client == null && this.state.userList.length > 0) {
              this.onAvatarPress(this.state.userList[0]);
            }
          }}
        />
        <View
          style={{
            height: WINDOW_WIDTH * 0.24,
            marginTop: isIphoneX() ? 35 : 10,
            borderBottomColor: "#e8e8e8",
            borderBottomWidth: 2,
            backgroundColor: "white"
          }}
        >
          <ScrollView horizontal={true} style={{ flex: 1 }}>
            {this.renderChildren()}
          </ScrollView>
        </View>

        <View
          style={{
            height: WINDOW_WIDTH * 0.16,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: "white",
            width: WINDOW_WIDTH
          }}
        >
          <View
            style={{
              flex: 1,
              borderBottomColor: "#e8e8e8",
              borderBottomWidth: 2,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.back(Globals.tabNumber);
                  }}
                >
                  <Icon name="chevron-left" size={35} color="#000000" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 20
                }}
              >
                <Text style={{ color: "#222222", fontSize: 20 }}>
                  {this.state.client && this.state.client.name
                    ? this.state.client.name
                    : ""}
                </Text>
                <Text style={{ color: "#00e10b", fontSize: 14 }}>
                  {this.state.client ? "online now" : ""}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ justifyContent: "center", paddingRight: 10 }}>
                <Text
                  style={{
                    color: "#a9a9a9",
                    fontSize: 14,
                    textAlign: "center"
                  }}
                >
                  {strLabel.autoDelete.fr}
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Switch
                  value={this.state.isModalMenSwitch}
                  onValueChange={val => {
                    this.setState({
                      isModalMenSwitch: !this.state.isModalMenSwitch
                    });
                  }}
                  disabled={false}
                  activeText={""}
                  inActiveText={""}
                  backgroundActive={"#febcde"}
                  backgroundInactive={"#e8e8e8"}
                  circleActiveColor={"#fd2191"}
                  circleInActiveColor={"#a8a8a8"}
                  barHeight={Platform.OS === "ios" ? 14 : 24}
                  circleSize={24}
                  circleBorderWidth={0}
                />
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            height: isIphoneX()
              ? WINDOW_HEIGHT - WINDOW_WIDTH * 0.4 - 80
              : WINDOW_HEIGHT - WINDOW_WIDTH * 0.4 - 60,
            width: WINDOW_WIDTH,
            backgroundColor: "white"
          }}
        >
          {this.state.client && (
            <GiftedChat
              placeholder={strLabel.writeYourMessage.fr}
              onSend={messages => this.onSend(messages)}
              renderBubble={this.renderBubble}
              renderFooter={() => this.renderFooter(this.setEmoji)}
              renderChatFooter={() =>
                this.renderChatFooter(
                  this.state.isEmojiSwitch,
                  this.pushCustomMessage
                )
              }
              messages={this.state.messages}
              renderSend={this.renderSend}
              // showUserAvatar={true}
              showAvatarForEveryMessage={true}
              text={this.state.customMessage}
              onInputTextChanged={text => this.setCustomMessage(text)}
            />
          )}
        </View>

        <View style={{ height: isIphoneX() ? 30 : 0 }} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const props = {
    user: state.userData.user,

    messages: state.chat.messages,
    error: state.chat.loadMessagesError,
    friends: state.chat.friends,
    friendsError: state.chat.loadFriendsError
  };
  return props;
};

export default connect(mapStateToProps)(MessageScreen);
