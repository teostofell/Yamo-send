import * as types from "./actionTypes";
import firebaseService from "../../services/firebase";
import * as firebaseUtils from "../../services/firebaseUtils";

const FIREBASE_REF_MESSAGES_LIMIT = 20;

export const sendImage = (file, imageName) => {
  return dispatch => {
    return firebaseUtils.uploadMessageFile(file, imageName).then(res => {
      url = res;
      console.log("Checking the url for image sender:", url);
      return url;
    });
  };
};

export const getImage = imageName => {
  return dispatch => {
    console.log("Checking the argument for image getter:", imageName);
    return firebaseUtils.getMessageFile(imageName);
  };
};

export const sendMessage = (
  senderId,
  receiverId,
  message,
  senderName,
  senderAvatar,
  receiverName,
  receiverAvatar,
  messageType = firebaseUtils.messageTypes.text
) => {
  return dispatch => {
    let visitedDate = new Date().toUTCString();
    const sessionId = new Date().getTime();

    const user = {
      id: senderId,
      avatar: senderAvatar,
      name: senderName
    };

    let messageRoom1 = senderId + "-" + receiverId;
    let messageRoom2 = receiverId + "-" + senderId;

    // Generate message object
    const messageObject = firebaseUtils.getMessageObject(
      sessionId,
      messageType,
      message,
      user,
      visitedDate
    );

    // Store message in the both rooms
    firebaseUtils.createMessage(sessionId, messageRoom1, messageObject);
    firebaseUtils.createMessage(sessionId, messageRoom2, messageObject);

    // Store message thread metadata for both rooms
    firebaseUtils.createMessageThreadMetadata(
      senderId,
      messageRoom1,
      messageRoom2,
      visitedDate
    );

    firebaseService
      .database()
      .ref()
      .child("messageFriends")
      .child(senderId)
      .child(receiverId)
      .once("value", function(snap) {
        if (snap.val() == null) {
          firebaseService
            .database()
            .ref("messageFriends")
            .child(senderId)
            .child(receiverId)
            .set({
              roomId: messageRoom1,
              userId: receiverId,
              userName: receiverName,
              avatar: receiverAvatar
            });
        } else {
          firebaseService
            .database()
            .ref("messageFriends")
            .child(senderId)
            .child(receiverId)
            .update({
              userName: receiverName,
              avatar: receiverAvatar
            });
        }
      });

    firebaseService
      .database()
      .ref()
      .child("messageFriends")
      .child(receiverId)
      .child(senderId)
      .once("value", function(snap) {
        if (snap.val() == null) {
          firebaseService
            .database()
            .ref("messageFriends")
            .child(receiverId)
            .child(senderId)
            .set({
              roomId: messageRoom2,
              userId: senderId,
              userName: senderName,
              avatar: senderAvatar
            });
        } else {
          firebaseService
            .database()
            .ref("messageFriends")
            .child(receiverId)
            .child(senderId)
            .update({
              userName: senderName,
              avatar: senderAvatar
            });
        }
      });

    firebaseService
      .database()
      .ref()
      .child("unseenMsgCountData")
      .child(messageRoom2)
      .once("value", function(snap) {
        var unseenMsgCount = 1;
        // firebaseService.database().ref().child('unseenMsgCountData').child(messageRoom1).remove();
        if (snap.val() != null) {
          unseenMsgCount = snap.val().unseenMsgCount + 1;
          // firebaseService.database().ref().child('unseenMsgCountData').child(messageRoom2).remove();
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom2)
            .update({
              unseenMsgCount: unseenMsgCount,
              userId: senderId
            });
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom1)
            .update({
              unseenMsgCount: 0,
              userId: senderId
            });
        } else {
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom2)
            .set({
              unseenMsgCount: 1,
              userId: senderId
            });
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom1)
            .set({
              unseenMsgCount: 0,
              userId: senderId
            });
        }
      });
  };
};

export const clearUnreadMessages = (senderId, receiverId) => {
  return dispatch => {
    let messageRoom1 = senderId + "-" + receiverId;
    let messageRoom2 = receiverId + "-" + senderId;

    firebaseService
      .database()
      .ref()
      .child("unseenMsgCountData")
      .child(messageRoom1)
      .once("value", function(snap) {
        if (snap.val() != null) {
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom1)
            .update({
              unseenMsgCount: 0,
              userId: senderId
            });
        } else {
          firebaseService
            .database()
            .ref()
            .child("unseenMsgCountData")
            .child(messageRoom1)
            .set({
              unseenMsgCount: 0,
              userId: senderId
            });
        }
      });
    // firebaseService.database().ref().child('unseenMsgCountData').child(messageRoom).remove();
  };
};

export const loadMessages = (senderId, receiverId) => {
  return dispatch => {
    let messageRoom = senderId + "-" + receiverId;
    firebaseService
      .database()
      .ref()
      .child("messages")
      .child(messageRoom)
      .limitToLast(FIREBASE_REF_MESSAGES_LIMIT)
      .on(
        "value",
        snapshot => {
          dispatch(loadMessagesSuccess(snapshot.val()));
        },
        errorObject => {
          dispatch(loadMessagesError(errorObject.message));
        }
      );
  };
};

export const loadFriendList = senderId => {
  return dispatch => {
    firebaseService
      .database()
      .ref()
      .child("messageFriends")
      .child(senderId)
      .on(
        "value",
        snapshot => {
          dispatch(loadFriendListSuccess(snapshot.val()));
        },
        errorObject => {
          dispatch(loadFriendListError(errorObject.message));
        }
      );
  };
};

export const loadUnreadMessageCounts = senderId => {
  return dispatch => {
    firebaseService
      .database()
      .ref()
      .child("unseenMsgCountData")
      .on("value", snapshot => {
        firebaseService
          .database()
          .ref()
          .child("messageFriends")
          .child(senderId)
          .once("value", function(friendSnap) {
            friendSnap.forEach(function(friend) {
              let messageRoom = senderId + "-" + friend.key;
              firebaseService
                .database()
                .ref()
                .child("unseenMsgCountData")
                .child(messageRoom)
                .once("value", function(msgCounts) {
                  if (msgCounts.val() != null) {
                    let mCountsInfo = msgCounts.val();
                    firebaseService
                      .database()
                      .ref("messageFriends")
                      .child(senderId)
                      .child(friend.key)
                      .update({
                        unseenCounts: mCountsInfo.unseenMsgCount
                      });
                  }
                });
            });
          });
      });
  };
};

const loadMessagesSuccess = messages => ({
  type: types.CHAT_LOAD_MESSAGES_SUCCESS,
  messages
});

const loadMessagesError = error => ({
  type: types.CHAT_LOAD_MESSAGES_ERROR,
  error
});

const loadFriendListSuccess = friends => ({
  type: types.CHAT_LOAD_FRIENDS_SUCCESS,
  friends
});

const loadFriendListError = error => ({
  type: types.CHAT_LOAD_FRIENDS_ERROR,
  error
});
