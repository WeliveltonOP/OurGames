import React, { useState } from 'react';
import clsx from 'clsx';
import Async from 'react-select/async';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 'auto',
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
    color: 'white',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
}));

const NoOptionsMessage = (props) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {'Nada encontrado'}
    {/* {props.children}   */}
  </Typography>
);

const inputComponent = ({ inputRef, ...props }) => (
  <div ref={inputRef} {...props} />
);

const Control = (props) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      },
    }}
    {...props.selectProps.textFieldProps}
  />
);

const ValueLabel = ({ label, search }) => {
  const matches = match(label, search);
  const parts = parse(label, matches);

  return parts.map((part, index) =>
    part.highlight ? (
      <span key={index} style={{ fontWeight: 500 }}>
        {part.text}
      </span>
    ) : (
      <span key={index}>{part.text}</span>
    )
  );
};

const Option = (props) => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
    }}
    {...props.innerProps}
  >
    <ValueLabel label={props.children} search={props.selectProps.inputValue} />
  </MenuItem>
);

const Placeholder = (props) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const SingleValue = (props) => (
  <Typography
    className={props.selectProps.classes.singleValue}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const ValueContainer = (props) => (
  <div className={props.selectProps.classes.valueContainer}>
    {props.children}
  </div>
);

const Menu = (props) => (
  <Paper
    square
    className={props.selectProps.classes.paper}
    {...props.innerProps}
  >
    {props.children}
  </Paper>
);

const IndicatorSeparator = () => null;

const ClearIndicator = (props) => (
  <IconButton {...props.innerProps}>
    <CancelIcon />
  </IconButton>
);

const DropdownIndicator = (props) => (
  <></>
  // <IconButton {...props.innerProps}>
  //   <ArrowDropDownIcon />
  // </IconButton>
);

const MultiValue = (props) => (
  <Chip
    tabIndex={-1}
    label={props.children.substr(0, 30) + '...'}
    className={clsx(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused,
    })}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon {...props.removeProps} />}
  />
);

const LoadingIndicator = () => <CircularProgress size={20} />;

const LoadingMessage = (props) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

export default function Autocomplete(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Async
        textFieldProps={{
          //label: 'NCMs',
          InputLabelProps: {
            shrink: true,
          },
        }}
        {...{ ...props, classes }}
      />
    </div>
  );
}

Autocomplete.defaultProps = {
  cacheOptions: true,
  defaultOptions: true,
  loadOptions: () => {},
  isMulti: false,
  isClearable: true,
  components: {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    MultiValue,
    ValueContainer,
    IndicatorSeparator,
    ClearIndicator,
    DropdownIndicator,
    LoadingIndicator,
    LoadingMessage,
  },
};
