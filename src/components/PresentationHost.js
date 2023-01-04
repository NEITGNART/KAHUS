import React, { useEffect, useRef, useState } from 'react';
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
import { Container, IconButton, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import QRCode from 'qrcode.react';
import { HOST_SK } from '../config';
import Iconify from './Iconify';
import axios from '../utils/axios';
import { SlideType } from '../pages/dashboard/Prestation/value/SlideType';
import ChatBox from '../sections/presentation/chat/ChatBox';
import { useDispatch } from '../redux/store';
import { onParticipantJoinChat, onReceiveMessage } from '../redux/slices/chat';
import QuestionBox from '../sections/presentation/question/QuestionBox';
import { ComingSoonIllustration } from '../assets';

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

function PresentationHost() {
  const [labels, setLabels] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(labels.map(() => 0));
  const [question, setQuestion] = useState('');
  const [slideType, setSlideType] = useState('');
  const [link, setLink] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState('');
  // const [currentSlide, setCurrentSlide] = useState(searchParams.get('slideIndex'));
  const { enqueueSnackbar } = useSnackbar();
  const { code } = useParams();
  const [presentQuestions, setPresentQuestions] = useState([]);
  const [newPresentQuestion, setNewPresentQuestion] = useState();
  const dispatch = useDispatch();
  const [endPresenting, setEndPresenting] = useState(false);
  // get query params from url
  const totalSlide = searchParams.get('max') || 0;
  let slideIndex = Number(searchParams.get('slideIndex'));
  let isPresenting;
  const roomCode = code || '123456';

  useEffect(() => {
    axios.get(`api/presentation/code/${code}`).then((res) => {
      if (res.data === undefined || res.data === null) {
        return;
      }
      setPresentQuestions([...res.data.questions, ...presentQuestions]);
    });
  }, []);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (endPresenting) {
      video.currentTime = 0;
      video.play();

      // pause the video after two seconds
      const interval = setInterval(() => {
        if (video.currentTime >= 1.8) {
          video.pause();
          clearInterval(interval);
        }
      }, 50);
    }
  }, [endPresenting]);

  useEffect(() => {
    const filteredPresentQuestions = presentQuestions.filter(
      (presentQuestion) => presentQuestion.id !== newPresentQuestion.id
    );
    setPresentQuestions([...filteredPresentQuestions, newPresentQuestion]);
  }, [newPresentQuestion]);

  useEffect(() => {
    socket = io(HOST_SK);
    socket.on('connect', () => {
      socket.emit('join', { room: roomCode, slideIndex });

      socket.on('not-start', () => {
        isPresenting = false;
        enqueueSnackbar('Waiting for the owner to start', { variant: 'error' });
        setSlideType(SlideType.START);
        setQuestion('Waiting for the owner to start');
        setContent('');
      });

      socket.on('chart', (data) => {
        isPresenting = true;
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
          setLink(data.link);
          setEndPresenting(false);
        }
      });

      socket.on('vote', (data) => {
        if (data) {
          setNumberAnswer(data.numberAnswer);
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
          setQuestion(data.question);
          slideIndex = data.slideIndex;
          setEndPresenting(false);
        }
      });

      socket.on('receiveMsg', (data) => {
        if (data) {
          enqueueSnackbar('There is new message', { variant: 'success' });
          dispatch(onReceiveMessage(data));
        }
      });

      socket.on('end-presentation', () => {
        console.log('end presentation');
        setEndPresenting(true);
        setContent('You have reached the end of the presentation');
        setQuestion('Presentation is ended');
        setSlideType(SlideType.END);
      });

      socket.on('newParticipantJoinChat', (data) => {
        if (data) {
          dispatch(onParticipantJoinChat(data));
        }

        // socket.on('duplicate', () => {
        //   console.log('duplicate');
        //   enqueueSnackbar('Duplicate code', { variant: 'error' });
        // });
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
      socket.off('receiveMsg');
      socket.off('newParticipantJoinChat');
      socket.off('end-presentation');
      // socket.off('duplicate');
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
          if (isPresenting) {
            if (slideIndex > 0) slideIndex -= 1;
            console.log(slideIndex);
            changeSlide(slideIndex);
          }
          break;
        case 39:
          // Need to restrict number of slide by number of slide in deck
          // if reach the end of slide, emit event to end presentation
          if (isPresenting) {
            if (slideIndex === totalSlide - 1) {
              socket.emit('end-presentation');
              break;
            }
            if (slideIndex < totalSlide - 1) slideIndex += 1;
            changeSlide(slideIndex);
          }
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

  let renderSlide;

  if (slideType === SlideType.MULTIPLE_CHOICE) {
    renderSlide = (
      <Container sx={{ width: '80%' }}>
        <Bar options={options} data={datas} />
      </Container>
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
  } else if (slideType === SlideType.START) {
    renderSlide = (
      <div>
        <ComingSoonIllustration sx={{ my: 10, height: 240 }} />
        <Text color="#212B36" fontSize={32}>
          {content}
        </Text>
      </div>
    );
  } else if (slideType === SlideType.END) {
    renderSlide = (
      <>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        {endPresenting && (
          <>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video ref={videoRef} height="70%">
              <source
                src="https://mentimeter-static.s3.amazonaws.com/static/images/mentilogo-black.mp4"
                type="video/mp4"
              />
            </video>
            <Typography variant="h1" color="white" textAlign="center">
              KAHUS
            </Typography>
          </>
        )}
        <Text fontSize={32} textAlign="center">
          {content}
        </Text>
      </>
    );
  } else {
    renderSlide = <div>Waiting</div>;
  }

  const onSendMessageSocket = (data) => {
    socket.emit('sendMsg', data);
  };

  const handleUpdateQuestion = (data) => {
    socket.emit('update-question', data);
  };

  return (
    <Deck template={template}>
      <Slide
        backgroundColor={slideType === SlideType.END ? 'dark' : 'white'}
        slideNum={1}
      >
        {!endPresenting && (
          <div>
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
                    enqueueSnackbar('copy link success', {
                      variant: 'success'
                    });
                  }}
                >
                  <Iconify icon="eva:copy-outline" />
                </IconButton>
              </CopyToClipboard>
              <QRCode value={link} style={{ height: '50px', width: '60px' }} />
            </Typography>
          </div>
        )}

        {slideType === SlideType.END ? (
          <div />
        ) : (
          <Heading
            fontSize="50px"
            textAlign={
              // eslint-disable-next-line no-nested-ternary
              slideType === SlideType.END
                ? 'center'
                : slideType === SlideType.START
                ? 'center'
                : 'left'
            }
            color="#212B36"
            padding="0px"
            margin="0px"
          >
            {question}
          </Heading>
        )}

        {renderSlide}
        <Box
          sx={{
            display: 'contents',
            position: 'absolute',
            marginBottom: '10px',
            backgroundColor: 'white'
          }}
        >
          <QuestionBox
            questions={presentQuestions}
            onUpdateQuestion={handleUpdateQuestion}
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

export default PresentationHost;
