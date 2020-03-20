import React, { Component } from 'react';
import Routes from './routes';
import { ConnectedRouter, push } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from './store';
// import { ThemeProvider } from '@material-ui/styles';
// import { createMuiTheme } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/app.css';
import 'bootstrap/dist/js/bootstrap';
import withFirebaseAuth from 'react-with-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './constants/firebase-config';
import { setUser, setFirebaseOptions, setAccess } from './store/actions/auth';
import { api } from './services';
import { ADD_OR_UPDATE_USER, GET_ACCESS } from './constants/urls';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

const history = createBrowserHistory({ basename: baseUrl });

const store = configureStore(history);

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider()
};

class App extends Component {
  constructor(props) {
    super(props);

    store.dispatch(
      setFirebaseOptions({
        ...props,
        fauth: firebaseAppAuth
      })
    );

    const self = this;

    firebaseAppAuth.onAuthStateChanged(function(user) {
      store.dispatch(setUser(user));

      if (user) {
        self
          .addOrUpdateUser(user.uid, user.displayName, user.email)
          .then(_ =>
            self.getAccess(user.uid).then(id => store.dispatch(setAccess(id)))
          );

        store.dispatch(push('/'));
        // firebaseAppAuth.currentUser.getIdToken().then(t => configureAxios(t));
      }
    });
  }

  async addOrUpdateUser(uid, name, email) {
    var form = new FormData();

    form.append('uid', uid);

    form.append('name', name);

    if (email) {
      form.append('email', email);
    }

    const response = await api.post(ADD_OR_UPDATE_USER, form);

    const data = response.data;

    if (!data.success) {
      console.error(data.message);
    }
  }

  async getAccess(uid) {
    const response = await api.get(`${GET_ACCESS}?uid=${uid}`);

    const data = response.data;

    if (!data.success) {
      console.error(data.message);
    }

    if (data.access) {
      return parseInt(data.access);
    }

    return 1;
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);

export function isLoggedd() {
  if (firebaseAppAuth.currentUser) {
    return true;
  }
  return false;
}

export function isAdmin() {
  return store.getState().auth.isAdmin;
}

export function isMaster() {
  return store.getState().auth.isMaster;
}

// function configureAxios(accessToken) {
//   console.log(accessToken);
//   Axios.interceptors.request.use(
//     async config => {
//       let serverCallUrl = new URL(config.url);

//       if (serverCallUrl.pathname.includes('/sign')) return config;

//       if (accessToken) {
//         config.headers['authorization'] = `Bearer ${accessToken}`;
//         config.headers['cache-control'] = `no-cache`;
//       }

//       return config;
//       // or throw new Error('User required')
//     },
//     // I don't think this function is required
//     function(error) {
//       return Promise.reject(error);
//     }
//   );
// }
