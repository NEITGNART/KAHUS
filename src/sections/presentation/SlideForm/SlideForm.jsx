import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import ChoiceField from './ChoiceField';
import Scrollbar from '../../../components/Scrollbar';

SlideForm.propTypes = {
  slide: PropTypes.object,
  onChangeQuestion: PropTypes.func,
  onChangeOption: PropTypes.func,
  onAddOptionButtonClick: PropTypes.func,
  onDeleteOptionClick: PropTypes.func
};

const newOption = () => {
  return {
    content: 'Option',
    isCorrect: false
  };
};

export default function SlideForm({
  slide,
  onChangeQuestion,
  onChangeOption,
  onAddOptionButtonClick,
  onDeleteOptionClick
}) {
  const [question, setQuestion] = useState(slide.question || '');
  const [options, setOptions] = useState(slide.options || []);
  // const { question, options } = slide;

  useEffect(() => {
    setQuestion(slide.question || '');
    setOptions(slide.options || []);
  }, [slide, slide.options]);

  const questionChange = (event) => {
    setQuestion(event.target.value);
    onChangeQuestion(slide.id, event.target.value);
  };

  const onAddButtonClick = () => {
    onAddOptionButtonClick({ ...newOption() });
  };
  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ marginTop: 2, marginRight: '20px' }}
    >
      <Typography> Your question:</Typography>
      <TextField
        label="Multiple choice"
        value={question}
        onChange={questionChange}
      />
      <Box sx={{ height: { md: '60vh' } }}>
        <Scrollbar>
          {options.map((option) => (
            <ChoiceField
              key={option.id}
              option={option}
              slideId={slide.id}
              onChange={onChangeOption}
              onDelete={onDeleteOptionClick}
            />
          ))}
        </Scrollbar>
      </Box>
      <Button onClick={onAddButtonClick} variant="contained">
        <AddIcon /> Add option
      </Button>
    </Stack>
  );
}
