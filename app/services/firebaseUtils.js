import firebaseService from "./firebase";

export const messageTypes = {
  text: "text",
  image: "image"
};

export function getMessageObject(sessionId, type, content, user, visitedDate) {
  const message = {
    id: sessionId,
    status: "sent",
    messageType: type,
    user: user,
    createdAt: visitedDate
  };

  if (type == "text") message.text = content;
  else if (type == "image") message.image = content;

  return message;
}

export function createMessage(sessionId, messageRoom, messageObject) {
  firebaseService
    .database()
    .ref("messages")
    .child(messageRoom)
    .child(`${sessionId}`)
    .set(messageObject);
}

export function createMessageThreadMetadata(
  senderId,
  messageRoom1,
  messageRoom2,
  visitedDate
) {
  firebaseService
    .database()
    .ref()
    .child("messageThreadMetadata")
    .child(messageRoom1)
    .once("value", function(snap) {
      if (snap.val() == null) {
        firebaseService
          .database()
          .ref("messageThreadMetadata")
          .child(messageRoom1)
          .set({
            roomId: messageRoom1,
            createdByUserId: senderId,
            threadType: "private",
            createdAt: visitedDate
          });
        firebaseService
          .database()
          .ref("messageThreadMetadata")
          .child(messageRoom2)
          .set({
            roomId: messageRoom1,
            createdByUserId: senderId,
            threadType: "private",
            createdAt: visitedDate
          });
      }
    });
}

export function updateMessageFriends(user, receiverId, messageRoom) {
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
}

export function uploadMessageFile(file, filename) {
  // file -> Blob or Base64?

  var metadata = {
    contentType: "image/jpeg"
  };

  var storageRef = firebaseService
    .storage()
    .ref()
    .child(`MessagesImages/${filename}`);

  storageRef.put(file, metadata).then(function() {
    storageRef.getDownloadURL().then(function(result) {
      return result;
    });
  });
}

export function getMessageFile(filename) {
  firebaseService
    .storage()
    .ref()
    .child(`MessagesImages/${filename}`)
    .getDownloadURL()
    .then(function(url) {
      return url;
    })
    .catch(function(error) {
      console.log("Error", error);
    });
}
