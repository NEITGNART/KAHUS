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
  Slide,
  Deck,
  Box,
  Progress,
  Text
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
import { Container, IconButton, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import Fab from '@mui/material/Fab';
import { FormProvider } from './hook-form';
import RHFMyRadioGroup from './hook-form/RHFMyRadioGroup';
import { HOST_API, HOST_SK } from '../config';
import Iconify from './Iconify';
import axios from '../utils/axios';
import QuestionBox from '../sections/presentation/question/QuestionBox';
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

function PresentationHost() {
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [link, setLink] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  // const [currentSlide, setCurrentSlide] = useState(searchParams.get('slideIndex'));
  const { enqueueSnackbar } = useSnackbar();
  const { code } = useParams();
  const [presentQuestions, setPresentQuestions] = useState([]);
  const [newPresentQuestion, setNewPresentQuestion] = useState();

  // get query params from url
  const totalSlide = searchParams.get('max') || 0;
  let slideIndex = Number(searchParams.get('slideIndex'));
  const roomCode = code || '123456';

  useEffect(() => {
    axios.get(`api/presentation/code/${code}`).then((res) => {
      console.log(res.data);
      setPresentQuestions([...res.data.questions, ...presentQuestions]);
    });
  }, []);

  useEffect(() => {
    setPresentQuestions([...presentQuestions, newPresentQuestion]);
  }, [newPresentQuestion]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });

      socket.on('chart', (data) => {
        if (data) {
          setQuestion(data.question);
          setLabels(data.answer);
          setNumberAnswer(data.numberAnswer);
          setLink(data.link);
        }
      });

      socket.on('vote', (data) => {
        if (data) {
          setNumberAnswer(data.numberAnswer);
        }
      });

      socket.on('slide-change', (data) => {
        if (data) {
          slideIndex = data.slideIndex;
          setQuestion(data.question);
          setLabels(data.answer);
          setNumberAnswer(data.numberAnswer);
        }
      });

      socket.on('question', (data) => {
        console.log([...presentQuestions, data]);
        setNewPresentQuestion(data);
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chart');
      socket.off('vote');
      socket.off('slide-change');
      socket.off('question');
    };
  }, []);

  useEffect(() => {
    socket.emit('question');
  }, [presentQuestions]);

  const changeSlide = (num) => {
    socket.emit('slide-change', num);
  };

  useEffect(() => {
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 37:
          if (slideIndex > 0) slideIndex -= 1;
          console.log(slideIndex);
          changeSlide(slideIndex);
          break;
        case 39:
          // Need to restrict number of slide by number of slide in deck
          if (slideIndex < totalSlide - 1) slideIndex += 1;
          changeSlide(slideIndex);
          console.log(slideIndex);
          break;
        default:
          break;
      }
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

  return (
    <Deck template={template}>
      <Slide backgroundColor="white" slideNum={1}>
        <Typography
          padding={0}
          margin={0}
          variant="h4"
          textAlign="center"
          color="#212B36"
        >
          Go to {link}
          <CopyToClipboard text={link}>
            <IconButton
              aria-label="copy"
              size="large"
              onClick={() => {
                enqueueSnackbar('copy link success', { variant: 'success' });
              }}
            >
              <Iconify icon="eva:copy-outline" />
            </IconButton>
          </CopyToClipboard>
        </Typography>
        <Heading fontSize="50px" textAlign="left" color="#212B36">
          {question}
        </Heading>
        <Container sx={{ width: '80%' }}>
          {labels.length > 0 ? (
            <Bar options={options} data={datas} />
          ) : (
            <>Loading</>
          )}
        </Container>
        <Fab sx={{ marginBottom: '10px', backgroundColor: 'white' }}>
          <QuestionBox questions={presentQuestions} />
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

export default PresentationHost;
