import React, { useEffect, useState } from 'react';
import Routes from './routes';
import { ConnectedRouter, push } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from './store';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
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
import { CssBaseline } from '@material-ui/core';
import { takeIfExists } from './utils/localStorage';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

const history = createBrowserHistory({ basename: baseUrl });

const store = configureStore(history);

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider()
};

const theme = createMuiTheme({
  palette: {
    primary: { main: '#939ADB' },
    type: takeIfExists('theme') || 'dark'
  }
});

function App(props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function firebaseAuthState() {
      setLoaded(true);

      if (props.user) {
        await addOrUpdateUser(
          props.user.uid,
          props.user.displayName,
          props.user.email
        );

        const id = await getAccess(props.user.uid);

        store.dispatch(setAccess(id));

        // Saporra não pode ficar aqui
        store.dispatch(push('/'));
      }
    }

    store.dispatch(
      setFirebaseOptions({
        ...props,
        fauth: firebaseAppAuth
      })
    );

    store.dispatch(setUser(props.user));

    firebaseAuthState();
  }, [props]);

  async function addOrUpdateUser(uid, name, email) {
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

  async function getAccess(uid) {
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

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConnectedRouter history={history}>
          {loaded ? (
            <Routes />
          ) : (
            <div className="sc-center ">
              <progress className="pure-material-progress-circular"></progress>
            </div>
          )}
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
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
