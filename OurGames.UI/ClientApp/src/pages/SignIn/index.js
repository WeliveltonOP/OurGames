import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  Snackbar,
  Grow,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Popover,
  Tooltip
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import OurLogo from '../../assets/images/logo-preto.png';
import {
  FacebookLoginButton,
  GoogleLoginButton
} from 'react-social-login-buttons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        OurGames
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//https://cdn3.f-cdn.com/contestentries/1489974/18545046/5cba2aba229c4_thumb900.jpg
//https://www.geeksnews.com.mx/wp-content/uploads/2019/07/wp22761521.jpg
//https://wallpaperaccess.com/full/280232.jpg

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: `url(https://wallpaperaccess.com/full/280232.jpg)`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));
const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [popAnchorEl, setPopAnchorEl] = useState(null);

  const {
    signInWithFacebook,
    signInWithGoogle,
    signInWithEmailAndPassword,
    fauth
  } = useSelector(v => v.auth);

  function handlePopoverOpen(e) {
    setPopAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setPopAnchorEl(null);
  }

  function handleMessageClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({ ...alertMessage, show: false });
  }

  function showMessage(message, variant) {
    setAlertMessage({ message, show: true, variant });
  }

  function login() {
    signInWithEmailAndPassword(email, password)
      // .then()
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        showMessage(`${errorCode} - ${errorMessage}`, 'error');
      });
  }

  async function forgotPassword() {
    fauth
      .sendPasswordResetEmail(recoverEmail)
      .then(_ => {
        showMessage(
          'Um email de recuperação foi enviado para ' + recoverEmail,
          'success'
        );
        handlePopoverClose();
        setRecoverEmail('');
      })
      .catch(function(error) {
        showMessage(error.message, 'error');
      });
  }
  const popOpen = Boolean(popAnchorEl);
  const popId = popOpen ? 'forgot-pwd-popover' : undefined;

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            OurGames
          </Typography> */}
          <img src={OurLogo} width="100px" className="img-fluid" alt="logo" />
          <ValidatorForm onSubmit={login} className={classes.form}>
            <TextValidator
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              validators={['required', 'isEmail']}
              errorMessages={['Este campo é obrigatório.', 'Email inválido']}
              autoComplete="email"
              autoFocus
            />
            <TextValidator
              margin="normal"
              fullWidth
              name="password"
              label="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              validators={['required']}
              errorMessages={['Este campo é obrigatório.']}
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entrar
            </Button>
          </ValidatorForm>

          <Grid container className="pl-1">
            <Grid item xs>
              <Typography
                className="link-text"
                variant="body2"
                color="primary"
                component="a"
                onClick={handlePopoverOpen}
              >
                Esqueceu a senha?
              </Typography>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {'Ainda não tem conta? Cadastre-se'}
              </Link>
            </Grid>
          </Grid>
          <Grid container className="mt-3">
            <Grid item xs>
              <GoogleLoginButton
                text="Entrar com Google"
                onClick={signInWithGoogle}
              />
            </Grid>
            <Grid item>
              <FacebookLoginButton
                text="Entrar com Facebook"
                onClick={signInWithFacebook}
              />
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={alertMessage.show}
        autoHideDuration={3000}
        onClose={handleMessageClose}
        TransitionComponent={Grow}
      >
        <SnackbarContentWrapper
          onClose={handleMessageClose}
          variant={alertMessage.variant}
          message={alertMessage.message}
        />
      </Snackbar>
      <Popover
        id={popId}
        open={popOpen}
        anchorEl={popAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        PaperProps={{
          style: { minWidth: '40%' }
        }}
      >
        <ValidatorForm onSubmit={forgotPassword}>
          <div className="m-3 d-flex flex-column">
            <Typography className="mb-3" variant="body2" component="strong">
              Recuperar senha
            </Typography>
            <TextValidator
              value={recoverEmail}
              onChange={e => setRecoverEmail(e.target.value)}
              className="mb-3"
              label="Email*"
              id="recoverEmail"
              name="recoverEmail"
              autoComplete="email"
              autoFocus
              helperText="Será enviado o link de redefinição de senha para este email"
              validators={['required', 'isEmail']}
              errorMessages={['Campo obrigatório', 'Email inválido']}
            />
            <Tooltip title="Enviar" placement="bottom">
              <Button variant="contained" type="submit">
                <i className="fas fa-paper-plane font-size-18"></i>
              </Button>
            </Tooltip>
          </div>
        </ValidatorForm>
      </Popover>
    </Grid>
  );
}
