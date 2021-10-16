import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import logo from '../../assets/images/logo.png';

import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Zoom,
  Modal,
  Backdrop,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Snackbar,
  Grow,
} from '@material-ui/core';
import { formatRawValue } from '../../utils/funcs';

import { Menu as MenuIcon, Close } from '@material-ui/icons';

import { NavLink } from 'react-router-dom';
import { connectTo } from '../../utils/redux';
import { GET_FAVORITE_GAME, CHANGE_GAME_FAVORITE_STATUS, SEARCH_GAMES } from '../../constants/urls';
import { api } from '../../services';
import SnackbarContentWrapper from '../SnackbarContentWrapper';
import { setGameOptions } from '../../store/actions/game';
import Autocomplete from '../AutoComplete';

const initialAlertMessageState = { message: '', variant: 'error', show: false };

function Header({ user, signOut, isAdmin, isMaster }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState(null);
  const [loadedFavoriteGames, setLoadedFavoriteGames] = useState(false);
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const [message, setMessage] = useState(null);
  const [games, setGames] = useState([]);
  const favoriteUpdate = useSelector((state) => state.game.favoriteUpdate);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);

  function handleMessageClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({ ...alertMessage, show: false });
  }

  function showMessage(message, variant) {
    setAlertMessage({ message, show: true, variant });
  }

  function handleProfileMenuOpen(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLeaveClick() {
    handleMenuClose();

    signOut()
      .then(function () {
        dispatch(push('/sign-in'));
      })
      .catch(function (error) {
        console.error('Error on signOut.', error);
      });
  }

  function getGames(searchText) {
    return new Promise((resolve) => {
      api
        .get(`${SEARCH_GAMES}?searchText=${searchText}`)
        .then((response) => response.data)
        .then((result) => {
          resolve(result);
        });
    });
  }

  function handleSearchChange(value, s) {
    console.log(value);

    dispatch(push(value.value));
  }

  async function loadFavoriteGames() {
    const response = await api.get(`${GET_FAVORITE_GAME}?userProviderId=${user.uid}`);

    const data = response.data;

    if (data.success) {
      setFavoriteGames(data.games);
      setMessage(null);
      setLoadedFavoriteGames(true);
    } else {
      setMessage(data.message);
      setFavoriteGames([]);
    }
  }

  function handleModalClose(event, reason) {
    if (reason !== 'backdropClick') {
      setModalOpen(false);
    }
  }

  async function handleRemoveGame(e, gameId) {
    const response = await api.get(`${CHANGE_GAME_FAVORITE_STATUS}?gameId=${gameId}&userProviderId=${user.uid}`);

    const data = response.data;

    if (data.success) {
      let gameIndex = favoriteGames.findIndex((g) => g.GameId === gameId);

      favoriteGames.splice(gameIndex, 1);

      setFavoriteGames([...favoriteGames]);

      showMessage(data.message, 'success');

      console.log(favoriteUpdate);

      dispatch(
        setGameOptions({
          favoriteUpdate: favoriteUpdate ? null : Math.random(),
        })
      );
    } else {
      showMessage(data.message, 'error');
    }
  }

  function handleModalOpen(e) {
    e.stopPropagation();

    setFavoriteGames(null);

    setLoadedFavoriteGames(false);

    setModalOpen(true);

    handleMenuClose();

    loadFavoriteGames();
  }

  function handleGameClick(e, id) {
    e.stopPropagation();

    handleModalClose();

    dispatch(push(`/game/${id}`));
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
      <MenuItem onClick={handleModalOpen}>Favoritos</MenuItem>
      <MenuItem onClick={handleLeaveClick}>Sair</MenuItem>
    </Menu>
  );

  return (
    <>
      <nav className="navbar navbar-expand-md sticky-top menu-background elevation">
        <NavLink className="navbar-brand" to="/" exact>
          <img src={logo} className="img-fluid" width="40" alt="logo" />
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" exact to="/">
                Loja
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" to="/library">
                Biblioteca
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" to="/store/pc">
                PC
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" to="/store/ps4">
                PS4
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" to="/store/xbox">
                Xbox
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="hvr-underline-active" className="nav-link hvr-underline-from-left w-100" to="/suport">
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
          <li className="nav-item mr-2" style={{ width: '200px' }}>
            <Autocomplete
              loadOptions={getGames}
              placeholder="Pesquisar..."
              // LoadingMessage="Carregando"
              NoOptionsMessage="Nada encontrado"
              // components={}

              value={games}
              onChange={handleSearchChange}
            />
          </li>
          <li className="nav-item">
            {user ? (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar src={user.photoURL} />
                </IconButton>
              </>
            ) : (
              <Button onClick={() => dispatch(push('/sign-in'))} variant="text" style={{ color: '#f1f1f1' }}>
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

      <Modal
        aria-labelledby="Chave do jogo"
        aria-describedby="Chave do jogo"
        tabIndex={-1}
        style={{ overflowY: 'scroll' }}
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Zoom in={modalOpen}>
          <Paper className="p-3 mx-auto my-5 w-75">
            <div className="row justify-content-between">
              <Typography component="span" variant="body2" color="textSecondary" className="pl-4 d-flex align-items-center">
                {'Jogos favoritos'}
              </Typography>
              <IconButton onClick={handleModalClose}>
                <Close />
              </IconButton>
            </div>
            {!loadedFavoriteGames && !favoriteGames ? (
              <div className="row d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
                <CircularProgress />
              </div>
            ) : favoriteGames.length ? (
              <div style={{ height: '500px', overflowY: 'auto' }} className="row">
                <List className="w-100">
                  {favoriteGames.map((favorite) => (
                    <Fragment key={favorite.Game.Id}>
                      <ListItem alignItems="flex-start" button onClick={(e) => handleGameClick(e, favorite.Game.Id)}>
                        <ListItemAvatar
                          style={{
                            height: '100px',
                            width: '200px',
                            overflow: 'hidden',
                          }}
                        >
                          <img className="img-fluid" alt="Thumb" src={favorite.Game.ThumbnailLink} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={favorite.Game.Name}
                          className="ml-4"
                          secondary={
                            <>
                              <Typography component="span" variant="body2" className="mr-1" color="textSecondary">
                                Preço:
                              </Typography>
                              <Typography component="span" variant="body2" color="textPrimary">
                                {formatRawValue(favorite.Game.Price.toString(), 'R$')}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction className="mr-3">
                          <Tooltip title="Remover" placement="left">
                            <IconButton onClick={(e) => handleRemoveGame(e, favorite.Game.Id)} edge="end" aria-label="delete">
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider component="li" />
                    </Fragment>
                  ))}
                </List>
              </div>
            ) : (
              <div style={{ height: '500px' }} className="row d-flex justify-content-center align-items-center">
                <Typography component="span" variant="body2" className="d-inline-block" color="textPrimary">
                  {message || 'Você não possui nenhum jogo favoritado! :('}
                </Typography>
              </div>
            )}
          </Paper>
        </Zoom>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={alertMessage.show}
        autoHideDuration={3000}
        onClose={handleMessageClose}
        TransitionComponent={Grow}
      >
        <SnackbarContentWrapper onClose={handleMessageClose} variant={alertMessage.variant} message={alertMessage.message} />
      </Snackbar>
    </>
  );
}

export default connectTo(
  (state) => ({
    user: state.auth.user,
    signOut: state.auth.signOut,
    isAdmin: state.auth.isAdmin,
    isMaster: state.auth.isMaster,
  }),
  {},
  Header
);
