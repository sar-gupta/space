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
    for (var key in messages) {
      const name = <p className="message__name">{messages[key].sender.displayName ? messages[key].sender.displayName : 'Anonymous'}</p>;
      const time = <p className="message__time">{moment(messages[key].createdAt).format('h:mm:ss a, MMMM Do YYYY, dddd')}</p>;
      const text = <p className="message__text">{messages[key].text}</p>;
      // console.log(prevSender, messages[key].sender.displayName)
      if(messages[key].status) {
        a.push(<li key={messages[key].id} className="message-with-status">{text}{time}</li>);
        prevSender = null;
        continue;
      }

      if(prevSender === messages[key].sender.uid) {
        a.push(<li key={messages[key].id} className="message">{time}{text}</li>);
      }
      else {
        prevSender = messages[key].sender.uid;
        a.push(<li key={messages[key].id} className="message">{name}{time}{text}</li>);
      }
    }
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