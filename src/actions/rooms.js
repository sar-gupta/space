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


export const startCreateRoom = (roomper = {}, showCreateError) => {
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
          return database.ref(`rooms/${ref.key}/people/${roomper.people.id}`).set(roomper.people).then(() => {
            database.ref(`users/${roomper.people.id}/rooms/${ref.key}`).set({roomName: room.name});

            dispatch(createRoom({
              id: ref.key,
              ...roomper,
              people: [roomper.people]
            }));
            const perName = roomper.people.name;
            dispatch(startSendMessage(`${perName} created this room`, room.name, true));
            history.push(`/room/${room.name}`);
          });
        });
      } else {
        return showCreateError('Room name not available!');
      }
    });
  };
};

const isAlreadyAdded = (data, id) => {
  for (var key in data) {
    if (data[key].id === id) return true;
  }
  return false;
}

export const startJoinRoom = (data = {}, showJoinError) => {
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
            };
            let people = [];
            let messages = [];
            for (var key in rooms[i].people) {
              people.push({
                id: rooms[i].people[key].id,
                name: rooms[i].people[key].name,
                unread: rooms[i].people[key].unread,
                lastRead: rooms[i].people[key].lastRead
              });
            }
            for (var key in rooms[i].messages) {
              messages.push({
                ...rooms[i].messages[key]
              });
            }
            return database.ref(`rooms/${rooms[i].id}/people/${person.id}`).set(person).then((ref) => {
              database.ref(`users/${person.id}/rooms/${rooms[i].id}`).set({roomName: rooms[i].name});

              dispatch(createRoom({
                people: [...people, person],
                id: rooms[i].id,
                name: rooms[i].name,
                messages
              }));
              const perName = person.name;

              dispatch(startSendMessage(`${perName} joined`, data.roomName, true));

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
    const user = getState().auth;
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
        let rooms = [];
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
    // const state = getState();
    return database.ref('rooms').on('child_added', (snapshot) => {
      // console.log(snapshot.val());

      snapshot.ref.child('messages').on('child_added', (msgSnapshot) => {
        snapshot.ref.child('people').once('value', (personSnapshot) => {

          
          const roomPath = snapshot.key;
          const rooms = snapshot.val();
          
          const people = personSnapshot.val();
          const roomName = rooms.name;
          const message = msgSnapshot.val();
          const personID = getState().auth.uid;
          if (personID) {
            let x;
            let prevUnread, lastRead;
            for (var key in people) {
              if (people[key].id === personID) {
                prevUnread = people[key].unread;
                lastRead = people[key].lastRead;
              }
              if (people[key].id === message.sender.uid) {
                x = people[key];
              }
            }
            
            dispatch(sendMessage({
              ...message,
              id: msgSnapshot.key
            }, roomName));

            dispatch(orderRoomsStartState());

            const keyword = message.status && message.text.split(' ').splice(-1,1)[0];


            if(personID !== message.sender.uid) {
              if(keyword === "left") {
                // console.log('onleft', message.sender.uid);
                dispatch(onLeft(roomName, message.sender.uid));
              }
  
              if(keyword === "joined") {
                // console.log('onjoined');
                dispatch(onJoined(roomName, x));
              }
            }

            const time = moment().format();


            if (personID === message.sender.uid && roomName && keyword !== 'left') {
                database.ref(`rooms/${roomPath}/people/${personID}`).update({ unread: 0, lastRead: message.createdAt }).then(() => {
                dispatch(setUnread(roomName, personID, message.createdAt, 0));
              });
            }

            else if (personID !== message.sender.uid && roomName && moment(message.createdAt) > moment(lastRead)) {
              database.ref(`rooms/${roomPath}/people/${personID}`).update({ unread: prevUnread + 1, lastRead: message.createdAt }).then(() => {

                dispatch(setUnread(roomName, personID, message.createdAt, prevUnread + 1));
              });
            }
          }
        });
      });
    });
  };
};

export const orderRoomsStartState = () => ({
  type: 'ORDER_ROOMS_START_STATE'
});


export const setStartState = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    if (uid) {
      return database.ref(`users/${uid}`).once('value', (snapshot) => {
        if(snapshot.val()) {
        const rooms = snapshot.val().rooms;
        // console.log(rooms);
        
          for(var key in rooms) {
            database.ref(`rooms/${key}`).once('value', (snapshot) => {
              const room = snapshot.val();
              const { name, people, messages } = room;
              let peopleArray = [], messagesArray = [];
              for (var peopleKey in people) {
                peopleArray.push(people[peopleKey]);
              }
              for (var messagesKey in messages) {
                messagesArray.push({ ...messages[messagesKey], id: messagesKey });
              }
              dispatch(createRoom({
                id: key,
                name,
                people: peopleArray,
                messages: messagesArray
              }));
              orderRoomsStartState();                    
            });
          }
          orderRoomsStartState();  
        }
              
      });
    }
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
    const user = getState().auth;
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

      database.ref(`rooms/${roomID}/people/${userId}`).remove();
      database.ref(`users/${userId}/rooms/${roomID}`).remove(() => {
        dispatch(leaveRoom(roomName, userId));
        const perName = displayName;
        dispatch(startSendMessage(`${perName} left`, roomName, true));
        history.push('/join');
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
  return (dispatch, getState) => {
    let time = moment().endOf('month');
    const uid = getState().auth.uid;
    if (uid) {
      time = moment().format();      
      return database.ref(`rooms/${roomPath}/people/${uid}`).update({
        unread: 0,
        lastRead: time
      }).then(() => {
        dispatch(clearUnread(roomName, uid, time, 0));
      });
    }
  };
};

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


