import React, { useState, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import CurrencyField from '../../components/CurrencyField';
import { api } from '../../services';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import {
  Paper,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Collapse,
  Divider,
  Tooltip,
  Button,
  Snackbar,
  Grow,
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  ListItemSecondaryAction,
  LinearProgress,
} from '@material-ui/core';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Locale from 'date-fns/locale/pt-BR';
import { GET_CREATE_EDIT_PAGE_DEFAULT_STATE, CREATE_GAME, EDIT_GAME, GET_GAME_DATA } from '../../constants/urls';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';
import { Add, Check, Close } from '@material-ui/icons';

const defaultGame = {
  id: 0,
  name: '',
  launchDate: new Date(),
  price: 0,
  developer: '',
  publisher: '',
  plataforms: [],
  categories: [],
  description: '',
  requirements: '',
  rating: '',
  videos: [],
  thumbnail: null,
  backgroundImage: null,
};

const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function CreateAndEditGame({
  match: {
    params: { id },
    url,
  },
}) {
  const [game, setGame] = useState(defaultGame);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [plataformOptions, setPlataformOptions] = useState([]);
  const [descriptionHelperText, setDescriptionHelperText] = useState('0/500');
  const [requirementsHelperText, setRequirementsHelperText] = useState('0/500');
  const [currentLinkVideo, setCurrentLinkVideo] = useState('');
  const [bgFilePreview, setBgFilePreview] = useState(null);
  const [thumbFilePreview, setThumbFilePreview] = useState(null);
  const [showRequirementsField, setShowRequirementsField] = useState(false);
  const [popAnchorEl, setPopAnchorEl] = useState(null);
  const [isCreate, setIsCreate] = useState(true);
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  function handlePopoverOpen(e) {
    setPopAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setCurrentLinkVideo('');
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

  const popOpen = Boolean(popAnchorEl);
  const popId = popOpen ? 'videoPopover' : undefined;

  useEffect(() => {
    async function getCreateEditPageDefaultState() {
      const response = await api.get(GET_CREATE_EDIT_PAGE_DEFAULT_STATE);

      const data = response.data;

      if (data.success) {
        setCategoryOptions(data.categories);
        setPlataformOptions(data.plataforms);
      }
    }

    getCreateEditPageDefaultState();
  }, []);

  useEffect(() => {
    setDescriptionHelperText(`${game.description.length}/500`);
  }, [game.description]);

  useEffect(() => {
    setRequirementsHelperText(`${game.requirements ? game.requirements.length : 0}/500`);
  }, [game.requirements]);

  useEffect(() => {
    if (plataformOptions.length > 0 && game.plataformId === 0) {
      setGame((g) => ({ ...g, plataformId: plataformOptions[0].value }));
    }
  }, [plataformOptions]);

  useEffect(() => {
    if (plataformOptions.length > 0) {
      for (let i = 0; i < game.plataforms.length; i++) {
        const plataformId = game.plataforms[i];

        const plataform = plataformOptions.find((p) => p.value === plataformId);

        if (plataform.label.toLowerCase() === 'pc' || plataform.label.toLowerCase() === 'multiplataforma') {
          setShowRequirementsField(true);
        } else {
          setShowRequirementsField(false);
        }
      }
    }
  }, [game.plataforms, plataformOptions]);

  useEffect(() => {
    if (url.includes('edit') && id && !loaded) {
      setIsCreate(false);

      async function getAndSetGameData(id) {
        const response = await api.get(`${GET_GAME_DATA}?id=${id}`);

        const data = response.data;

        if (data.success) {
          if (data.message) {
            showMessage(data.message, 'success');
          }

          const game = data.game;

          setGame({
            id: game.id,
            categories: game.categories,
            description: game.description,
            developer: game.developer,
            launchDate: new Date(Date.parse(game.launchDate)),
            name: game.name,
            plataforms: game.plataforms,
            price: game.price,
            publisher: game.publisher,
            rating: game.rating,
            requirements: game.requirements,
            videos: game.videos,
          });

          setThumbFilePreview(game.thumbnailLink);

          setBgFilePreview(game.backgroundLink);

          setLoaded(true);
        } else {
          showMessage(data.message, 'error');
        }
      }

      getAndSetGameData(id);
    }
  }, [url, id, loaded]);

  useEffect(() => {
    if (!game.backgroundImage && bgFilePreview !== null && !isCreate) {
      URL.revokeObjectURL(bgFilePreview);

      setBgFilePreview(null);
    } else if (game.backgroundImage) {
      setBgFilePreview(URL.createObjectURL(game.backgroundImage));
    }
  }, [game.backgroundImage, isCreate]);

  useEffect(() => {
    if (!game.thumbnail && thumbFilePreview !== null && !isCreate) {
      URL.revokeObjectURL(thumbFilePreview);

      setThumbFilePreview(null);
    } else if (game.thumbnail) {
      setThumbFilePreview(URL.createObjectURL(game.thumbnail));
    }
  }, [game.thumbnail, isCreate]);

  function AddVideo() {
    setGame({ ...game, videos: [...game.videos, currentLinkVideo] });
    handlePopoverClose();
  }

  function RemoveVideo(index) {
    const newArray = Array.from(game.videos);

    newArray.splice(index, 1);

    setGame({ ...game, videos: newArray });
  }

  function performeClick(id) {
    document.getElementById(id).click();
  }

  async function submitForm() {
    const form = new FormData();

    for (const key in game) {
      if (game.hasOwnProperty(key)) {
        const value = game[key];

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            form.append(`${key}[${i}]`, value[i]);
          }
        } else if (typeof value.getFullYear == 'function') {
          form.append(key, value.toISOString());
        } else {
          form.append(key, value);
        }
      }
    }

    const response = await api.post(isCreate ? CREATE_GAME : EDIT_GAME, form);

    const data = response.data;

    if (data.success) {
      showMessage(data.message, 'success');

      setTimeout(() => dispatch(push('/admin/games')), 800);
    } else {
      showMessage(data.message, 'error');
    }
  }

  return (
    <Paper
      className="w-100 my-4 p-4 h-100 mx-3"
      style={{
        flex: 1,
      }}
    >
      {(loaded || isCreate) && plataformOptions.length > 0 && categoryOptions.length > 0 ? (
        <ValidatorForm onSubmit={submitForm}>
          <div className="row justify-content-center mb-5">
            <Typography variant="h6" component="h6">
              {isCreate ? 'Novo jogo' : 'Edição'}
            </Typography>
          </div>
          <div className="row mb-5">
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <TextField
                id="product-name"
                name="productName"
                className="w-100"
                label="Nome do jogo"
                value={game.name}
                onChange={(e) => setGame({ ...game, name: e.target.value })}
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={Locale}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-lanuch-date"
                  className="w-100 my-0"
                  label="Data de lançamento"
                  value={game.launchDate}
                  onChange={(date) => setGame({ ...game, launchDate: date })}
                  KeyboardButtonProps={{
                    'aria-label': 'Mudar data',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <CurrencyField
                id="price"
                name="price"
                className="w-100"
                label="Preço"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                // unit="R$"
                value={game.price || 0}
                onChange={(raw, display) => {
                  console.log(raw, display);
                  setGame({ ...game, price: raw });
                }}
              />
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <TextField
                id="developer"
                name="developer"
                className="w-100"
                label="Desenvolvedor"
                onChange={(e) => setGame({ ...game, developer: e.target.value })}
                value={game.developer}
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <TextField
                id="publisher"
                name="publisher"
                className="w-100"
                label="Publicador"
                onChange={(e) => setGame({ ...game, publisher: e.target.value })}
                value={game.publisher}
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <FormControl className="w-100">
                <InputLabel id="plataforms-label">Plataforma</InputLabel>
                <Select
                  labelid="plataforms-label"
                  id="plataforms"
                  multiple
                  value={game.plataforms}
                  onChange={(e) => setGame({ ...game, plataforms: e.target.value })}
                  input={<Input id="select-multiple-plataforms" />}
                  renderValue={(selected) => (
                    <div className="d-flex flex-wrap">
                      {selected.map((value) => (
                        <Chip key={value} label={plataformOptions.find((c) => c.value === value).label} className="m-2" />
                      ))}
                    </div>
                  )}
                >
                  {plataformOptions.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <FormControl className="w-100">
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                  labelid="category-label"
                  id="category"
                  multiple
                  value={game.categories}
                  onChange={(e) => setGame({ ...game, categories: e.target.value })}
                  input={<Input id="select-multiple-category" />}
                  renderValue={(selected) => (
                    <div className="d-flex flex-wrap">
                      {selected.map((value) => (
                        <Chip key={value} label={categoryOptions.find((c) => c.value === value).label} className="m-2" />
                      ))}
                    </div>
                  )}
                >
                  {categoryOptions.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <TextField
                id="game-rating"
                name="rating"
                className="w-100"
                label="Classificação"
                value={game.rating}
                onChange={(e) => setGame({ ...game, rating: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
              <TextField
                id="product-description"
                name="description"
                className="w-100"
                label="Descrição"
                value={game.description}
                onChange={(e) =>
                  e.target.value.length <= 500
                    ? setGame({ ...game, description: e.target.value })
                    : setGame({
                        ...game,
                        description: game.description + e.target.value.substring(0, 500 - game.description.length),
                      })
                }
                // rowsMax={10}
                helperText={descriptionHelperText}
                multiline
              />
            </div>
          </div>
          <Collapse in={showRequirementsField}>
            <div className="row mb-5">
              <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                <TextField
                  id="product-requirements"
                  name="requirements"
                  className="w-100"
                  label="Requisitos"
                  value={game.requirements}
                  onChange={(e) =>
                    e.target.value.length <= 500
                      ? setGame({ ...game, requirements: e.target.value })
                      : setGame({
                          ...game,
                          requirements: game.requirements + e.target.value.substring(0, 500 - game.requirements.length),
                        })
                  }
                  // rowsMax={10}
                  helperText={requirementsHelperText}
                  multiline
                />
              </div>
            </div>
          </Collapse>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
              <Typography className="font-weight-bold" variant="body1" component="p">
                Mídias
              </Typography>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-3 mb-3">
              <Typography variant="subtitle1" color="textSecondary" component="strong">
                Capa do jogo
              </Typography>
              <input hidden type="file" id="bg-file" onChange={(e) => setGame({ ...game, backgroundImage: e.target.files[0] })} />
              <Tooltip title="Adicionar imagem" placement="bottom" color="textSecondary">
                <span>
                  <IconButton onClick={(e) => performeClick('bg-file')}>
                    {game.backgroundImage !== null ? <Check color="primary" /> : <Add />}
                  </IconButton>
                </span>
              </Tooltip>
              <div>{bgFilePreview && <img width="200px" className="img-fluid" src={bgFilePreview} alt="bg-preview" />}</div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-3 mb-3">
              <Typography variant="subtitle1" color="textSecondary" component="strong">
                Logo
              </Typography>
              <input hidden type="file" id="thumb-file" onChange={(e) => setGame({ ...game, thumbnail: e.target.files[0] })} />
              <Tooltip title="Adicionar imagem" placement="bottom" color="textSecondary">
                <span>
                  <IconButton onClick={() => performeClick('thumb-file')}>
                    {game.thumbnail !== null ? <Check color="primary" /> : <Add />}
                  </IconButton>
                </span>
              </Tooltip>
              <div>
                {thumbFilePreview && <img width="200px" className="img-fluid" src={thumbFilePreview} alt="thumbnail-preview" />}
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
              <Typography variant="subtitle1" color="textSecondary" component="strong">
                Vídeos do youtube e imagens
              </Typography>
              <Tooltip title="Adicionar link" placement="bottom" color="textSecondary">
                <span>
                  <IconButton onClick={handlePopoverOpen}>
                    <Add />
                  </IconButton>
                </span>
              </Tooltip>
              <List>
                {game.videos.map((e, i) => (
                  <React.Fragment key={i}>
                    {i !== 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemText>{e}</ListItemText>
                      <ListItemSecondaryAction>
                        <Tooltip title="Remover">
                          <IconButton onClick={() => RemoveVideo(i)}>
                            <Close />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 d-flex justify-content-end">
              <Tooltip title="Enviar" placement="top">
                <Button variant="contained" color="primary" type="submit">
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </Tooltip>
            </div>
          </div>
        </ValidatorForm>
      ) : (
        <div className="w-100 justify-content-center align-items-center">
          <LinearProgress />
        </div>
      )}
      <Popover
        id={popId}
        open={popOpen}
        anchorEl={popAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { minWidth: '40%' },
        }}
      >
        <div className="m-3 d-flex flex-column">
          <Typography className="mb-3" variant="body2" component="strong">
            Adicionar novo link
          </Typography>
          <TextField
            value={currentLinkVideo}
            onChange={(e) => setCurrentLinkVideo(e.target.value)}
            className="mb-3"
            label="Link"
            id="videoLink"
            name="videoLink"
            autoFocus
          />
          <Tooltip title="Adionar" placement="bottom">
            <Button variant="contained" onClick={AddVideo}>
              <Add />
            </Button>
          </Tooltip>
        </div>
      </Popover>
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
    </Paper>
  );
}
