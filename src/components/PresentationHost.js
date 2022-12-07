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
  Progress, Text
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
import { io } from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';
import { Container, IconButton, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { FormProvider } from './hook-form';
import RHFMyRadioGroup from './hook-form/RHFMyRadioGroup';
import { HOST_API } from '../config';
import Iconify from './Iconify';

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

const socket = io(HOST_API);

function PresentationHost() {
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [link, setLink] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const { code } = useParams();

  // get query params from url
  const slideIndex = searchParams.get('slideIndex');
  const roomCode = code || '123456';

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex: Number(slideIndex) });

      socket.on('chart', (data) => {
        setQuestion(data.question);
        setLabels(data.answer);
        setNumberAnswer(data.numberAnswer);
        setLink(data.link);
      });

      socket.on('vote', (data) => {
        setNumberAnswer(data.numberAnswer);
      });
    });

    return () => {
      socket.off('connect');
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
