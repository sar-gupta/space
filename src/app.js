import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import { login, logout } from './actions/auth';
import { sendMessage } from './actions/rooms';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import database, { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import { setStartState, clearState } from './actions/rooms';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;

// store.dispatch(startListening());

const renderApp = () => {
  if (!hasRendered) {
    // store.dispatch(setStartState());
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log(user)
    const name = user.displayName ? user.displayName : user.email;    
    store.dispatch(login(user.uid, name));
    store.dispatch(setStartState());    
    renderApp();
    if (history.location.pathname === '/') {
      history.push('/join');
    }
  } else {
    store.dispatch(logout());
    store.dispatch(clearState);
    renderApp();
    history.push('/');
  }
});

