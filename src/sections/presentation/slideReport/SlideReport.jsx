import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography
} from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import Iconify from '../../../components/Iconify';
import { ClassroomLink } from '../../@dashboard/classroom/room';

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
  },
  animation: false
};

SlideReport.propTypes = {
  slide: PropTypes.object,
  link: PropTypes.string
};

export default function SlideReport({ slide, link }) {
  const numberAnswer = slide.options.map((option) => option.numberAnswer);
  const { enqueueSnackbar } = useSnackbar();
  const labels = slide.options.map((option) => option.content);
  const [toggle, setToggle] = useState(false);
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
    <Container sx={{ padding: '20px', pb: '50px', height: '100%' }}>
      <Typography
        variant="body2"
        noWrap
        textAlign="center"
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

      <Typography variant="h2" noWrap textAlign="left">
        {slide.question}
      </Typography>
      <Container sx={{ height: '80%' }}>
        <Bar options={options} data={datas} />
      </Container>
    </Container>
  );
}
