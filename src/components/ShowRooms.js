import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';



class ShowRooms extends React.Component {

  returnRooms = () => {
    const rooms = this.props.rooms;
    // console.log(rooms);
    if(rooms.length > 0){
      const a = rooms.map((room) => {
        // console.log(room.name);
        return <div key={room.id} className="room-name-wrapper"><NavLink  to={`/room/${room.name}`} activeClassName="room-selected"><div className='room-name'>{room.name}</div></NavLink></div>;
      });
      return a;
    };
    
  }

  render() {
    return (
      <div className="container__left">
      <div className="container__left__text">
        {
          this.returnRooms()
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(ShowRooms);