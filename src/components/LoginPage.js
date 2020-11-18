import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';

export const LoginPage = ({ startLogin }) => {

  let uname = ''
  let passd = ''

  return (<div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title">AKLIO</h1>
      <p>Say hello to fellow developers</p>
      <input type="text" onChange={(e) => {uname = e.target.value}} />
      <input type="text" onChange={(e) => {passd = e.target.value}} />
      <button className="login-button" onClick={()=>{startLogin(uname, passd)}}>Login</button>
    </div>
  </div>)
};

const mapDispatchToProps = (dispatch) => ({
  startLogin: (a, b) => dispatch(startLogin(a, b))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
