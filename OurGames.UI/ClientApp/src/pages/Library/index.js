import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  Snackbar,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Typography,
  LinearProgress,
  Zoom,
  Modal,
  Backdrop,
  Grow,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Paper,
} from '@material-ui/core';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';
import { formatRawValue } from '../../utils/funcs';
import { push } from 'connected-react-router';

import { useSelector, useDispatch } from 'react-redux';
import { VpnKey, SaveAlt, Close } from '@material-ui/icons';

import { api } from '../../services';
import { GET_ORDERS } from '../../constants/urls';
import format from 'date-fns/format';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function Library() {
  const [orders, setOrders] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const user = useSelector((state) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    async function getOrders() {
      const response = await api.get(`${GET_ORDERS}?uid=${user.uid}`);

      const data = response.data;

      if (data.success) {
        setOrders(data.orders);
      } else {
        showMessage(data.message, 'error');
      }
      setLoaded(true);
    }

    getOrders();
  }, []);

  function handleMessageClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({ ...alertMessage, show: false });
  }

  function showMessage(message, variant) {
    setAlertMessage({ message, show: true, variant });
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  function handleModalOpen(e, key) {
    e.stopPropagation();

    setCurrentKey(key);

    setModalOpen(true);
  }

  return (
    <div className="card-container px-3">
      <Paper className="w-100 d-flex flex-column justify-content-center">
        <Typography
          className="align-self-center font-weight-bold"
          component="h1"
          variant="h6"
        >
          Seus jogos
        </Typography>
        <Divider />
        <List className={classes.root}>
          {loaded && orders.length ? (
            orders.map((order) => (
              <Fragment key={order.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => dispatch(push(`/game/${order.gameId}`))}
                >
                  <ListItemAvatar
                    style={{
                      height: '100px',
                      width: '200px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      className="img-fluid"
                      alt="Thumb"
                      src={order.thumbnailLink}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={order.Name}
                    className="ml-4"
                    secondary={
                      <>
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline + ' mr-1'}
                            color="textSecondary"
                          >
                            Data da compra:
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {format(
                              new Date(Date.parse(order.orderDate)),
                              'dd/MM/yyyy HH:mm:ss'
                            )}
                          </Typography>
                        </>
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline + ' ml-2 mx-1'}
                            color="textSecondary"
                          >
                            Preço:
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {formatRawValue(
                              order.value.toString().replace(/\D+/g, ''),
                              'R$'
                            )}
                            {/* R$ 45,99 */}
                          </Typography>
                        </>
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline + ' ml-2 mx-1'}
                            color="textSecondary"
                          >
                            Plataforma:
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {order.plataform.name}
                          </Typography>
                        </>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Baixar" placement="left">
                      {order.plataform.id === 1 ? (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(order.gameKey, '_blank');
                          }}
                          edge="end"
                          aria-label="delete"
                        >
                          <SaveAlt />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={(e) => handleModalOpen(e, order.gameKey)}
                          edge="end"
                          aria-label="delete"
                        >
                          <VpnKey />
                        </IconButton>
                      )}
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </Fragment>
            ))
          ) : !loaded ? (
            <LinearProgress />
          ) : (
            <div className="row w-100 justify-content-center">
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {'Você ainda não possui nenhum jogo! :('}
              </Typography>
            </div>
          )}
        </List>
      </Paper>
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
        <SnackbarContentWrapper
          onClose={handleMessageClose}
          variant={alertMessage.variant}
          message={alertMessage.message}
        />
      </Snackbar>

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
        disableBackdropClick={true}
      >
        <Zoom in={modalOpen}>
          <Paper className="p-3 mx-auto my-5 w-75">
            <div className="row justify-content-end">
              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
                className="d-flex align-items-center"
              >
                {'copie a chave'}
              </Typography>
              <IconButton onClick={handleModalClose}>
                <Close />
              </IconButton>
            </div>
            <div className="row p-4 ">
              <Typography component="span" variant="body2" color="textPrimary">
                {currentKey}
              </Typography>
            </div>
          </Paper>
        </Zoom>
      </Modal>
    </div>
  );
}
