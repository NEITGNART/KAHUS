import { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import ChoiceField from './ChoiceField';

SlideForm.propTypes = {
  slide: PropTypes.object,
  onChangeQuestion: PropTypes.func,
  onChangeOption: PropTypes.func
};

export default function SlideForm({ slide, onChangeQuestion, onChangeOption }) {
  const [question, setQuestion] = useState(slide.question || '');
  const [options, setOptions] = useState(slide.options || []);
  // const { question, options } = slide;

  useEffect(() => {
    setQuestion(slide.question || '');
    setOptions(slide.options || []);
  }, [slide]);

  const questionChange = (event) => {
    setQuestion(event.target.value);
    onChangeQuestion(slide.id, event.target.value);
  };
  return (
    <Stack direction="column" spacing={1} sx={{ marginRight: '20px' }}>
      <Typography> Your question:</Typography>
      <TextField
        label="Multiple choice"
        value={question}
        onChange={questionChange}
      />
      {options.map((option) => (
        <ChoiceField
          key={option.id}
          option={option}
          slideId={slide.id}
          onChange={onChangeOption}
        />
      ))}

      <Button variant="contained">
        <AddIcon /> Add option
      </Button>
    </Stack>
  );
}
