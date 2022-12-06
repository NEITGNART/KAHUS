import { useEffect, useState } from 'react';
import { Checkbox, IconButton, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';

ChoiceField.propTypes = {
  option: PropTypes.object,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
};

export default function ChoiceField({ option, onChange, onDelete }) {
  const [isCorrect, setIsCorrect] = useState(option.isCorrect || false);
  const [content, setContent] = useState(option.content || '');
  const { id } = option;

  useEffect(() => {
    setContent(option.content || '');
    setIsCorrect(option.isCorrect || false);
  }, [option]);

  const optionChange = (event) => {
    setContent(event.target.value);
    const newOption = { ...option, content: event.target.value };
    onChange(newOption);
  };

  const correctChange = (event) => {
    setIsCorrect(event.target.checked);
    const newOption = { ...option, isCorrect: event.target.checked };
    onChange(newOption);
  };

  return (
    <Stack direction="row" spacing={1} sx={{ pb: 1, pt: 1 }}>
      <Checkbox checked={isCorrect} onChange={correctChange} />
      <TextField label="Option" value={content} onChange={optionChange} />
      <IconButton onClick={() => onDelete(id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
