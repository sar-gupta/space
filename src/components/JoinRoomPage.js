import React from 'react';
import { connect } from 'react-redux';
import { startCreateRoom, startJoinRoom } from '../actions/rooms';


export class JoinRoomPage extends React.Component {

  state = { 
    error: '',
    joinError: ''
   };

  onCreateRoom = (e) => {
    e.preventDefault();
    const user = this.props.auth;
    const value = e.target.rname.value.trim();
    if(user) {
      const name = user.displayName;
      if(value) {
        this.setState({error: ''});
        const room = {
          name: value,
          people: {
            id: user.uid,
            name,
            unread: 0,
            lastRead: 0
          }
        }
        this.props.startCreateRoom(room, this.showCreateError);
      } else {
        this.setState({error: 'Please enter a valid room name!'});
      }
      
    }
    
  }

  showCreateError = (error) => {
    this.setState({
      error 
    });
  }

  showJoinError = (joinError) => {
    this.setState({
      joinError 
    });
  }

  onJoinRoom = (e) => {
    e.preventDefault();
    const user = this.props.auth;
    const data = {
      roomName: e.target.rname.value,
      id: user.uid,
      name: user.displayName,
      unread: 0
    }
    this.props.startJoinRoom(data, this.showJoinError);
  }

  render() {
    return (
      <div className="box-layout--join">
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Create a room</h1>
          <form onSubmit={this.onCreateRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Create</button>
          {this.state.error && <p className="message__time" style={{color: "black"}}>{this.state.error}</p>}
          </form>
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Join a room</h1>
          <form onSubmit={this.onJoinRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Join</button>
          {this.state.joinError && <p className="message__time" style={{color: "black"}}>{this.state.joinError}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startCreateRoom: (room, showCreateError) => dispatch(startCreateRoom(room, showCreateError)),
  startJoinRoom: (data, showJoinError) => dispatch(startJoinRoom(data, showJoinError))
});

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoomPage);