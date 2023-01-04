import { Button, Chip, Divider, Stack, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

QuestionClientItem.propTypes = {
  question: PropTypes.object,
  onVoteButtonClick: PropTypes.func
};
export default function QuestionClientItem({ question, onVoteButtonClick }) {
  const { user, deviceId } = useAuth();

  let author;
  let isMe = false;
  let email = deviceId;
  if (question && user && question.email && question.email === user.email) {
    author = 'Me';
    isMe = true;
    email = user.email;
  } else {
    author = question.author ? question.author : 'anonymous';
    isMe = false;
  }

  if (question.email === deviceId) {
    author = 'Me';
    isMe = true;
  }

  const voted = question.userVotes
    ? question.userVotes.filter((item) => item.email === email).length
    : false;

  const handleVoteButtonClick = () => {
    onVoteButtonClick({ question, email });
  };
  return (
    <>
      <Stack>
        <Stack justifyContent="space-between" direction="row">
          <div>
            <Chip
              sx={{ maxWidth: '200px' }}
              label={author}
              color={isMe ? 'primary' : 'default'}
              size="small"
            />
            <Typography mr={1} variant="subtitle2">
              {question.content}
              {question.isAnswered && (
                <Typography variant="subtitle2" color="green">
                  {' '}
                  Answered
                </Typography>
              )}
            </Typography>
            {question.createdAt && (
              <Typography variant="caption">
                {moment(question.createdAt).startOf('hour').calendar()}
              </Typography>
            )}
          </div>
          <Stack alignSelf="flex-start" alignItems="center" mr={1}>
            <Button
              variant={voted ? 'contained' : 'outlined'}
              onClick={handleVoteButtonClick}
            >
              <ThumbUpOffAltOutlinedIcon />
            </Button>
            <Typography>
              {question.userVotes ? question.userVotes.length : 0}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider variant="inset" />
    </>
  );
}
