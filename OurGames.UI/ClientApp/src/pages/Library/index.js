import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Paper
} from '@material-ui/core';
import { VpnKey, SaveAlt } from '@material-ui/icons';

import beyondLogo from '../../assets/images/games/Beyond_Logo-960x384-a2c6b28b3e69ca323c30612098e1d5a8.png';
import mintLogo from '../../assets/images/games/EGS_DEVOLVER_MINIT_IC1_game_logo_white-836x300-b739c4e7e9c9f802bcc400ac58f16c5b.png';
import everythingLogo from '../../assets/images/games/EGS_DavidOReilly_Everything_IC1_WhiteDropShadow-1802x705-42c0173386db45ca262f22df51684c05.png';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  }
}));

export default function Library() {
  const classes = useStyles();

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
          <ListItem alignItems="flex-start" button>
            <ListItemAvatar
              style={{ height: '100px', width: '200px', overflow: 'hidden' }}
            >
              <img className="img-fluid" alt="Thumb" src={beyondLogo} />
            </ListItemAvatar>
            <ListItemText
              primary="Beyond: Two Souls"
              className="ml-4"
              secondary={
                <>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
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
                      25/09/2019 12:44:56
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      R$ 45,99
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      PS4
                    </Typography>
                  </>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Ver chave" placement="left">
                <IconButton edge="end" aria-label="delete">
                  <VpnKey />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start" button>
            <ListItemAvatar
              style={{ height: '100px', width: '200px', overflow: 'hidden' }}
            >
              <img className="img-fluid" alt="Thumb" src={mintLogo} />
            </ListItemAvatar>
            <ListItemText
              primary="Minit"
              className="ml-4"
              secondary={
                <>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
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
                      28/09/2019 12:47:56
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      R$ 14,99
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      PC
                    </Typography>
                  </>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Baixar" placement="left">
                <IconButton edge="end" aria-label="delete">
                  <SaveAlt />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start" button>
            <ListItemAvatar
              style={{ height: '100px', width: '200px', overflow: 'hidden' }}
            >
              <img className="img-fluid" alt="Thumb" src={everythingLogo} />
            </ListItemAvatar>
            <ListItemText
              primary="Everything"
              className="ml-4"
              secondary={
                <>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
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
                      30/09/2019 12:00:54
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      R$ 14,99
                    </Typography>
                  </>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline + ' ml-2'}
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
                      PC
                    </Typography>
                  </>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Baixar" placement="left">
                <IconButton edge="end" aria-label="baixar">
                  <SaveAlt />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}
