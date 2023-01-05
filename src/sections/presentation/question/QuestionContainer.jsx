import {
  Box,
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import Iconify from '../../../components/Iconify';

const ALL = 'ALL';
const ANSWERED = 'ANSWERED';
const NANSWERED = 'NOT_ANSWERED';
const typeOptions = {
  all: ALL,
  answered: ANSWERED,
  not_answered: NANSWERED
};

const sortOptions = {
  timeAsc: 'TIME_ASC',
  timeDesc: 'TIME_DESC',
  voteAsc: 'VOTE_ASC',
  voteDesc: 'VOTE_DESC'
};

QuestionContainer.propTypes = {
  questions: PropTypes.array,
  onUpdateQuestion: PropTypes.func
};
export default function QuestionContainer({ questions, onUpdateQuestion }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [typeFilter, setTypeFilter] = useState(typeOptions.all);
  const [sortFilter, setSortFilter] = useState(sortOptions.timeAsc);

  useEffect(() => {
    const length =
      questionList && questionList.length ? questionList.length : 0;
    setDisableNext(currentIndex + 1 >= length);
    setDisablePrev(currentIndex <= 0);
  }, [currentIndex, questionList]);

  useEffect(() => {
    setQuestionList(questions);
    handleFilterQuestions(typeFilter);
  }, [questions]);
  const onPrevButtonClick = () => {
    if (currentIndex - 1 < 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const onNextButtonClick = () => {
    if (currentIndex + 1 >= questionList.length) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const onAnswerButtonClick = (question) => {
    const newQuestions = questionList.map((prevQuestion) => {
      if (prevQuestion.id === question.id) {
        const isAnswered = !prevQuestion.isAnswered;
        const updatedQuestion = { ...prevQuestion, isAnswered };
        onUpdateQuestion(updatedQuestion);
        return { ...prevQuestion, isAnswered };
      }
      return prevQuestion;
    });
    setQuestionList(newQuestions);
  };

  const handleFilterQuestions = (filter) => {
    let res = [];
    switch (filter) {
      case typeOptions.answered:
        res = questions.filter((question) => question.isAnswered);
        break;
      case typeOptions.not_answered:
        res = questions.filter((question) => !question.isAnswered);
        break;
      default:
        res = questions;
    }
    handleSortQuestions(sortFilter, res);
  };

  const onChangeFilter = (evt) => {
    const filter = evt.target.value;
    setTypeFilter(filter);
    handleFilterQuestions(filter);
  };

  const onChangeSortFilter = (evt) => {
    const sort = evt.target.value;
    setSortFilter(sort);
    handleSortQuestions(sort, questionList);
  };

  const handleSortQuestions = (sort, list) => {
    let res = [];
    switch (sort) {
      case sortOptions.timeDesc:
        res = list.sort((q1, q2) => q2.createdAt - q1.createdAt);
        break;
      case sortOptions.voteAsc:
        res = list.sort((q1, q2) => {
          const v1 = q1.userVotes ? q1.userVotes.length : 0;
          const v2 = q2.userVotes ? q2.userVotes.length : 0;
          return v1 - v2;
        });
        break;
      case sortOptions.voteDesc:
        res = list.sort((q1, q2) => {
          const v1 = q1.userVotes ? q1.userVotes.length : 0;
          const v2 = q2.userVotes ? q2.userVotes.length : 0;
          return v2 - v1;
        });
        break;
      default:
        res = list.sort((q1, q2) => q1.createdAt - q2.createdAt);
    }
    if (res.length <= 0) {
      setQuestionList(null);
    } else {
      setCurrentIndex(0);
      setQuestionList([...res]);
    }
  };

  return (
    <Stack direction="row">
      <Stack>
        <Stack direction="row">
          <FormControl fullWidth sx={{ minWidth: '50px', flex: 1 }}>
            <Select value={typeFilter} displayEmpty onChange={onChangeFilter}>
              <MenuItem value={typeOptions.all}>All</MenuItem>
              <MenuItem value={typeOptions.answered}>
                Questions Answered
              </MenuItem>
              <MenuItem value={typeOptions.not_answered}>
                Questions Not Answered
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ minWidth: '100px', flex: 1 }}>
            <Select
              value={sortFilter}
              displayEmpty
              onChange={onChangeSortFilter}
            >
              <MenuItem value={sortOptions.timeAsc}>By ascending time</MenuItem>
              <MenuItem value={sortOptions.timeDesc}>
                By descending time
              </MenuItem>
              <MenuItem value={sortOptions.voteAsc}>By ascending vote</MenuItem>
              <MenuItem value={sortOptions.voteDesc}>
                By descending vote
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {questionList && questionList.length > 0 && (
          <List
            sx={{
              width: '100%',
              minWidth: 200,
              height: '100%',
              maxHeight: '500px',
              bgcolor: 'background.paper',
              boxShadow: 6,
              borderRadius: 5,
              marginRight: 10,
              overflow: 'auto'
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Question List
              </ListSubheader>
            }
          >
            {questionList.map((q, index) => (
              <ListItem
                sx={
                  index === currentIndex ? { backgroundColor: 'lightgrey' } : {}
                }
                secondaryAction={
                  <Stack alignSelf="flex-start" alignItems="center" mr={1}>
                    <Button>
                      <ThumbUpOffAltOutlinedIcon />
                    </Button>
                    <Typography>
                      {q.userVotes ? q.userVotes.length : 0}
                    </Typography>
                  </Stack>
                }
              >
                <ListItemButton onClick={() => setCurrentIndex(index)}>
                  <ListItemText
                    primary={
                      <>
                        <Typography display="inline">{q.content}</Typography>
                        {q.isAnswered && (
                          <Typography
                            variant="subtitle2"
                            color="green"
                            display="inline"
                          >
                            {' '}
                            Answered
                          </Typography>
                        )}
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {`asked by ${q.author ? q.author : 'anonymous'}`}
                        </Typography>
                        {` - ${moment(q.createdAt).calendar()}`}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
      <Box
        sx={{
          minWidth: 500,
          minHeight: 500
        }}
      >
        {questionList && questionList.length > 0 && (
          <Stack sx={{ height: '100%' }}>
            <Typography align="center">
              {' '}
              {currentIndex + 1} / {questionList.length}{' '}
            </Typography>
            <Stack sx={{ height: '100%' }} direction="row" alignItems="center">
              <IconButton onClick={onPrevButtonClick} disabled={disablePrev}>
                <Iconify icon="ooui:previous-ltr" />
              </IconButton>
              <Typography
                variant="h5"
                sx={{ overflowX: 'hidden' }}
                maxHeight={150}
                overflow="auto"
                align="center"
                color="black"
                paragraph
                flex={1}
              >
                {questionList[currentIndex].content
                  ? questionList[currentIndex].content
                  : ''}
              </Typography>
              <IconButton onClick={onNextButtonClick} disabled={disableNext}>
                <Iconify icon="ooui:previous-rtl" />
              </IconButton>
            </Stack>
            <Typography align="center" paragraph>
              -{' '}
              {questionList[currentIndex].author
                ? questionList[currentIndex].author
                : 'anonymous'}{' '}
              -
            </Typography>
            <Button
              onClick={() => onAnswerButtonClick(questionList[currentIndex])}
              color="primary"
              sx={{ borderRadius: 28 }}
              variant={
                questionList[currentIndex].isAnswered ? 'contained' : 'outlined'
              }
            >
              {questionList[currentIndex].isAnswered ? 'Answered' : 'Answer'}
            </Button>
          </Stack>
        )}
        {(!questionList || questionList.length <= 0) && (
          <div>
            <img src={`${process.env.PUBLIC_URL}/polizas_gif.gif`} alt="logo" />
          </div>
        )}
      </Box>
    </Stack>
  );
}
