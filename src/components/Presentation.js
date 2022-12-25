import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FlexBox,
  Heading,
  SpectacleLogo,
  UnorderedList,
  CodeSpan,
  OrderedList,
  ListItem,
  FullScreen,
  AnimatedProgress,
  Appear,
  Slide,
  Deck,
  Text,
  Grid,
  Box,
  Image,
  CodePane,
  MarkdownSlide,
  MarkdownSlideSet,
  Notes,
  SlideLayout,
  Progress,
  useSteps
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

// eslint-disable-next-line import/no-unresolved
import { Bar } from 'react-chartjs-2';
import io from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';
import { FormProvider } from './hook-form';
import RHFMyRadioGroup from './hook-form/RHFMyRadioGroup';
import { HOST_SK } from '../config';

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
  const { code } = useParams();

  // get query params from url
  const [slideIndex, setSlideIndex] = useState(
    Number(searchParams.get('slideIndex'))
  );

  const roomCode = code || '123456';

  console.log('slideIndex', slideIndex);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });

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
