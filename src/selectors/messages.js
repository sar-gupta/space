export default (rooms, roomName) => {
  const a =  rooms.filter((room) => room.name === roomName)[0];
  const b = a ? a.messages : "Loading...";
  // console.log(a);
  return b;
}