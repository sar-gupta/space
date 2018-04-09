import React from 'react';
import { firebase } from '../firebase/firebase';
import { connect } from 'react-redux';
import { startCreateRoom, startJoinRoom } from '../actions/rooms';


export class JoinRoomPage extends React.Component {
  onCreateRoom = (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    if(user) {
      const room = {
        name: e.target.rname.value,
        people: {
          id: user.uid,
          name: user.displayName
        }
      }
      this.props.startCreateRoom(room);
    }
    
  }

  onJoinRoom = (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const data = {
      roomName: e.target.rname.value,
      id: user.uid,
      name: user.displayName
    }
    this.props.startJoinRoom(data);
  }

  render() {
    return (
      <div className="box-layout--join">
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Create a room</h1>
          <form onSubmit={this.onCreateRoom}>
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Create</button>
          </form>
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Join a room</h1>
          <form onSubmit={this.onJoinRoom}>
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Join</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startCreateRoom: (room) => dispatch(startCreateRoom(room)),
  startJoinRoom: (data) => dispatch(startJoinRoom(data))
});

export default connect(undefined, mapDispatchToProps)(JoinRoomPage);