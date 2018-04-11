import React from 'react';
import { connect } from 'react-redux';
import { startSendMessage, startLeaveRoom } from '../actions/rooms';
import Messages from './Messages';
import PeopleModal from './PeopleModal';

// const getMessages = () => {
  
// }

// const onSubmit = (e) => {
//   e.preventDefault();

// }

export class RoomPage extends React.Component {

  state = {
    showModal: false
  }

  roomName = this.props.location.pathname.split('/').slice(-1)[0];

  onSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    
    this.props.startSendMessage(message, this.roomName);
    e.target.reset();
  }

  handleLeaveRoom = () => {
    this.props.startLeaveRoom(this.roomName);
  }

  showPeople = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }


  render() {
    return (
      <div className="box-layout--messages">
        <div className="room-header">
          <button onClick={this.showPeople} className="button--leave-room">View People</button>
          <div className="room-header__title">{this.props.location.pathname.split('/').slice(-1)[0]}</div>
          <button onClick={this.handleLeaveRoom} className="button--leave-room">Leave room</button>
        </div>
        <Messages roomName={this.roomName} />
        <form onSubmit={this.onSubmit} autoComplete="off" id="message-form">
          <input type="text" name="message" className="text-input" placeholder="Send message" autoFocus />
          <button className="login-button">Send</button>
        </form>
        <PeopleModal
          roomName={this.roomName}
          showModal={this.state.showModal}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startSendMessage: (message, roomName) => dispatch(startSendMessage(message, roomName)),
  startLeaveRoom: (roomName) => dispatch(startLeaveRoom(roomName))
});

export default connect(undefined, mapDispatchToProps)(RoomPage);