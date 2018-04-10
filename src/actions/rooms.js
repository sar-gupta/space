import database, { firebase } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import moment from 'moment';

export const createRoom = ({ id, name, people, messages = [] }) => ({
  type: 'CREATE_ROOM',
  room: {
    id,
    name,
    people: people,
    messages
  }
});

// export const addRoomToUser = (roomID) => ({
//   type: 'ADD_ROOM_TO_USER',
//   roomID
// })

export const startCreateRoom = (roomper = {}, showCreateError) => {
  //TODO: Don't allow creation of already created rooms
  return (dispatch, getState) => {
    const room = {
      name: roomper.name
    }
    return database.ref('rooms').once('value', (snapshot) => {
      const rooms = [];
      snapshot.forEach((childSnapshot) => {
        rooms.push({
          ...childSnapshot.val()
        });
      });
      if (!rooms.find((r) => r.name === room.name)) {
        return database.ref('rooms').push(room).then((ref) => {
          return database.ref(`rooms/${ref.key}/people`).push(roomper.people).then(() => {
            database.ref('users').once('value').then((snapshot) => {
              snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().uid === roomper.people.id) {
                  database.ref(`users/${childSnapshot.key}/rooms`).push(ref.key);
                }
              })
            });

            dispatch(createRoom({
              id: ref.key,
              ...roomper,
              people: [roomper.people]
            }));
            history.push(`/room/${room.name}`);

            // dispatch(addRoomToUser(ref.key));
          });

        });
      } else {
        return showCreateError('Room name not available!');
      }
    });
  };
};

// export const joinRoom = ({ name, id, roomName }) => ({
//   type: 'JOIN_ROOM',
//   roomName,
//   person: {
//     name, 
//     id
//   }
// });

const isAlreadyAdded = (data, id) => {
  for (var key in data) {
    if (data[key].id === id) return true;
  }
  return false;
}

export const startJoinRoom = (data = {}, showJoinError) => {
  // data has userName, userId, roomName
  return (dispatch, getState) => {
    const state = getState();
    return database.ref('rooms').once('value', (snapshot) => {
      const rooms = [];
      snapshot.forEach((childSnapshot) => {
        rooms.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].name === data.roomName) {
          if (isAlreadyAdded(rooms[i].people, data.id)) {
            return showJoinError('You are already added to this room');
          } else {
            const person = {
              name: data.name,
              id: data.id
            }
            return database.ref(`rooms/${rooms[i].id}/people`).push(person).then((ref) => {
              database.ref('users').once('value').then((usersnapshot) => {
                usersnapshot.forEach((childSnapshot) => {
                  if (childSnapshot.val().uid === data.id) {
                    database.ref(`users/${childSnapshot.key}/rooms`).push(rooms[i].id);
                  }
                })
              });
              dispatch(createRoom({
                people: [person],
                id: rooms[i].id,
                name: rooms[i].name
              }));
              // dispatch(addRoomToUser(ref.key));

              history.push(`room/${data.roomName}`);
            });
          }
        }
      }
      return showJoinError('Room not found!');
    });
  }
}

export const sendMessage = (message, roomName) => ({
  type: 'SEND_MESSAGE',
  message,
  roomName
});

export const startSendMessage = (text, roomName) => {
  return (dispatch, getState) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      const displayName = user.displayName;
      const message = {
        sender: { uid, displayName },
        text,
        createdAt: moment().format(),
      };
      return database.ref('rooms').once('value', (snapshot) => {
        const rooms = [];
        snapshot.forEach((childSnapshot) => {
          rooms.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        for (var i = 0; i < rooms.length; i++) {
          if (rooms[i].name === roomName) {
            return database.ref(`rooms/${rooms[i].id}/messages`).push(message);
          }
        }
      });
    }

  };
};


export const startListening = () => {
  return (dispatch, getState) => {
    return database.ref('rooms').on('child_added', (snapshot) => {
      // console.log(snapshot.val());
      const roomName = snapshot.val().name;
      return snapshot.ref.child('messages').on('child_added', (msgSnapshot) => {
        const message = msgSnapshot.val();
        dispatch(sendMessage({
          ...message,
          id: msgSnapshot.key
        }, roomName));
      });
    });
  };
};


export const setStartState = () => {
  return (dispatch, getState) => {
    // const state = getState();
    // console.log(state);
    // if(state.rooms.length === 0) {
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        let rooms = [];
        database.ref('users').once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().uid === uid) {
              rooms.push(childSnapshot.val().rooms);
              rooms = rooms[0];
              for (var key in rooms) {
                // console.log(rooms[key]);
                database.ref(`rooms/${rooms[key]}`).once('value', (snapshot) => {
                  const { name, people, messages } = snapshot.val();
                  let peopleArray = [], messagesArray = [];
                  for (var peopleKey in people) {
                    peopleArray.push(people[peopleKey]);
                  }
                  for (var messagesKey in messages) {
                    messagesArray.push({...messages[messagesKey], id: messagesKey});
                  }
                  dispatch(createRoom({
                    id: rooms[key],
                    name,
                    people: peopleArray,
                    messages: messagesArray
                  }))
                  // console.log(name, peopleArray, messages);
                });
              }
            }
          });
        });
      }
  
    // }
    
  };
}

export const clearState = ({
  type: 'CLEAR_STATE'
})

export const leaveRoom = (roomName, userId) => ({
  type: 'LEAVE_ROOM',
  roomName,
  userId
});

export const startLeaveRoom = (roomName) => {
  return (dispatch, getState) => {
    const user = firebase.auth().currentUser;
    if(user) {
      const userId = user.uid;
      const rooms = getState().rooms;
      let roomID, personID, roomPath, userPath;
      rooms.forEach((room) => {
        if(room.name === roomName) {
          roomID = room.id;
        }
      });

      database.ref(`rooms/${roomID}/people`).once('value', (snapshot) => {
        const value = snapshot.val();
        for(var key in value) {
          if(value[key].id === userId) {
            personID = key;
          }
        }
        database.ref(`rooms/${roomID}/people/${personID}`).remove();
      });

      database.ref(`users`).once('value', (userSnapshot) => {
        const userValue = userSnapshot.val();
        for(var key in userValue) {
          if(userValue[key].uid === userId) {
            userPath = key;
          }
        }
        database.ref(`users/${userPath}/rooms`).once('value', (snapshot) => {
          const value = snapshot.val();
          for(var key in value) {
            if(value[key] === roomID) {
              roomPath = key;
            }
          }
          database.ref(`users/${userPath}/rooms/${roomPath}`).remove(() => {
            dispatch(leaveRoom(roomName, userId));
            history.push('/join');
          });
        });
      });
      
      

    }

  };
};