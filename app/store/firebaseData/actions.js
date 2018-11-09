import * as types from './actionTypes'
import firebaseService from '../../services/firebase'
import RNFetchBlob from 'rn-fetch-blob';
// import RNFetchBlob from 'react-native-fetch-blob'
import { Platform } from 'react-native';
import Moment from 'moment';

import geolib from "geolib";


// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob


export const writeUserData = (email, userName, age, gender, coords, city, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    
    var user = firebaseService.auth().currentUser;
    if (user) {
      let createdDate = new Date().toUTCString();
      firebaseService.database().ref('users/' + user.uid).set({
        email,
        name: userName,
        age,
        gender,
        coords,
        city,
        createdAt: createdDate
      }).then((data)=>{
        //success callback

        firebaseService.database().ref('userFilters/' + user.uid).set({
          looking: 0,
          far: 50,
          age: '18,25',
          city: city
        })

        const auth = {
          uid: firebaseService.auth().currentUser.uid,
          email,
          name: userName,
          age,
          gender,
          coords,
          city
        }
        dispatch(firebaseApiWriteUserSuccess(auth, pageName))
      }).catch((error)=>{
        //error callback
        console.log('error ' , error)
        dispatch(firebaseApiError(error))
      })
    } else {
      dispatch(firebaseApiError("Authentication Failed"))
    }
  }
}

export const readUserData = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())
    var user = firebaseService.auth().currentUser;
    if (user) {
      firebaseService.database().ref('users').child( firebaseId ).once("value", snapshot => {
        const auth = { ...snapshot.val(), uid: firebaseId }
        console.log("=== firebase user 20 ===")
        console.log( auth );
        console.log("=== firebase user 21 ===")
    
        dispatch(firebaseApiWriteUserSuccess(auth, pageName))
      })
    } else {
      dispatch(firebaseApiError("Authentication Failed"))
    }
  }
}

export const detectOnlineUser = (firebaseId) => {
  return (dispatch) => {
    var amOnline = firebaseService.database().ref('.info/connected');
    var userRef = firebaseService.database().ref('presence').child( firebaseId );
    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    })
  }
}

export const setOnlineUserStatus = (firebaseId) => {
  return (dispatch) => {
    firebaseService.database().ref().child('presence').on('value', (snapshot) => {

      firebaseService.database().ref('messageFriends').child( firebaseId ).once("value", mFSnapshot => {
        mFSnapshot.forEach(friends => {
          firebaseService.database().ref('presence').child( friends.key ).once("value", mFSnap => {
            if (mFSnap.val() != null) {
              firebaseService.database().ref('messageFriends').child( firebaseId ).child(friends.key).update({
                isOnline: true
              });
            } else {
              firebaseService.database().ref('messageFriends').child( firebaseId ).child(friends.key).update({
                isOnline: false
              });
            }
          });
        });
      })
    })
  }
}

export const updateUserCity = (firebaseId, city, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())
    var adaNameRef = firebaseService.database().ref('users/' + firebaseId);
    adaNameRef.update({ city: city });
  }
}

export const updateUserAbout = (firebaseId, text, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())

    var adaNameRef = firebaseService.database().ref('users/' + firebaseId);
    adaNameRef.update({ about: text });
  }
}

export const updateUserInformation = (firebaseId, information, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())

    var adaNameRef = firebaseService.database().ref('users/' + firebaseId);
    adaNameRef.update({ information: information });
  }
}

export const updateUserInterests = (firebaseId, interests, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())

    var adaNameRef = firebaseService.database().ref('users/' + firebaseId);
    adaNameRef.update({ interests: interests });
  }
}

export const uploadPhoto = (firebaseId, photoUri, pageName, mime = 'application/octer-stream') => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri
      const sessionId = new Date().getTime();
      let uploadBlob = null

      const imageRef = firebaseService.storage().ref('images').child(firebaseId).child(`${sessionId}`);

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          firebaseService.database().ref('photos').child( firebaseId ).child(`${sessionId}`).set({
            url,
            isPrivate: false,
            createdAt: sessionId
          })

          firebaseService.database().ref('photos').child( firebaseId ).orderByKey().once("value", function (snap) {
            var photoList = [];
            var privateCreatedAt = '';
            snap.forEach(function (childSnap) {
              photo = {
                url: childSnap.val().url,
                isPrivate: childSnap.val().isPrivate,
                createdAt: childSnap.val().createdAt
              }
              if (childSnap.val().isPrivate) {
                privateCreatedAt = childSnap.val().createdAt;
              }
              photoList.push(photo);
            });
            if (privateCreatedAt == '') {
              firebaseService.database().ref('photos').child( firebaseId ).child(photoList[0].createdAt).update({
                isPrivate: true
              })
              photoList[0].isPrivate = true;
            }
            dispatch(firebaseApiPhotoSuccess(photoList, pageName));
          });

        })
        .catch((error) => {
          dispatch(firebaseApiError(error))
          reject(error)
      })
    })
  }
}

export const getUserPhotos = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.database().ref('photos').child( firebaseId ).orderByKey().once("value", function (snap) {
      var photoList = [];
      snap.forEach(function (childSnap) {
        photo = {
          url: childSnap.val().url,
          isPrivate: childSnap.val().isPrivate,
          createdAt: childSnap.val().createdAt
        }
        photoList.push(photo);
      });
      dispatch(firebaseApiPhotoSuccess(photoList, pageName));
    });
  }
}

export const deletePhoto = (firebaseId, assetId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.storage().ref('images').child(firebaseId).child(`${assetId}`).delete();
    firebaseService.database().ref().child('photos').child(firebaseId).child(assetId).remove()

    firebaseService.database().ref().child('photos').child( firebaseId ).orderByKey().once("value", function (snap) {
      var photoList = [];
      snap.forEach(function (childSnap) {
        photo = {
          url: childSnap.val().url,
          isPrivate: childSnap.val().isPrivate,
          createdAt: childSnap.val().createdAt
        }
        photoList.push(photo);
      });
      dispatch(firebaseApiPhotoSuccess(photoList, pageName));
    });
  }
}

export const setDefaultPhoto = (firebaseId, assetId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())
    
    firebaseService.database().ref().child('photos').child( firebaseId ).orderByKey().once("value", function (snap) {
      var photoList = [];
      snap.forEach(function (childSnap) {
        if (childSnap.val().createdAt == assetId) {
          firebaseService.database().ref('photos').child( firebaseId ).child(assetId).update({
            isPrivate: true
          })
          photo = {
            url: childSnap.val().url,
            isPrivate: true,
            createdAt: childSnap.val().createdAt
          }
        } else {
          firebaseService.database().ref('photos').child( firebaseId ).child(assetId).update({
            isPrivate: false
          })
          photo = {
            url: childSnap.val().url,
            isPrivate: false,
            createdAt: childSnap.val().createdAt
          }
        }

        photoList.push(photo);
      });
      dispatch(firebaseApiPhotoSuccess(photoList, pageName));
    });
  }
}

export const getActivity = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    var promise1 =  new Promise((resolve, reject) => {
      firebaseService.database().ref().child('likes').once("value", function (snap) {
        var likedMeList = [];
        snap.forEach(function (childSnap) {
          childSnap.forEach(function (subChildSnap) {
            if (subChildSnap.key == firebaseId) {
              let likedPersonId = childSnap.key;
              let likedPerson = {
                ...subChildSnap.val(),
                uid: likedPersonId
              }
              likedMeList.push(likedPerson);
            }
          });
        });
        resolve(likedMeList);
      });
    });
    var promise2 =  new Promise((resolve, reject) => {
      firebaseService.database().ref().child('visits').once("value", function (snap) {
        var likedMeList = [];
        snap.forEach(function (childSnap) {
          childSnap.forEach(function (subChildSnap) {
            if (subChildSnap.key == firebaseId) {
              let likedPersonId = childSnap.key;
              let likedPerson = {
                ...subChildSnap.val(),
                uid: likedPersonId
              }
              likedMeList.push(likedPerson);
            }
            // if (subChildSnap.key == firebaseId) {
            //   subChildSnap.forEach(function (visitSnap) {
            //     let likedPersonId = childSnap.key;
            //     let likedPerson = {
            //       ...visitSnap.val(),
            //       uid: likedPersonId,
            //       visitId: visitSnap.key
            //     }
            //     likedMeList.push(likedPerson);
            //   })
            // }
          });
        });
        resolve(likedMeList);
      });
    });
    var promise3 =  new Promise((resolve, reject) => {
      firebaseService.database().ref().child('likes').child(firebaseId).once("value", function (snap) {
        var matchedList = [];
        snap.forEach(function (childSnap) {
          let likedPersonId = childSnap.key;
          let likedPerson = {
            ...childSnap.val(),
            uid: likedPersonId
          }
          matchedList.push(likedPerson);
        });
        resolve(matchedList);
      });
    });

    return new Promise.all([promise1, promise2, promise3]).then(function(values) {
      let likedMeList = values[0];
      let visitedMeList = values[1];
      let likedAnotherPerson = values[2];
      var matchedList = [];
      for (var i = 0; i < likedAnotherPerson.length; i++) {
        for (var j = 0; j < likedMeList.length; j++) {
          if (likedAnotherPerson[i].uid == likedMeList[j].uid) {
            matchedList.push(likedMeList[j])
          }
        }
      }

      let activityList = {
        maches: matchedList,
        likedMe: likedMeList,
        visitedMe: visitedMeList
      }
      dispatch(firebaseLikedSuccess(activityList, pageName));

    });
  }
}

export const findUsers = (firebaseId, assetId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    var promise1 =  new Promise((resolve, reject) => {
      firebaseService.database().ref().child('users').child(firebaseId).once("value", function (snap) {
        if (snap.val()) {
          resolve(snap.val());
        } else {
          resolve([]);
          // reject("empty user")
        }
      });
    });
    var promise2 = new Promise((resolve, reject) => {
      firebaseService.database().ref().child('userFilters').child(firebaseId).once("value", function (snap) {
        if (snap.val()) {
          resolve(snap.val());
        } else {
          reject("empty filter")
        }
      });
    });

    return new Promise.all([promise1, promise2]).then(function(values) {
      firebaseService.database().ref().child('users').orderByKey().once("value", function (snap) {
        var userList = [];
        if (snap.val()) {
          snap.forEach(function (childSnap) {
  
            // if (childSnap.val().createdAt == null) {
            //   let createdDate = new Date().toUTCString();
            //   var adaNameRef = firebaseService.database().ref('users/' + childSnap.key);
            //   adaNameRef.update({ createdAt: createdDate });
            // }
            let isDistance = true;
            if (childSnap.val().coords != null && values[0].coords != null) {
              isDistance = geolib.isPointInCircle(
                {latitude: childSnap.val().coords.lat, longitude: childSnap.val().coords.long},
                {latitude: values[0].coords.lat, longitude: values[0].coords.long},
                values[1].far * 1000
              );
            }
            let lookingFemale = values[1].looking == 0 ? 'female' : 'male';
            let lookingAge = values[1].age.split(",");
            let dateDiff = getDateDifference(childSnap.val().createdAt);
  
            var isOnline = false;
            firebaseService.database().ref('presence').child( childSnap.key ).once("value", function (presenceSnap) {
              if (presenceSnap.val()) {
                isOnline = true;
              }
            });
  
            if (childSnap.key != firebaseId && isDistance && lookingFemale == childSnap.val().gender && (childSnap.val().age >= parseInt(lookingAge[0], 10) && childSnap.val().age <= parseInt(lookingAge[1], 10)) && childSnap.val().city == values[0].city) {
              firebaseService.database().ref('photos').child( childSnap.key ).orderByKey().once("value", function (photoSnap) {
                var avatar = '';
                photoSnap.forEach(function (photoChildSnap) {
                  if (photoChildSnap.val().isPrivate == true) {
                    avatar = photoChildSnap.val().url;
                    }
                });
  
                if (avatar != '') {
                  let userItem = {
                    ...childSnap.val(),
                    uid: childSnap.key,
                    avatar: avatar,
                    isNew: dateDiff.days < 7 ? 'new' : '',
                    isOnline: isOnline
                  }
                  userList.push(userItem);
                } else {
                  let userItem = {
                    ...childSnap.val(),
                    uid: childSnap.key,
                    avatar: '',
                    isNew: dateDiff.days < 7 ? 'new' : '',
                    isOnline: isOnline
                  }
                  userList.push(userItem);
                }
                // dispatch(firebaseFindUserSuccess(userList, pageName));
              });
            }
          });
          dispatch(firebaseFindUserSuccess(userList, pageName));
          
        } else {
          dispatch(firebaseFindUserSuccess([], pageName));
        }
      });
    }, reason => {
      dispatch(firebaseApiError(reason));
    });
  }
}

export const updateUserCoordinate = (firebaseId, lat, long, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())

    var adaNameRef = firebaseService.database().ref('users/' + firebaseId);
    adaNameRef.update({ 
      coords: {
        lat: lat,
        long: long
      }
    });
  }
}

export const getFilterData = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.database().ref().child('userFilters').child( firebaseId ).once("value", function (snap) {
      dispatch(firebaseFilterDataSuccess(snap.val(), pageName));
    });
  }
}

export const setFilterData = (firebaseId, looking, far_away, age_range, city, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    var userFilterRef = firebaseService.database().ref('userFilters/' + firebaseId);
    userFilterRef.update({ 
      age: age_range,
      city: city,
      far: far_away,
      looking: looking
    });

    firebaseService.database().ref().child('userFilters').child( firebaseId ).once("value", function (snap) {
      dispatch(firebaseFilterDataSuccess(snap.val(), pageName));
    });
  }
}

export const likedMeList = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.database().ref().child('likes').child( firebaseId ).once("value", function (snap) {
      var likedList = [];
      snap.forEach(function (childSnap) {
        likedList.push(childSnap.val());
      });
      dispatch(firebaseLikedSuccess(likedList, pageName));
    });
  }
}

export const likeUser = (firebaseId, name, email, avatar, anotherId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    let likedDate = new Date().toUTCString();
    firebaseService.database().ref('likes').child( firebaseId ).child(anotherId).set({
      name: name,
      email: email,
      avatar: avatar,
      liked: true,
      likedAt: likedDate
    })

    firebaseService.database().ref().child('likes').child( firebaseId ).child(anotherId).once("value", function (snap) {
      if (snap.val() != null) {
        //user exists, do something
        dispatch(firebaseLikedMeSuccess(true, pageName));
      } else {
        //user does not exist, do something else
        dispatch(firebaseLikedMeSuccess(false, pageName));
      }
    });
  }
}

export const getLikeThisUser = (firebaseId, anotherId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.database().ref().child('likes').child( firebaseId ).child(anotherId).once("value", function (snap) {
      if (snap.val() != null) {
        //user exists, do something
        dispatch(firebaseLikedMeSuccess(true, pageName));
      } else {
        //user does not exist, do something else
        dispatch(firebaseLikedMeSuccess(false, pageName));
      }
    });
  }
}

export const visitUser = (firebaseId, name, email, avatar, anotherId, pageName) => {
  return (dispatch) => {
    // dispatch(firebaseApiLoading())

    let visitedDate = new Date().toUTCString();
    const sessionId = new Date().getTime();

    firebaseService.database().ref('visits').child( firebaseId ).child(anotherId).set({
      name: name,
      email: email,
      avatar: avatar,
      visited: true,
      visitedAt: visitedDate
    })

    // firebaseService.database().ref('visits').child( firebaseId ).child(anotherId).child(`${sessionId}`).set({
    //   name: name,
    //   email: email,
    //   avatar: avatar,
    //   visited: true,
    //   visitedAt: visitedDate
    // })

    // dispatch(firebaseNormalSuccess(pageName));
  }
}

export const visitedMeList = (firebaseId, pageName) => {
  return (dispatch) => {
    dispatch(firebaseApiLoading())

    firebaseService.database().ref().child('visits').child( firebaseId ).once("value", function (snap) {
      var likedList = [];
      snap.forEach(function (childSnap) {
        likedList.push(childSnap.val());
      });
      dispatch(firebaseLikedSuccess(likedList, pageName));
    });
  }
}


const firebaseApiLoading = () => ({
  type: types.FIREBASE_API_LOADING
})

const firebaseApiError = error => ({
  type: types.FIREBASE_API_ERROR,
  error
})

const firebaseApiWriteUserSuccess = (user, pageName) => ({
  type: types.FIREBASE_API_SUCCESS,
  user,
  pageName
})

const firebaseApiPhotoSuccess = (photoList, pageName) => ({
  type: types.FIREBASE_PHOTO_SUCCESS,
  photoList,
  pageName
})

const firebaseFindUserSuccess = (userList, pageName) => ({
  type: types.FIREBASE_FIND_USER_SUCCESS,
  userList,
  pageName
})

const firebaseFilterDataSuccess = (filterData, pageName) => ({
  type: types.FIREBASE_FILTER_DATA_SUCCESSS,
  filterData,
  pageName
})

const firebaseLikedSuccess = (likedList, pageName) => ({
  type: types.FIREBASE_LIKE_SUCCESS,
  likedList,
  pageName
})

const firebaseLikedMeSuccess = (status, pageName) => ({
  type: types.FIREBASE_LIKE_ME_SUCCESS,
  status,
  pageName
})

const firebaseNormalSuccess = (pageName) => ({
  type: types.FIREBASE_NORMAL_SUCCESS,
  pageName
})


getDateDifference = (oldDate) =>  {
  var date_now = new Date();
  var date_visit = new Date(oldDate);

  var diff = Moment.duration(Moment(date_now).diff(Moment(date_visit)));
  var days = parseInt(diff.asDays());
  var hours = parseInt(diff.asHours());
  hours = hours - days*24;
  var minutes = parseInt(diff.asMinutes());
  minutes = minutes - (days*24*60 + hours*60);

  // var strDifference = "il y'a ";
  // if (days > 0) {
  //   strDifference = strDifference + days + " Jours";
  //   // if (days > 7) {
  //   //   strDifference = "il y'a " + Math.floor(days / 7) + " Semaines";
  //   // }
  //   if (days > 30) {
  //     strDifference = "il y'a " + Math.floor(days / 30) + " Mois";
  //   }
  // } else if (hours > 0) {
  //   strDifference = strDifference + hours + " Heures";
  // } else {
  //   strDifference = strDifference + minutes + " Minutes";
  // }

  strDifference = {
    days: days,
    hours: hours,
    minutes: minutes
  }

  return strDifference;
}