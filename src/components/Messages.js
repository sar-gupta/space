import React from 'react';
import { connect } from 'react-redux';
import selectMessages from '../selectors/messages';
import moment from 'moment';

class Messages extends React.Component {


  // scrollToBottom = () => {
  //   this.messagesEnd.scrollIntoView({ behavior: "instant" });
  // }
  
  // componentDidMount() {
  //   this.scrollToBottom();
  // }
  
  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }

  displayMessages = (messages) => {
    if (typeof messages === 'string') {
      return <li>{messages}</li>;
    }
    let a = [];
    for (var key in messages) {
      const name = <p className="message__name">{messages[key].sender.displayName}</p>;
      const time = <p className="message__time">{moment(messages[key].createdAt).format('h:mm:ss a, MMMM Do YYYY, dddd')}</p>;
      const text = <p className="message__text">{messages[key].text}</p>;
      a.push(<li className="message">{name}{time}{text}</li>);
    }
    return a;
  }

  render() {
    return (
      <div className="messages-box">
        <ul>{
          this.displayMessages(this.props.messages)
        // <li><div style={{ zIndex: -10, height: 0, lineHeight:0, overflow: "none", display: "block", float: "right" }} ref={(el) => { this.messagesEnd = el; }}></div></li>
        }
        </ul> 
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  messages: selectMessages(state.rooms, props.roomName)
});

export default connect(mapStateToProps)(Messages);