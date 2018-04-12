import moment from 'moment';

const defaultState = [];

export default (state=defaultState, action) => {
  switch(action.type) {
    case 'CREATE_ROOM':
      return [...state, action.room];
    case 'JOIN_ROOM':
      return state.map((room) => {
        if(room.name === action.roomName) {
          return {
            ...room,
            people: [...room.people, action.person]
          }
        }
        else {
          return room;
        }
      });
    case 'SEND_MESSAGE':
      return state.map((room) => {
        if(room.name === action.roomName) {
          return {
            ...room,
            messages: [...room.messages, action.message]
          }
        }
        else {
          return room;
        }
      });
    // case 'REORDER_ROOMS':
    //   let room;
    //   let rooms = state.filter((r) => {
    //     if(r.name === action.roomName) {
    //       room = r;
    //       return false;
    //     }
    //     else {
    //       return true;
    //     }
    //   });
    //   rooms.unshift(room);
    //   return rooms;
    case 'ORDER_ROOMS_START_STATE':
      //  const x =  action.rooms.sort((a, b) => {
      //   //  console.log('a', a);
      //   //  console.log('b', b);
      //   if(a.messages.length > 0 && b.messages.length > 0) {
      //     console.log(typeof a.messages);
          
      //     return moment(a.messages[a.messages.length-1].createdAt) > moment(b.messages[b.messages.length-1].createdAt) 
      //     // {
      //   //     return -1;
      //   //   } else {
      //   //     return 1;
      //   //   }
      //   // }
      //   // else {
      //   //   return -1;
      //   }
      // });
      // console.log(typeof x)      
      // console.log(x);
      // return x;
      state.sort((a,b) => {
          return moment(a.messages[a.messages.length-1].createdAt) < moment(b.messages[b.messages.length-1].createdAt);
      });
      // console.log(state);
      return state.map((room) => room);

    case 'LEAVE_ROOM':
      return state.filter((room) => {
        return room.name !== action.roomName;
      });
    case 'CLEAR_STATE':
      return [];
    default:
      return state;
  }
};