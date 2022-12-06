import { Card, Stack, Typography } from '@mui/material';
import './SlideItem.scss';
import PropTypes from 'prop-types';

SlideItem.propTypes = {
  slide: PropTypes.object,
  onClick: PropTypes.func,
  index: PropTypes.number,
  isSelected: PropTypes.bool
};

export default function SlideItem({ index, slide, onClick, isSelected }) {
  return (
    <Stack
      className={`slide-item ${isSelected ? 'selected' : ''}`}
      direction="row"
      spacing={2}
      onClick={(event) => onClick(index)}
    >
      <Typography>{index}</Typography>
      <Card className="slide-item-card-thumb" variant="outlined">
        <Typography>{slide.question}</Typography>
      </Card>
    </Stack>
  );
}
