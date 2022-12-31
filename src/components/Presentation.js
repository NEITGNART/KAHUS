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
import useAuth from '../hooks/useAuth';

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

const socket = io(HOST_SK);
const cacheAnswerId = new Map();

function Presentation() {
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('Choose wisely');
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeQuestion, setTypeQuestion] = useState('bar-chart');
  const { code } = useParams();
  const { user } = useAuth();
  console.log(user);

  // get query params from url
  const [slideIndex, setSlideIndex] = useState(
    Number(searchParams.get('slideIndex'))
  );

  const roomCode = code || '123456';

  console.log('slideIndex', slideIndex);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex, userId: user.id });

      socket.on('chart', (data) => {
        if (data) {
          setQuestion(data.question);
          setLabels(data.answer);
          setNumberAnswer(data.numberAnswer);
        }
      });

      socket.on('slide-change', (data) => {
        if (data) {
          console.log('Slide-change event', slideIndex);
          setSlideIndex(data.slideIndex);
          setQuestion(data.question);
          setLabels(data.answer);
          setNumberAnswer(data.numberAnswer);
          setError(false);
          setHelperText('Choose wisely');
        }
      });

      socket.on('vote', (data) => {
        if (data) {
          setNumberAnswer(data.numberAnswer);
        }
      });
    });

    socket.on('disconnect', () => {
      // remove cacheAnswerId
      cacheAnswerId.clear();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chart');
      socket.off('slide-change');
      socket.off('vote');
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

  let questionSlide;

  if (typeQuestion === 'bar-chart') {
    questionSlide = (
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
  } else if (typeQuestion === 'heading') {
    questionSlide = (
      <Text color="#212B36">
        A highly customizable and versatile GraphQL client, A highly
        customizable and versatile GraphQL clientA highly customizable
      </Text>
    );
  } else {
    questionSlide = (
      <Text color="#212B36" fontSize={32}>
        A highly customizable and versatile GraphQL client, A highly
        customizable and versatile GraphQL clientA highly customizable and
        versatile GraphQL clientA highly customizable and versatile GraphQL
        clientA highly customizable and versatile GraphQL clientA highly
        customizable and versatile GraphQL client, A highly customizable and
        versatile GraphQL clientA highly customizable and versatile GraphQL
        clientA highly customizable and versatile GraphQL clientA highly
        customizable and versatile GraphQL client
      </Text>
    );
  }

  return (
    <Deck template={template}>
      <Slide backgroundColor="white" slideNum={1}>
        <Heading color="#212B36">{question}</Heading>
        {questionSlide}
        <Fab sx={{ backgroundColor: 'white' }}>
          <QuestionBoxClient onSendQuestion={handleSendQuestion} />
        </Fab>
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
