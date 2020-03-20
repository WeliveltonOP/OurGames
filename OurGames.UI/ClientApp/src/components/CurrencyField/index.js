import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';

class CurrencyField extends Component {
  constructor(props) {
    super(props);
    this.onInputType = this.onInputType.bind(this);
    this.formatRawValue = this.formatRawValue.bind(this);
    this.parseRawValue = this.parseRawValue.bind(this);
    this.defaultConverter = this.defaultConverter.bind(this);
    this.state = {
      rawValue: this.props.value
    };
  }

  componentWillMount() {
    this.notifyParentWithRawValue(this.state.rawValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ rawValue: nextProps.value });
    }
  }

  onInputType(event) {
    const input = event.target.value;

    let rawValue = this.parseRawValue(input);

    if (!rawValue) {
      rawValue = 0;
    }

    this.notifyParentWithRawValue(rawValue);

    this.setState({ rawValue });
  }

  notifyParentWithRawValue(rawValue) {
    const display = this.formatRawValue(rawValue);
    const converter = this.props.converter || this.defaultConverter;
    this.props.onChange(converter(rawValue), display);
  }

  parseRawValue(displayedValue) {
    const value = displayedValue.replace(/[^0-9]/g, '');

    return parseFloat(value);
  }

  formatRawValue(rawValue) {
    const minChars = this.props.precision + 1;

    let result = `${rawValue}`;

    if (result.length < minChars) {
      const numbers = minChars - result.length;
      const leftZeroPad = '0'.repeat(numbers);
      result = `${leftZeroPad}${result}`;
    }

    let beforeSeparator = result.slice(0, result.length - this.props.precision);
    const afterSeparator = result.slice(result.length - this.props.precision);

    if (beforeSeparator.length > 3) {
      const chars = beforeSeparator.split('').reverse();

      let withDots = '';

      for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i];
        const dot = i % 3 === 0 && i !== 0 ? this.props.delimiter : '';
        withDots = `${withDots}${char}${dot}`;
      }

      beforeSeparator = withDots;
    }

    while (beforeSeparator.endsWith('.'))
      beforeSeparator = beforeSeparator.substring(
        0,
        beforeSeparator.length - 1
      );

    result = beforeSeparator + this.props.separator + afterSeparator;

    if (this.props.unit) {
      result = `${this.props.unit} ${result}`;
    }

    return result;
  }

  defaultConverter(val) {
    // const { precision } = this.props;
    const raw = val.toString();

    // if (Number.isNaN(parseFloat(raw))) {
    //   return 0;
    // }

    // if (!raw.length) {
    //   return parseFloat(raw);
    // }

    // if (precision >= raw.length) {
    //   return parseFloat(raw);
    // }

    // const prefix = raw.slice(0, raw.length - precision);
    // const sufix = raw.slice(raw.length - precision, raw.length);
    // return parseFloat(`${prefix}.${sufix}`);
    return parseInt(raw.replace(/\D/, ''));
  }

  render() {
    return (
      <TextField
        {...this.props}
        onChange={this.onInputType}
        value={this.formatRawValue(this.state.rawValue)}
      />
    );
  }
}

CurrencyField.propTypes = {
  id: PropTypes.string,
  delimiter: PropTypes.string,
  onChange: PropTypes.func,
  precision: PropTypes.number,
  separator: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number,
  converter: PropTypes.func
};

CurrencyField.defaultProps = {
  value: 0,
  precision: 2,
  separator: ',',
  delimiter: '.',
  unit: '',
  onChange: () => {}
};

export default CurrencyField;
