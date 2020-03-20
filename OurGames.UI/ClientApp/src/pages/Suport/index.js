import React, { useState, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Divider,
  Tooltip,
  Button,
  LinearProgress,
  Snackbar,
  Zoom
} from '@material-ui/core';
import { api } from '../../services';
import { SUPORT_EMAIL } from '../../constants/urls';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';

const initialAlertState = { message: '', variant: 'error', show: false };

export default function Suport() {
  const [category, setCategory] = useState('Dúvida');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('0/500');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(initialAlertState);

  function handleDescriptionChange(e) {
    return e.target.value.length <= 500
      ? setDescription(e.target.value)
      : setDescription(
          description + e.target.value.substring(0, 500 - description.length)
        );
  }

  async function submitForm() {
    setIsLoading(true);
    const form = new FormData();

    form.append('Category', category);
    form.append('Email', email);
    form.append('BodyText', description);

    const response = await api.post(SUPORT_EMAIL, form);

    const data = response.data;

    let variant = 'error';

    if (data.success) {
      variant = 'success';

      setEmail('');
      setDescription('');
    }

    setAlertMessage({ message: data.message, variant, show: true });

    setIsLoading(false);
  }

  function handleMessageClose() {
    setAlertMessage({ ...alertMessage, message: '', show: false });
  }

  useEffect(() => {
    setDescriptionHelperText(`${description.length}/500`);
  }, [description]);

  return (
    <>
      <div className="card-container">
        <Paper square className="w-100 pt-3">
          <ValidatorForm onSubmit={submitForm}>
            <div className="row px-3">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Typography style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                  Categoria:
                </Typography>
              </div>
            </div>
            <div className="row px-3">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <FormControl component="fieldset">
                  <RadioGroup
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="Dúvida"
                      control={<Radio color="primary" />}
                      label="Dúvida"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Problema"
                      control={<Radio color="primary" />}
                      label="Problema"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Sugestão"
                      control={<Radio color="primary" />}
                      label="Sugestão"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Outro"
                      control={<Radio color="primary" />}
                      label="Outro"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="row px-3 mb-4">
              <div className="col-sm-12 col-md-6 col-lg-4">
                <TextValidator
                  label="Email de contato*"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  validators={['required', 'isEmail']}
                  errorMessages={['Campo obrigatório', 'Email inválido']}
                  helperText="entraremos em contato por este email"
                  fullWidth
                />
              </div>
            </div>
            <div className="row px-3 mb-4">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <TextValidator
                  id="description"
                  name="description"
                  label="Descrição*"
                  value={description}
                  onChange={handleDescriptionChange}
                  helperText={descriptionHelperText}
                  validators={['required']}
                  errorMessages={['Campo obrigatório']}
                  multiline
                  fullWidth
                  rows={4}
                />
              </div>
            </div>
            <Divider />
            {isLoading && <LinearProgress />}
            <div className="row px-3">
              <div className="col-sm-12 col-md-12 col-lg-12 py-2 d-flex justify-content-end">
                <Tooltip title="Enviar" placement="top" disabled={isLoading}>
                  <Button
                    type="submit"
                    size="large"
                    variant="outlined"
                    color="primary"
                  >
                    <i className="fas fa-paper-plane font-size-18"></i>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </ValidatorForm>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={alertMessage.show}
          autoHideDuration={3000}
          onClose={handleMessageClose}
          TransitionComponent={Zoom}
        >
          <SnackbarContentWrapper
            onClose={handleMessageClose}
            variant={alertMessage.variant}
            message={alertMessage.message}
          />
        </Snackbar>
      </div>
    </>
  );
}
