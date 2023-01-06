import { Card, Stack, Typography } from '@mui/material';
import './SlideItem.scss';
import PropTypes from 'prop-types';
import Iconify from '../../../components/Iconify';

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
      <Card
        className="slide-item-card-thumb"
        variant="outlined"
        style={{ width: '100%' }}
      >
        <Stack justifyContent="center" alignItems="center">
          <Typography>{slide.question}</Typography>
          <Iconify
            icon="material-symbols:bar-chart"
            width={50}
            height={50}
            color="#48cae4"
          />
        </Stack>
      </Card>
    </Stack>
  );
}
