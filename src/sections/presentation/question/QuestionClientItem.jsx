import { Chip, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useAuth from '../../../hooks/useAuth';

QuestionClientItem.propTypes = {
  question: PropTypes.object
};
export default function QuestionClientItem({ question }) {
  const { user } = useAuth();
  let author;
  let isMe = false;
  if (question && user && question.email && question.email === user.email) {
    author = 'Me';
    isMe = true;
  } else {
    author = question.author ? question.author : 'anonymous';
    isMe = false;
  }
  return (
    <>
      <div>
        <Chip
          sx={{ maxWidth: '200px' }}
          label={author}
          color={isMe ? 'primary' : 'default'}
          size="small"
        />
        <Typography>{question.content}</Typography>
      </div>
      <Divider variant="inset" component="div" />
    </>
  );
}
