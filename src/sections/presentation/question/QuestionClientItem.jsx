import { Chip, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

QuestionClientItem.propTypes = {
  question: PropTypes.object
};
export default function QuestionClientItem({ question }) {
  return (
    <>
      <Stack>
        <Chip
          sx={{ maxWidth: '200px' }}
          label={question.author ? question.author : 'anonymous'}
        />
        <Typography>{question.content}</Typography>
      </Stack>
      <Divider variant="inset" component="Stack" />
    </>
  );
}
