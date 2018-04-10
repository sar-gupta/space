import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



const ShowRooms = (props) => (
  <div className="container__left">
  <div className="container__left__text">
    {
      props.rooms.map((room) => {
        return <div key={room.id} className="room-name-wrapper"><Link  to={`/room/${room.name}`}><div className='room-name'>{room.name}</div></Link></div>;
      })
    }
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(ShowRooms);