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
import { Button, Card, DialogContent, Stack } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import Fab from '@mui/material/Fab';

// eslint-disable-next-line import/no-unresolved
import { Bar } from 'react-chartjs-2';
import io from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';
import { FormProvider } from './hook-form';
import RHFMyRadioGroup from './hook-form/RHFMyRadioGroup';
import { HOST_SK } from '../config';
import useAuth from '../hooks/useAuth';
import ChatWindow from '../sections/@dashboard/chat/ChatWindow';
import { onParticipantJoinChat, onReceiveMessage } from '../redux/slices/chat';
import { useDispatch, useSelector } from '../redux/store';
import { DialogAnimate } from './animate';
import { SlideType } from '../pages/dashboard/Prestation/value/SlideType';

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

function PresentationGroup() {
  const { user } = useAuth();
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('Choose wisely');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showChatConsole, setShowChatConsole] = useState(false);
  const [content, setContent] = useState('');
  const [slideType, setSlideType] = useState('');
  const { code } = useParams();
  // get query params from url
  const [slideIndex, setSlideIndex] = useState(
    Number(searchParams.get('slideIndex'))
  );

  const roomCode = code || '123456';

  const dispatch = useDispatch();

  const handleCloseChatConsole = () => {
    setShowChatConsole(false);
  };

  const handleOpenChatConsole = () => {
    setShowChatConsole(true);
  };

  useEffect(() => {
    socket = io(HOST_SK);

    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });
    });

    socket.on('chart', (data) => {
      console.log('chart', data);
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
      if (data) {
        dispatch(onReceiveMessage(data));
      }
    });

    socket.on('newParticipantJoinChat', (data) => {
      console.log(data);
      if (data) {
        dispatch(onParticipantJoinChat(data));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('chart');
      socket.off('slide-change');
      socket.off('vote');
      socket.off('receiveMsg');
      socket.off('disconnect');
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
      id: user.email,
      isInGroup: true,
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

  let renderSlide;

  if (slideType === SlideType.MULTIPLE_CHOICE) {
    renderSlide = (
      <>
        <Box height="100%" width="70%">
          <Bar options={options} data={datas} />
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
      </>
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
  } else {
    renderSlide = <div>Waiting</div>;
  }

  return (
    <Deck template={template}>
      <Slide backgroundColor="white" slideNum={1}>
        <Heading color="#212B36">{question}</Heading>
        <FlexBox>{renderSlide}</FlexBox>
        <Fab
          color="primary"
          aria-label="message"
          onClick={handleOpenChatConsole}
        >
          <MessageIcon />
        </Fab>
      </Slide>
      <DialogAnimate
        fullWidth
        maxWidth="md"
        open={showChatConsole}
        onClose={handleCloseChatConsole}
      >
        <DialogContent>
          <Card sx={{ height: '72vh', display: 'flex' }}>
            <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
              <ChatWindow socket={socket} />
            </Stack>
          </Card>
        </DialogContent>
      </DialogAnimate>
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

export default PresentationGroup;
