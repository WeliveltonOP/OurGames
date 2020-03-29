import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Divider,
  Button,
  LinearProgress,
  Snackbar,
  Grow
} from '@material-ui/core';
import Carousel from '../../components/Carousel';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { GET_GAME_DATA, CHECKOUT } from '../../constants/urls';
import { api } from '../../services';
import { formatRawValue } from '../../utils/funcs';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';
import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { ArrowBackIos } from '@material-ui/icons';
import { Fragment } from 'react';

const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function Game({
  match: {
    params: { id }
  }
}) {
  const dispatch = useDispatch();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const { user } = useSelector(s => s.auth);

  const getAndSetGameData = useCallback(async id => {
    const response = await api.get(`${GET_GAME_DATA}?id=${id}`);

    const data = response.data;

    if (data.success) {
      const game = data.game;

      setGame({
        id: game.id,
        categories: game.categoriesView,
        description: game.description,
        developer: game.developer,
        launchDate: new Date(Date.parse(game.launchDate)),
        name: game.name,
        plataforms: game.plataformsView,
        price: game.price,
        publisher: game.publisher,
        rating: game.rating,
        requirements: game.requirements,
        videos: game.videos
      });
    } else {
      showMessage(data.message, 'error');

      setError(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getAndSetGameData(id);
    } else {
      dispatch(push('/'));
    }
  }, [dispatch, id]);

  async function Checkout() {
    if (!user) {
      dispatch(push('/sign-in'));
      return;
    }

    const response = await api.get(`${CHECKOUT}?gameId=${id}&uid=${user.uid}`);

    const data = response.data;

    if (data.success) {
      window.open(data.redirectUrl, '_blank');
    } else {
      showMessage(data.message, 'error');
    }
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

  return (
    <div className="w-100 my-3 p-3 justify-content-center d-flex flex-column">
      {game ? (
        <>
          <Helmet>
            <title>{`OurGames - ${game.name}`}</title>
          </Helmet>

          <div className="mx-5 px-3">
            <Button onClick={() => dispatch(push('/'))} className="back-button">
              <ArrowBackIos fontSize="small" htmlColor="#666" />
              <Typography variant="overline" className="pt-1 back-button-text">
                Voltar
              </Typography>
            </Button>
          </div>

          <Divider className="mb-2" />

          <Carousel items={game.videos.map(v => ({ type: 'video', src: v }))} />

          <Divider className="my-4" />

          <div className="game-details">
            <div className="row justify-content-center">
              <div className="col-10 px-2">
                <Typography variant="h4" component="h2">
                  {game.name}
                </Typography>
              </div>
            </div>

            <div className="row justify-content-center mb-2 mt-4">
              <div className="col-10 px-2">
                <Typography variant="subtitle1" component="h4">
                  Descrição
                </Typography>
              </div>
            </div>
            <div className="row justify-content-center my-2">
              <div className="col-10 px-2">
                <Typography variant="caption" component="span">
                  {game.description}
                </Typography>
              </div>
            </div>

            <div className="row justify-content-center my-2">
              <div className="col-3 px-2">
                <Typography variant="subtitle1" component="h4">
                  Categorias
                </Typography>
                <Typography variant="caption" component="span">
                  {game.categories.join('/')}
                </Typography>
              </div>
              <div className="col-4 px-2">
                <Typography variant="subtitle1" component="h4">
                  Desenvolvedor
                </Typography>
                <Typography variant="caption" component="span">
                  {game.developer}
                </Typography>
              </div>
              <div className="col-3 px-2">
                <Typography variant="subtitle1" component="h4">
                  Publicador
                </Typography>
                <Typography variant="caption" component="span">
                  {game.publisher}
                </Typography>
              </div>
            </div>

            <div className="row justify-content-center mt-2 mb-5">
              <div className="col-3 px-2">
                <Typography variant="subtitle1" component="h4">
                  Plataformas
                </Typography>
                <Typography variant="caption" component="span">
                  {game.plataforms.map(p => p.toUpperCase()).join('/')}
                </Typography>
              </div>
              <div className="col-4 px-2">
                <Typography variant="subtitle1" component="h4">
                  Classificação
                </Typography>
                <Typography variant="caption" component="span">
                  {game.rating}
                </Typography>
              </div>
              <div className="col-3 px-2">
                <Typography variant="subtitle1" component="h4">
                  Data de lançamento
                </Typography>
                <Typography variant="caption" component="span">
                  {format(game.launchDate, "dd 'de' MMM 'de' yyyy", {
                    locale: ptBr
                  })}
                </Typography>
              </div>
            </div>

            {game.plataforms.map(p => p.toLowerCase()).includes('pc') && (
              <div className="row justify-content-center mt-2 mb-5">
                <div className="col-10 px-2">
                  <Typography variant="subtitle1" component="h4">
                    Requisitos
                  </Typography>
                  <Typography variant="caption" component="span">
                    {game.requirements.split('\n').map((r, i) => (
                      <Fragment key={i}>
                        {r}
                        <br />
                      </Fragment>
                    ))}
                  </Typography>
                </div>
              </div>
            )}
          </div>

          <div
            className="row justify-content-center position-sticky buy-game-container"
            style={{ bottom: '10px' }}
          >
            <div className="col-12 justify-content-center d-flex align-items-center">
              <Typography variant="h6" component="h6" className="mr-2">
                {formatRawValue(game.price, 'R$')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={Checkout}
                className="btn-buy-game"
              >
                COMPRAR AGORA
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-100 align-self-center">
          {error ? (
            <Typography
              className="empty-result"
              component="h6"
              variant="h4"
              className="text-center"
            >
              {
                'Está faltando algo por aqui, tente atualizar a página ou volte mais tarde :('
              }
            </Typography>
          ) : (
            <LinearProgress />
          )}
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
    </div>
  );
}
