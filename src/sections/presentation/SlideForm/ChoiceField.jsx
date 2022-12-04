import { useEffect, useState } from 'react';
import { Checkbox, IconButton, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';

ChoiceField.propTypes = {
  slideId: PropTypes.number,
  option: PropTypes.object,
  onChange: PropTypes.func
};

export default function ChoiceField({ slideId, option, onChange }) {
  const [isCorrect, setIsCorrect] = useState(option.isCorrect || false);
  const [content, setContent] = useState(option.content || '');
  const { id } = option.id;

  useEffect(() => {
    setContent(option.content || '');
    setIsCorrect(option.isCorrect || false);
  }, [slideId, option]);

  const optionChange = (event) => {
    setContent(event.target.value);
    const newOption = { ...option, content: event.target.value };
    onChange(slideId, newOption);
  };

  const correctChange = (event) => {
    setIsCorrect(event.target.checked);
    const newOption = { ...option, isCorrect: event.target.checked };
    onChange(slideId, newOption);
  };

  return (
    <Stack direction="row" spacing={1}>
      <Checkbox checked={isCorrect} onChange={correctChange} />
      <TextField label="Option" value={content} onChange={optionChange} />
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
