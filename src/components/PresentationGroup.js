import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FlexBox,
  Heading,
  Slide,
  Deck,
  Box,
  Progress,
  FullScreen
} from 'spectacle';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, DialogContent } from '@mui/material';
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
import { DialogAnimate } from './animate';
import ChatWindow from '../sections/@dashboard/chat/ChatWindow';
import ChatSidebar from '../sections/@dashboard/chat/ChatSidebar';

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
  const { code } = useParams();

  // get query params from url
  const [slideIndex, setSlideIndex] = useState(
    Number(searchParams.get('slideIndex'))
  );

  const roomCode = code || '123456';

  console.log('slideIndex', slideIndex);

  useEffect(() => {
    socket = io(HOST_SK);

    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });
    });

    socket.on('chart', (data) => {
      console.log('chart', data);
      if (data) {
        console.log(data.answer);
        setQuestion(data.question);
        setLabels(data.answer);
        setNumberAnswer(data.numberAnswer);
      }
    });

    socket.on('slide-change', (data) => {
      if (data) {
        setSlideIndex(data.slideIndex);
        setQuestion(data.question);
        setLabels(data.answer);
        setNumberAnswer(data.numberAnswer);
      }
    });

    socket.on('vote', (data) => {
      if (data) {
        setNumberAnswer(data.numberAnswer);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('chart');
      socket.off('slide-change');
      socket.off('vote');
      socket.off('disconnect');
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

  return (
    <Deck template={template}>
      <Slide backgroundColor="white" slideNum={1}>
        <Heading color="#212B36">{question}</Heading>
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
        <Fab
          color="primary"
          aria-label="message"
          onClick={() => {
            console.log('hello');
          }}
        >
          <MessageIcon />
        </Fab>
      </Slide>
      <DialogAnimate fullWidth maxWidth="md" open={true}>
        <DialogContent>
          <Card sx={{ height: '72vh', display: 'flex' }}>
            <ChatWindow />
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
