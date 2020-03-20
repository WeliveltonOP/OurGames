import React, { useEffect, useState, useCallback } from 'react';
import GamesList from '../../components/GamesList';
import Sidebar from '../../components/Sidebar';
import { api } from '../../services';
import {
  GET_GAMES,
  GET_CREATE_EDIT_PAGE_DEFAULT_STATE
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

      const response = await api.get(
        `${GET_GAMES}?categoryId=${categoryId}&plataform=${plataform || ''}`
      );

      const data = response.data;

      if (data.success) {
        setGames(data.games);
      } else {
        showMessage(data.message, 'error');
      }

      setLoaded(true);
    },
    [plataform]
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
              onFavorite={id => alert(id)}
              className="games-list"
            />
          ) : (
            <div className="d-flex h-100 justify-content-center align-content-center">
              <Typography
                className="d-flex align-items-center"
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
