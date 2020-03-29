import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import OurLogo from '../../assets/images/logo.png';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_OR_UPDATE_USER } from '../../constants/urls';
import { push } from 'connected-react-router';
import { api } from '../../services';

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

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { createUserWithEmailAndPassword } = useSelector(s => s.auth);

  async function submitForm() {
    createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        addOrUpdateUser(user.uid, name, email).then(_ =>
          dispatch(push('/sign-in'))
        );
      })
      .catch(function(error) {
        console.log(error.message);
      });
  }

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

  return (
    <Container
      component="main"
      className="d-flex flex-column m-0"
      maxWidth="xl"
    >
      <CssBaseline />
      <div className="mx-auto">
        <div className={classes.paper}>
          <img src={OurLogo} width="100px" className="img-fluid" alt="logo" />

          <ValidatorForm onSubmit={submitForm} className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextValidator
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  validators={['required']}
                  errorMessages={['Campo obrigatório']}
                  label="Nome"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextValidator
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  validators={['required', 'isEmail']}
                  errorMessages={['Campo obrigatório', 'Email inválido']}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  validators={['required']}
                  errorMessages={['Campo obrigatório']}
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Cadastrar
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Já tem uma conta OurGames? Entrar
                </Link>
              </Grid>
            </Grid>
          </ValidatorForm>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
}
