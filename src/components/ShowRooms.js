import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const returnRooms = (rooms) => {
  console.log(rooms);
  const a = rooms.map((room) => {
    // console.log(room.name);
    return <div key={room.id} className="room-name-wrapper"><NavLink  to={`/room/${room.name}`} activeClassName="room-selected"><div className='room-name'>{room.name}</div></NavLink></div>;
  });
  return a;
}

const ShowRooms = (props) => (
  <div className="container__left">
  <div className="container__left__text">
    {
      returnRooms(props.rooms)
    }
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(ShowRooms);