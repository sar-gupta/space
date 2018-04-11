import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

const returnUsers = (rooms, roomName) => {
  if(rooms.length > 0) {
    const room = rooms.find((r) => {
      return r.name === roomName;
    });
    return room.people.map((p) => <div key={p.id}>{p.name}</div>);
  }
}

const PeopleModal = (props) => (
  <Modal
    isOpen={props.showModal}
    onRequestClose={props.closeModal}
    contentLabel="People"
    closeTimeoutMS={200}
    className="modal"
  >
  <h3 className="modal__title">People</h3>
  <div className="modal__body">
    {returnUsers(props.rooms, props.roomName)}
  </div>
  
  
  </Modal>
);

const mapStateToProps = (state) => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(PeopleModal);