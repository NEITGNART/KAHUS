import { Container, IconButton, Typography } from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import { Bar } from 'react-chartjs-2';
import React from 'react';
import { PropTypes } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { Text } from 'spectacle';
import Iconify from '../../../components/Iconify';
import { SlideType } from '../../../pages/dashboard/Prestation/value/SlideType';
import QuestionBox from '../question/QuestionBox';
import QuestionBoxClient from '../question/QuestionBoxClient';

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
  const numberAnswer = slide.options
    ? slide.options.map((option) => option.numberAnswer)
    : null;
  const { enqueueSnackbar } = useSnackbar();
  const labels = slide.options
    ? slide.options.map((option) => option.content)
    : null;

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

  let renderSlide;

  if (slide.type === undefined || slide.type === SlideType.MULTIPLE_CHOICE) {
    renderSlide = (
      <Container sx={{ height: '80%' }}>
        <Typography variant="h2" noWrap textAlign="left">
          {slide.question}
        </Typography>
        <Bar options={options} data={datas} />
      </Container>
    );
  } else if (slide.type === SlideType.HEADING) {
    renderSlide = (
      <>
        <Typography variant="h2" noWrap textAlign="left">
          {slide.question}
        </Typography>
        <Text color="#212B36" fontSize={48}>
          {slide.content}
        </Text>
      </>
    );
  } else if (slide.type === SlideType.PARAGRAPH) {
    renderSlide = (
      <>
        <Typography variant="h2" noWrap textAlign="left">
          {slide.question}
        </Typography>
        <Text color="#212B36" fontSize={32}>
          {slide.content}
        </Text>
      </>
    );
  }

  return (
    <Container sx={{ padding: '20px', pb: '50px', height: '100%' }}>
      <Typography variant="body2" noWrap textAlign="center">
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
      {renderSlide}
      <QuestionBox />
      <QuestionBoxClient />
    </Container>
  );
}
