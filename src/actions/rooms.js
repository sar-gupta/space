import database, { firebase } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import moment from 'moment';

export const createRoom = ({ id, name, people, messages = [] }) => ({
  type: 'CREATE_ROOM',
  room: {
    id,
    name,
    people,
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
            const perName = roomper.people.name ? roomper.people.name : 'Anonymous';;
            dispatch(startSendMessage(`${perName} created this room`, room.name, true));
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
              id: data.id,
              unread: data.unread,
              lastRead: 0
            }
            let people = [];
            let messages = [];
            for (var key in rooms[i].people) {
              people.push({
                id: rooms[i].people[key].id,
                name: rooms[i].people[key].name,
                unread: rooms[i].people[key].unread,
                lastRead: rooms[i].people[key].unread
              });
            }
            // const people = rooms[i].people;
            for (var key in rooms[i].messages) {
              messages.push({
                ...rooms[i].messages[key]
              });
            }
            // const messages = rooms[i].messages;
            return database.ref(`rooms/${rooms[i].id}/people`).push(person).then((ref) => {
              database.ref('users').once('value').then((usersnapshot) => {
                usersnapshot.forEach((childSnapshot) => {
                  if (childSnapshot.val().uid === data.id) {
                    database.ref(`users/${childSnapshot.key}/rooms`).push(rooms[i].id);
                  }
                })
              });

              dispatch(createRoom({
                people: [...people, person],
                id: rooms[i].id,
                name: rooms[i].name,
                messages
              }));
              const perName = person.name ? person.name : 'Anonymous';;

              dispatch(startSendMessage(`${perName} joined`, data.roomName, true));
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

export const startSendMessage = (text, roomName, status = false) => {
  return (dispatch, getState) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      const displayName = user.displayName;
      const message = {
        sender: { uid, displayName },
        text,
        createdAt: moment().format(),
        status
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
            // dispatch(orderRoomsStartState(getState().rooms));            
            return database.ref(`rooms/${rooms[i].id}/messages`).push(message);
          }
        }
      });
    }

  };
};

// export const reorderRooms = (roomName) => ({
//   type: 'REORDER_ROOMS',
//   roomName
// });

// export const startUpdateUnread = (roomName, personID) => {
//   return (dispatch) => {

//   };
// };


export const startListening = () => {
  return (dispatch, getState) => {
    // const state = getState();
    return database.ref('rooms').on('child_added', (snapshot) => {
      // console.log(snapshot.val());

      snapshot.ref.child('messages').on('child_added', (msgSnapshot) => {
        snapshot.ref.child('people').once('value', (personSnapshot) => {

          // snapshot.ref.child('messages').once('child_added', (msgSnapshot) => {

          // console.log(msgSnapshot.ref.parent.parent);
          // const roomSnapshot = msgSnapshot.ref.parent.parent;
          const roomPath = snapshot.key;
          // console.log(roomSnapshot.child('people').path.getBack());
          const rooms = snapshot.val(); // ==========================================
          // while(!snapshot.people) {
          //   console.log('hello')
          //   continue;
          // }
          const people = personSnapshot.val();
          // console.log(people);
          const roomName = rooms.name;
          // console.log(roomName);
          const message = msgSnapshot.val();
          const user = firebase.auth().currentUser;
          if (user) {
            const personID = user.uid;
            let x;
            // console.log(personID);
            let personPath, prevUnread, lastRead;
            for (var key in people) {
              if (people[key].id === personID) {
                personPath = key;
                prevUnread = people[key].unread;
                lastRead = people[key].lastRead;
              }
              if (people[key].id === message.sender.uid) {
                x = people[key];
              }
            }
            // console.log(roomPath, personPath);
            // dispatch(startLeaveRoom())
            dispatch(sendMessage({
              ...message,
              id: msgSnapshot.key
            }, roomName));

            dispatch(orderRoomsStartState());

            const keyword = message.status && message.text.split(' ').splice(-1,1)[0];


            // console.log(x);
            if(personID !== message.sender.uid) {
              if(keyword === "left") {
                console.log('onleft', message.sender.uid);
                dispatch(onLeft(roomName, message.sender.uid));
              }
  
              if(keyword === "joined") {
                console.log('onjoined');
                dispatch(onJoined(roomName, x));
              }
            }

            

            const time = moment().format();

            // const keyw = message.status && keywords

            if (personID === message.sender.uid && roomName && keyword !== 'left' && personPath) {
                database.ref(`rooms/${roomPath}/people/${personPath}`).update({ unread: 0, lastRead: message.createdAt }).then(() => {
                dispatch(setUnread(roomName, personID, message.createdAt, 0));
              });

            }

            else if (personID !== message.sender.uid && roomName && moment(message.createdAt) > moment(lastRead) && personPath) {
              database.ref(`rooms/${roomPath}/people/${personPath}`).update({ unread: prevUnread + 1, lastRead: message.createdAt }).then(() => {

                // console.log(people);
                // console.log(state.rooms.length);
                dispatch(setUnread(roomName, personID, message.createdAt, prevUnread + 1));
              });
            }

          }

          // }

        });


        // snapshot.ref.child('people').once('child_removed', (peopleSnapshot) => {
        //   const roomName = snapshot.val().name;
        //   // console.log(peopleSnapshot.val());
        //   const user = firebase.auth().currentUser;
        //   if (user) {
        //     const uid = user.uid;
        //   }
        // });
        // snapshot.ref.child('people').once('child_added', (peopleSnapshot) => {
        //   const roomPath = snapshot.key;
        //   // console.log(peopleSnapshot.val());
        //   const user = firebase.auth().currentUser;
        //   if (user) {
        //     const uid = user.uid;
        //     dispatch((roomName, uid));
        //   }
        // });
        // snapshot.ref.child('people').on('child_added', (personSnapshot) => {
        //   // snapshot.ref.child('messages').once('child_added', (msgSnapshot) => {

        // // console.log(msgSnapshot.ref.parent.parent);
        //   // const roomSnapshot = msgSnapshot.ref.parent.parent;
        //   const roomPath = snapshot.key;
        //   // console.log(roomSnapshot.child('people').path.getBack());
        //   const rooms = snapshot.val(); // ==========================================
        //   // while(!snapshot.people) {
        //   //   console.log('hello')
        //   //   continue;
        //   // }
        //   const people = personSnapshot.val();
        //   // console.log(people);
        //   const roomName = rooms.name;
        //   const message = msgSnapshot.val();
        //   const user = firebase.auth().currentUser;
        //   if (user) {
        //     const personID = user.uid;
        //     // console.log(personID);
        //     let personPath, prevUnread;
        //     for (var key in people) {
        //       if (people[key].id === personID) {
        //         personPath = key;
        //         prevUnread = people[key].unread;
        //       }
        //     }
        //     // console.log(roomPath, personPath);

        //     // dispatch(sendMessage({
        //     //   ...message,
        //     //   id: msgSnapshot.key
        //     // }, roomName));

        //     // dispatch(orderRoomsStartState());

        //     // if(roomPath && personPath) {
        //       database.ref(`rooms/${roomPath}/people/${personPath}`).update({ unread: prevUnread + 1 }).then(() => {

        //         console.log(people);
        //         // console.log(state.rooms.length);
        //         // dispatch(startUpdateUnread());
        //       });
        //     // }

        //   }
      });
    });

    // });
  };
};

export const orderRoomsStartState = () => ({
  type: 'ORDER_ROOMS_START_STATE'
});


export const setStartState = () => {
  return (dispatch, getState) => {
    // const state = getState();
    // console.log(state);
    // if(state.rooms.length === 0) {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      let rooms = [];
      // let roomsState = [];
      database.ref('users').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().uid === uid) {
            rooms.push(childSnapshot.val().rooms);
            rooms = rooms[0];
            for (var key in rooms) {
              // console.log(rooms[key]);
              database.ref(`rooms/${rooms[key]}`).once('value', (snapshot) => {
                const room = snapshot.val();
                // roomsState.push(room);
                const { name, people, messages } = room;
                let peopleArray = [], messagesArray = [];
                for (var peopleKey in people) {
                  peopleArray.push(people[peopleKey]);
                }
                for (var messagesKey in messages) {
                  messagesArray.push({ ...messages[messagesKey], id: messagesKey });
                }
                // console.log(messagesArray);
                dispatch(createRoom({
                  id: rooms[key],
                  name,
                  people: peopleArray,
                  messages: messagesArray
                }));


                // console.log(name, peopleArray, messages);
              });
            }
            // console.log(roomsState);
          }
          dispatch(orderRoomsStartState());
        });
      }) //
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
    if (user) {
      const userId = user.uid;
      const displayName = user.displayName;
      const rooms = getState().rooms;
      let roomID, personID, roomPath, userPath;
      rooms.forEach((room) => {
        if (room.name === roomName) {
          roomID = room.id;
        }
      });

      database.ref(`rooms/${roomID}/people`).once('value', (snapshot) => {
        const value = snapshot.val();
        let length = 0;
        for (var key in value) {
          length += 1;
          if (value[key].id === userId) {
            personID = key;
          }
        }
        if (length === 1) {
          database.ref(`rooms/${roomID}`).remove();
        } else {
          database.ref(`rooms/${roomID}/people/${personID}`).remove();
        }
      });

      database.ref(`users`).once('value', (userSnapshot) => {
        const userValue = userSnapshot.val();
        for (var key in userValue) {
          if (userValue[key].uid === userId) {
            userPath = key;
          }
        }
        database.ref(`users/${userPath}/rooms`).once('value', (snapshot) => {
          const value = snapshot.val();
          for (var key in value) {
            if (value[key] === roomID) {
              roomPath = key;
            }
          }
          database.ref(`users/${userPath}/rooms/${roomPath}`).remove(() => {
            dispatch(leaveRoom(roomName, userId));
            const perName = displayName ? displayName : 'Anonymous';
            dispatch(startSendMessage(`${perName} left`, roomName, true));
            history.push('/join');
          });
        });
      });



    }

  };
};

export const clearUnread = (roomName, uid, time, unread) => ({
  type: 'CLEAR_UNREAD',
  roomName,
  uid,
  time,
  unread
});

export const setUnread = (roomName, uid, time, unread) => {
  return (dispatch) => {
    dispatch(clearUnread(roomName, uid, time, unread));
  }
};


export const startClearUnread = (roomPath, roomName) => {
  return (dispatch) => {
    let time = moment().endOf('month');
    const user = firebase.auth().currentUser;
    if (user) {
      const { uid } = user;
      return database.ref(`rooms/${roomPath}/people`).once('value', (snapshot) => {
        // const people = snapshot.val();
        snapshot.forEach((childSnapshot) => {
          const person = childSnapshot.val();
          if (person.id === uid) {
            time = moment().format();
            if(roomPath && person) {
              return database.ref(`rooms/${roomPath}/people/${childSnapshot.key}`).update({
                unread: 0,
                lastRead: time
              }).then(() => {
                dispatch(clearUnread(roomName, uid, time, 0));
              });
            }
            
          }
        });
      });
    }

  };
};

// const updatePeople = () => {
//   return (dispatch) => {

//   }
// }

export const onLeft = (roomName, personID) => ({
  type: 'ON_LEFT',
  roomName,
  personID
});

export const  onJoined = (roomName, person) => ({
  type: 'ON_JOINED',
  roomName,
  person
});


