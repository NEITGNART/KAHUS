import React from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

RhfMyRadioGroup.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.bool,
  value: PropTypes.string,
  helperText: PropTypes.string,
  labels: PropTypes.array
};

function RhfMyRadioGroup({
  onChange,
  error,
  value,
  helperText,
  labels,
  ...other
}) {
  return (
    <FormControl sx={{ m: 3 }} error={error} variant="standard">
      <FormLabel id="demo-error-radios">Answer is...</FormLabel>
      <RadioGroup
        aria-labelledby="demo-error-radios"
        name="quiz"
        value={value}
        onChange={onChange}
      >
        {labels.map((label) => (
          <FormControlLabelStyle
            key={label}
            value={label}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
      <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
        Submit
      </Button>
    </FormControl>
  );
}

const FormControlLabelStyle = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.text.primary
}));

export default RhfMyRadioGroup;
