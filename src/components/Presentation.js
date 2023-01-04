import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Deck,
  FlexBox,
  FullScreen,
  Heading,
  Progress,
  Slide,
  Text
} from 'spectacle';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { useSnackbar } from 'notistack';

// eslint-disable-next-line import/no-unresolved
import { Bar } from 'react-chartjs-2';
import io from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';
import Fab from '@mui/material/Fab';
import { FormProvider } from './hook-form';
import RHFMyRadioGroup from './hook-form/RHFMyRadioGroup';
import { HOST_SK } from '../config';
import QuestionBoxClient from '../sections/presentation/question/QuestionBoxClient';
import { SlideType } from '../pages/dashboard/Prestation/value/SlideType';
import axios from '../utils/axios';
import { onParticipantJoinChat, onReceiveMessage } from '../redux/slices/chat';
import { useDispatch } from '../redux/store';
import ChatBox from '../sections/presentation/chat/ChatBox';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        precision: 0
      }
    }
  }
};

let socket;
const cacheAnswerId = new Map();

function Presentation() {
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('Choose wisely');
  const [searchParams, setSearchParams] = useSearchParams();
  const [slideType, setSlideType] = useState('');
  const [content, setContent] = useState('');
  const [presentQuestions, setPresentQuestions] = useState([]);
  const [newPresentQuestion, setNewPresentQuestion] = useState();
  const { code } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  // get query params from url
  const [slideIndex, setSlideIndex] = useState(
    Number(searchParams.get('slideIndex'))
  );
  const dispatch = useDispatch();
  const roomCode = code || '123456';

  console.log('slideIndex', slideIndex);

  useEffect(() => {
    axios.get(`api/presentation/code/${code}`).then((res) => {
      if (res.data === undefined || res.data === null) {
        return;
      }
      setPresentQuestions(
        [...res.data.questions, ...presentQuestions].sort((a, b) => {
          const va = a.createdAt ? a.createdAt : 0;
          const vb = b.createdAt ? b.createdAt : 0;
          return va - vb;
        })
      );
    });
  }, []);

  useEffect(() => {
    const filteredPresentQuestions = presentQuestions.filter(
      (presentQuestion) => presentQuestion.id !== newPresentQuestion.id
    );
    setPresentQuestions(
      [...filteredPresentQuestions, newPresentQuestion].sort((a, b) => {
        const va = a.createdAt ? a.createdAt : 0;
        const vb = b.createdAt ? b.createdAt : 0;
        return va - vb;
      })
    );
  }, [newPresentQuestion]);

  useEffect(() => {
    socket = io(HOST_SK);
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });
      socket.on('chart', (data) => {
        if (data) {
          console.log(data);
          if (data.type === SlideType.MULTIPLE_CHOICE) {
            setLabels(data.answer);
            setNumberAnswer(data.numberAnswer);
          } else if (
            data.type === SlideType.PARAGRAPH ||
            data.type === SlideType.HEADING
          ) {
            setContent(data.content);
          }
          setSlideType(data.type);
          setQuestion(data.question);
        }
      });

      socket.on('slide-change', (data) => {
        if (data) {
          if (data.type === SlideType.MULTIPLE_CHOICE) {
            setLabels(data.answer);
            setNumberAnswer(data.numberAnswer);
          } else if (
            data.type === SlideType.PARAGRAPH ||
            data.type === SlideType.HEADING
          ) {
            setContent(data.content);
          }
          setSlideType(data.type);
          setSlideIndex(data.slideIndex);
          setQuestion(data.question);
        }
      });

      socket.on('vote', (data) => {
        if (data) {
          setNumberAnswer(data.numberAnswer);
        }
      });

      socket.on('receiveMsg', (data) => {
        console.log(data);
        if (data) {
          enqueueSnackbar('There is new message', { variant: 'info' });
          dispatch(onReceiveMessage(data));
        }
      });

      socket.on('newParticipantJoinChat', (data) => {
        if (data) {
          dispatch(onParticipantJoinChat(data));
        }
      });
    });

    socket.on('disconnect', () => {
      // remove cacheAnswerId
      cacheAnswerId.clear();
    });

    socket.on('question', (data) => {
      setNewPresentQuestion(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chart');
      socket.off('slide-change');
      socket.off('vote');
      socket.off('question');
      socket.off('receiveMsg');
      socket.off('newParticipantJoinChat');
    };
  }, []);

  const datas = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: numberAnswer,
        backgroundColor: 'rgb(20, 86, 204)'
      }
    ]
  };

  const handleRadioChange = (event) => {
    setAnswer(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSendQuestion = (data) => {
    socket.emit('question', data);
    setPresentQuestions([...presentQuestions, data]);
  };

  const onSendMessageSocket = (data) => {
    socket.emit('sendMsg', data);
  };

  const onSubmit = async (data) => {
    if (cacheAnswerId.has(`${socket.id}-${slideIndex}`)) {
      setHelperText('You already voted');
      setError(true);
      return;
    }
    cacheAnswerId.set(`${socket.id}-${slideIndex}`, true);
    socket.emit('answer', {
      slideIndex,
      answer,
      id: socket.id,
      isInGroup: false,
      time: Date.now()
    });

    if (answer === '') {
      setError(true);
      setHelperText('Please select an option.');
    } else {
      setHelperText('Answer is submitted.');
      setAnswer('');
    }
  };

  const methods = useForm({
    defaultValues: {
      quiz: []
    }
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = methods;

  const handleVoteButtonClick = (data) => {
    socket.emit('vote-question', { ...data });
  };

  let renderSlide;

  if (slideType === SlideType.MULTIPLE_CHOICE) {
    renderSlide = (
      <FlexBox>
        <Box height="100%" width="70%">
          {labels.length > 0 ? (
            <Bar options={options} data={datas} />
          ) : (
            <>Loading</>
          )}
        </Box>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          width="30%"
        >
          <RHFMyRadioGroup
            onChange={handleRadioChange}
            labels={labels}
            value={answer}
            error={error}
            helperText={helperText}
          />
        </FormProvider>
      </FlexBox>
    );
  } else if (slideType === SlideType.HEADING) {
    renderSlide = (
      <Text color="#212B36" fontSize={48}>
        {content}
      </Text>
    );
  } else if (slideType === SlideType.PARAGRAPH) {
    renderSlide = (
      <Text color="#212B36" fontSize={32}>
        {content}
      </Text>
    );
  }

  return (
    <Deck template={template}>
      <Slide backgroundColor="white" slideNum={1}>
        <Heading color="#212B36">{question}</Heading>
        {renderSlide}
        <Box
          sx={{
            display: 'contents',
            position: 'absolute',
            marginBottom: '10px',
            backgroundColor: 'white'
          }}
        >
          <QuestionBoxClient
            onSendQuestion={handleSendQuestion}
            questions={presentQuestions}
            onVoteButtonClick={handleVoteButtonClick}
          />
          <ChatBox onSendMessageSocket={onSendMessageSocket} />
        </Box>
      </Slide>
    </Deck>
  );
}

const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen color="#111213" />
    </Box>
    <Box padding="1em">
      <Progress color="#111213" />
    </Box>
  </FlexBox>
);

export default Presentation;
