import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import logo from '../../assets/images/logo.png';

import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  Avatar
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import { NavLink } from 'react-router-dom';
import { connectTo } from '../../utils/redux';

function Header({ user, signOut, isAdmin, isMaster }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  function handleProfileMenuOpen(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLeaveClick() {
    //TODO: Cancel use session

    handleMenuClose();

    signOut()
      .then(function() {
        dispatch(push('/sign-in'));
      })
      .catch(function(error) {
        console.error('Error on signOut.', error);
      });
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className="w-100"
    >
      {/* <MenuItem onClick={handleMenuClose}>Perfil</MenuItem> */}
      <MenuItem onClick={handleMenuClose}>Favoritos</MenuItem>
      <MenuItem onClick={handleLeaveClick}>Sair</MenuItem>
    </Menu>
  );

  return (
    <nav className="navbar navbar-expand-md sticky-top menu-background elevation">
      <NavLink className="navbar-brand" to="/" exact>
        <img src={logo} className="img-fluid" width="40" alt="logo" />
      </NavLink>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              exact
              to="/"
            >
              Loja
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              to="/library"
            >
              Biblioteca
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              to="/store/pc"
            >
              PC
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              to="/store/ps4"
            >
              PS4
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              to="/store/xbox"
            >
              Xbox
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="hvr-underline-active"
              className="nav-link hvr-underline-from-left w-100"
              to="/suport"
            >
              Suporte
            </NavLink>
          </li>
          {(isAdmin || isMaster) && (
            <>
              <Divider
                style={{ backgroundColor: '#f1f1f1', height: 'auto' }}
                className="mx-3 nav-item"
                component="li"
                orientation="vertical"
              />
              <li className="nav-item">
                <NavLink
                  activeClassName="hvr-underline-active"
                  className="nav-link hvr-underline-from-left w-100"
                  exact
                  to="/admin/games"
                >
                  Jogos
                </NavLink>
              </li>
            </>
          )}
          {isMaster && (
            <li className="nav-item">
              <NavLink
                activeClassName="hvr-underline-active"
                className="nav-link hvr-underline-from-left w-100"
                to="/master/admins"
              >
                Admins
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <ul className="menu-right-actions ml-auto d-flex align-items-center">
        {/* <li className="nav-item mr-2">
          <TextField
            label="Pesquisa"
            variant="outlined"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
            name="Search"
            color="secondary"
            id="search"
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.5)' }
            }}
            InputProps={{
              style: { color: 'rgba(255, 255, 255, 0.5)' },
              classes: {
                //root: classes.cssOutlinedInput,
                // focused: classes.cssFocused,
                notchedOutline: 'textPrimary'
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </li> */}
        <li className="nav-item">
          {user ? (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={user.photoURL} />
              {/*) : (<AccountCircle fontSize="large" style={{ color: '#f1f1f1' }} /> )*/}
            </IconButton>
          ) : (
            <Button
              onClick={() => dispatch(push('/sign-in'))}
              variant="text"
              style={{ color: '#f1f1f1' }}
            >
              LOGIN
            </Button>
          )}
        </li>
        <li className="nav-item">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Alterna navegação"
          >
            <MenuIcon style={{ color: '#fff' }} />
          </button>
        </li>
      </ul>

      {renderMenu}
    </nav>
  );
}

export default connectTo(
  state => ({
    user: state.auth.user,
    signOut: state.auth.signOut,
    isAdmin: state.auth.isAdmin,
    isMaster: state.auth.isMaster
  }),
  {},
  Header
);
