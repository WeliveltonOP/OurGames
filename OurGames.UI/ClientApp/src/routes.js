import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Home,
  CreateAndEditGame,
  Games,
  SignIn,
  Admins,
  Library,
  SignUp,
  Suport,
  Game
} from './pages';
import Layout from './components/Layout';
import { isLoggedd, isAdmin, isMaster } from './App';
import { Helmet } from 'react-helmet';

//Common Routes
/**
 * /
 * /store/pc
 * /store/ps4
 * /store/xbox
 * /sign-in
 * /sign-up
 * /suport
 * /game/:id
 * /change-password/:id
 */

//Customer Routes
/**
 * /library
 */

//Admin routes
/**
 * /admin/games
 * /admin/games/new
 * /admin/games/edit/:id
 */

//Master routes
/**
 * /master/admins
 */

const renderRoute = (Page, title, withLayout = true) => props =>
  withLayout ? (
    <Layout>
      {title && (
        <Helmet>
          <title>OurGames - {title}</title>
        </Helmet>
      )}
      <Page {...props} />
    </Layout>
  ) : (
    <>
      <Helmet>
        <title>OurGames {title && ` - ${title}`}</title>
      </Helmet>
      <Page {...props} />
    </>
  );

const PrivateRoute = ({ adminOlny, masterOnly, ...props }) => {
  let authorized = true;

  if (!isLoggedd()) {
    authorized = false;
  }

  if (adminOlny && !isAdmin()) {
    authorized = false;
  }

  if (masterOnly && !isMaster()) {
    authorized = false;
  }

  if (isMaster()) {
    authorized = true;
  }

  return authorized ? <Route {...props} /> : <Redirect to="/sign-in" />;
};

const Routes = () => (
  <Switch>
    <Route exact path="/" render={renderRoute(Home, 'loja')} />
    <Route exact path="/store/:plataform" render={renderRoute(Home, 'loja')} />
    <Route
      exact
      path="/sign-in"
      render={renderRoute(SignIn, 'entrar', false)}
    />
    <Route
      exact
      path="/sign-up"
      render={renderRoute(SignUp, 'cadastrar-se', false)}
    />
    <Route exact path="/suport" render={renderRoute(Suport, 'suporte')} />
    <Route exact path="/game/:id" render={renderRoute(Game, null)} />
    <PrivateRoute
      exact
      path="/library"
      render={renderRoute(Library, 'biblioteca')}
    />

    {/*ADMIN PAGES*/}
    <PrivateRoute
      exact
      adminOlny
      path="/admin/games"
      render={renderRoute(Games, 'jogos')}
    />
    <PrivateRoute
      exact
      adminOlny
      path="/admin/games/new"
      render={renderRoute(CreateAndEditGame, 'novo jogo')}
    />
    <PrivateRoute
      exact
      adminOlny
      path="/admin/games/edit/:id"
      render={renderRoute(CreateAndEditGame, 'editar jogo')}
    />

    {/* MASTER PAGES */}
    <PrivateRoute
      exact
      masterOnly
      path="/master/admins"
      render={renderRoute(Admins, 'admins')}
    />
    <Route
      render={function() {
        return <h1>Not Found</h1>;
      }}
    />
  </Switch>
);

export default Routes;
