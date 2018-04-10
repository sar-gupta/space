import React from 'react';
import { connect } from 'react-redux';
import { startSendMessage } from '../actions/rooms';
import Messages from './Messages';

// const getMessages = () => {
  
// }

// const onSubmit = (e) => {
//   e.preventDefault();

// }

export class RoomPage extends React.Component {

  roomName = this.props.location.pathname.split('/').slice(-1)[0];

  onSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    
    this.props.startSendMessage(message, this.roomName);
    e.target.reset();
  }


  render() {
    return (
      <div className="box-layout--messages">
      <Messages roomName={this.roomName} />
            
        <form onSubmit={this.onSubmit} autoComplete="off" id="message-form">
          <input type="text" name="message" className="text-input" placeholder="Send message" />
          <button className="login-button">Send</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startSendMessage: (message, roomName) => dispatch(startSendMessage(message, roomName))
});

export default connect(undefined, mapDispatchToProps)(RoomPage);