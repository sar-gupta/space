import React from 'react';
import { connect } from 'react-redux';
import selectMessages from '../selectors/messages';
import moment from 'moment';

class Messages extends React.Component {


  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  }
  
  componentDidMount() {
    this.scrollToBottom(false);
  }
  
  componentDidUpdate() {
    this.scrollToBottom({block: 'end', behavior: "smooth"});
  }

  displayMessages = (messages) => {
    if (typeof messages === 'string') {
      return <li className="message__time">{messages}</li>;
    }
    let a = [],  prevSender;
    // console.log(messages);
    messages.forEach((message) => {
      const name = <p className="message__name">{message.sender.displayName}</p>;
      const time = <p className="message__time">{moment(message.createdAt).format('h:mm:ss a, MMMM Do YYYY, dddd')}</p>;
      const text = <p className="message__text">{message.text}</p>;
      // console.log(prevSender, messages[key].sender.displayName)
      if(message.status) {
        a.push(<li key={message.id} className="message-with-status">{text}{time}</li>);
        prevSender = null;
      }

       else if(prevSender === message.sender.uid) {
        a.push(<li key={message.id} className="message">{time}{text}</li>);
      }
      else {
        prevSender = message.sender.uid;
        a.push(<li key={message.id} className="message">{name}{time}{text}</li>);
      }
    }); 
    // a.push(<li key="" tabIndex="1"></li>);
    return a;
  }

  render() {
    return (
      <div className="messages-box">
        <ul>
        {
          this.displayMessages(this.props.messages)
        }
        <li ref={(el) => { this.messagesEnd = el; }}></li>
        </ul> 
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  messages: selectMessages(state.rooms, props.roomName)
});

export default connect(mapStateToProps)(Messages);