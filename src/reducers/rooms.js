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