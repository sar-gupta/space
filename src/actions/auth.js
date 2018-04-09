import database, { firebase, githubAuthProvider as provider } from '../firebase/firebase';

export const login = (uid) => ({
  type: 'LOGIN',
  uid
});

export const startLogin = () => {
  return () => {
    // return firebase.auth().signInWithPopup(googleAuthProvider);
    return firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      database.ref('users').once('value', (snapshot) => {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          users.push({
            ...childSnapshot.val()
          });
        });
        if(!users.find((u) => u.uid === user.uid)) {
          database.ref('users').push({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            rooms: [],
            token
          });
        }
      });
      
      
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  };
};

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
