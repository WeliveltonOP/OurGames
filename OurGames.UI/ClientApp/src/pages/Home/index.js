import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import GamesList from '../../components/GamesList';
import Sidebar from '../../components/Sidebar';
import { api } from '../../services';
import {
  GET_GAMES,
  GET_CREATE_EDIT_PAGE_DEFAULT_STATE,
  CHANGE_GAME_FAVORITE_STATUS,
  GET_FAVORITE_GAME
} from '../../constants/urls';
import { Typography, LinearProgress, Grow, Snackbar } from '@material-ui/core';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';

const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function Home({
  match: {
    params: { plataform }
  }
}) {
  const [games, setGames] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState(0);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const user = useSelector(state => state.auth.user);
  const dispactch = useDispatch();

  function handleMessageClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({ ...alertMessage, show: false });
  }

  function showMessage(message, variant) {
    setAlertMessage({ message, show: true, variant });
  }

  const loadGames = useCallback(
    async categoryId => {
      setLoaded(false);

      if (categoryId) {
        setCategorySelected(categoryId);
      } else {
        setCategorySelected(0);
      }

      let favoriteGamesData = {};

      if (user) {
        const favoriteGamesResponse = await api.get(
          `${GET_FAVORITE_GAME}?userProviderId=${user.uid}`
        );

        favoriteGamesData = favoriteGamesResponse.data;

        if (favoriteGamesData.success) {
          setFavoriteGames(favoriteGamesData.games);
        } else {
          showMessage(favoriteGamesData.message, 'error');
        }
      }

      const response = await api.get(
        `${GET_GAMES}?categoryId=${categoryId}&plataform=${plataform || ''}`
      );

      const data = response.data;

      if (data.success) {
        if (favoriteGamesData && favoriteGamesData.success) {
          data.games = data.games.map(g => {
            if (favoriteGamesData.games.some(f => f.GameId == g.id)) {
              g.isFavorite = true;
            } else {
              g.isFavorite = false;
            }
            return g;
          });
        }

        setGames(data.games);
      } else {
        showMessage(data.message, 'error');
      }

      setLoaded(true);
    },
    [plataform, user]
  );

  useEffect(() => {
    loadGames(categorySelected !== 0 ? categorySelected : undefined);
  }, [plataform, loadGames, categorySelected]);

  useEffect(() => {
    loadGames().catch(error => console.error(error));

    async function getCreateEditPageDefaultState() {
      const response = await api.get(GET_CREATE_EDIT_PAGE_DEFAULT_STATE);

      const data = response.data;

      if (data.success) {
        setCategories(data.categories);
      }
    }

    getCreateEditPageDefaultState();
  }, [loadGames]);

  async function onFavorite(id) {
    if (!user) {
      dispactch(push('/sign-in'));

      return;
    }

    const response = await api.get(
      `${CHANGE_GAME_FAVORITE_STATUS}?gameId=${id}&userProviderId=${user.uid}`
    );

    const data = response.data;

    if (data.success) {
      let game = games.find(g => g.id === id);

      game.isFavorite = !game.isFavorite;

      setGames([...games]);

      showMessage(data.message, 'success');
    } else {
      showMessage(data.message, 'error');
    }
  }

  return (
    <>
      {loaded ? (
        <div className="w-100">
          <Sidebar
            onOptionCick={loadGames}
            items={categories}
            selected={categorySelected}
          />

          {games.length > 0 ? (
            <GamesList
              items={games}
              onFavorite={id => onFavorite(id)}
              className="games-list"
            />
          ) : (
            <div className="d-flex h-100 justify-content-center align-content-center">
              <Typography
                className="d-flex align-items-center empty-result"
                component="h6"
                variant="h4"
              >
                {'Está faltando algo por aqui :('}
              </Typography>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <div className="w-100">
            <LinearProgress />
          </div>
        </div>
      )}
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
    </>
  );
}
