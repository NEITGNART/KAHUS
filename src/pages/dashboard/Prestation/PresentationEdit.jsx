import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Grid,
  List,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';
import DashboardHeader from '../../../layout/dashboard/header';
import './Prestation.scss';
import { HEADER, HOST_SK, NAVBAR } from '../../../config';
import SlideItem from '../../../sections/presentation/slideItem/SlideItem';
import SlideReport from '../../../sections/presentation/slideReport/SlideReport';
import SlideForm from '../../../sections/presentation/SlideForm/SlideForm';
import Scrollbar from '../../../components/Scrollbar';
import axios from '../../../utils/axios';
import Iconify from '../../../components/Iconify';
import { SlideType } from './value/SlideType';
import { SlideFactory } from './value/SlideFactory';

const BarSubmitContainer = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column'
});

const BarSubmit = styled('div')(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: 1
}));

const socket = io(HOST_SK);

const presentationStart = async (groupId, link, presentationId) => {
  if (groupId) {
    await axios
      .post(`api/group/presentation-start`, {
        presentationId,
        groupId,
        link
      })
      .then((res) => {
        if (res.data) {
          socket.emit('presentation-started', {
            groupId,
            message: `Presentation started in group ${res.data.name}, please join!`
          });
        }
      });
  } else {
    await axios.post(`api/presentation/presentation-stop`, {
      presentationId
    });
  }
};

const presentationStop = async (groupId, presentationId) => {
  if (groupId) {
    await axios
      .post(`api/group/presentation-stop`, {
        presentationId,
        groupId
      })
      .then((res) => {
        // if (res.data) {
        //   socket.emit('presentation-started', {
        //     groupId,
        //     message: `Presentation started in group ${res.data.name}, please join!`
        //   });
        // }
      });
  } else {
    await axios.post(`api/presentation/presentation-stop`, {
      presentationId
    });
  }
};

/* A function that is exported by default. */
export default function PresentationEdit() {
  const { presentationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get('code');
  const group = searchParams.get('group');
  const [presentation, setPresentation] = useState(null);
  const [currentSelect, setCurrentSelect] = useState(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const slideTypeDialogOpen = Boolean(anchorEl);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`api/presentation/${presentationId}`)
      .then((res) => {
        setPresentation(res.data);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
        navigate('/dashboard/presentations', { replace: true });
      });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', {
        room: code,
        slideIndex: 0
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    socket.on('vote', (data) => {
      console.log('vote', data);
      if (data) {
        setPresentation((prev) => {
          const newPresentation = { ...prev };
          data.numberAnswer.forEach((number, index) => {
            if (newPresentation.slides[currentSelect]?.options[index]) {
              newPresentation.slides[currentSelect].options[
                index
              ].numberAnswer = number;
            }
          });
          return newPresentation;
        });
      }
    });

    return () => {
      socket.off('vote');
    };
  }, []);

  const onSave = () => {
    axios
      .post('api/presentation/update', presentation)
      .then((res) => {
        enqueueSnackbar('Saved!');
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
      });
  };

  const onPresent = async () => {
    await presentationStart(group, presentation.link, presentationId);
    onSave();
    window.open(
      `/present/${presentation.code}?max=${presentation.slides.length || 0}`,
      '_blank'
    );

    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.isPresenting = true;
      return newPresentation;
    });
  };

  const onStopPresent = async () => {
    await presentationStop(group, presentationId);
    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.isPresenting = false;
      return newPresentation;
    });
  };

  const onChangeQuestion = (slideId, question) => {
    const newState = presentation.slides.map((slide) => {
      if (slideId === slide.id) {
        return { ...slide, question };
      }
      return slide;
    });

    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = newState;
      return newPresentation;
    });
  };

  const onChangeContent = (slideId, content) => {
    const newState = presentation.slides.map((slide) => {
      if (slideId === slide.id) {
        return { ...slide, content };
      }
      return slide;
    });

    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = newState;
      return newPresentation;
    });
  };

  const onChangeOption = (slideId, option) => {
    const newState = presentation.slides.map((slide) => {
      if (slideId === slide.id) {
        slide.options = slide.options.map((opt) => {
          if (opt.id === option.id) {
            return { ...opt, ...option };
          }
          return opt;
        });
      }
      return slide;
    });
    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = newState;
      return newPresentation;
    });
  };

  const onSlideItemClick = (index) => {
    setCurrentSelect(index);
  };

  const onAddSlideButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
    // setSlideTypeDialogOpen(true);
  };

  const onCloseSlideTypeDialog = (selectedValue) => {
    // if (selectedValue === null) {
    //   return;
    // }
    setAnchorEl(null);
    // setSlideTypeDialogOpen(false);
  };

  const addNewSlide = (slideType) => {
    console.log(slideType);
    const { length } = presentation.slides || { length: 0 };
    const id = length > 0 ? presentation.slides[length - 1].id + 1 : 0;
    const slide = SlideFactory.createNew(slideType, id);

    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = [...newPresentation.slides, slide];
      return newPresentation;
    });
    setCurrentSelect(length);
    onCloseSlideTypeDialog(null);
  };

  const removeSelectedSlide = () => {
    setPresentation({
      ...presentation,
      slides: presentation.slides.filter(
        (slide) =>
          presentation.slides[currentSelect] &&
          slide.id !== presentation.slides[currentSelect].id
      )
    });
    if (currentSelect - 1 >= 0) {
      setCurrentSelect(currentSelect - 1);
    } else if (presentation.slides.length > 0) {
      setCurrentSelect(0);
    } else {
      setCurrentSelect(null);
    }
  };

  function addNewOptionToSlide(newOption) {
    const { id: slideId } = presentation.slides[currentSelect];
    const newState = presentation.slides.map((slide) => {
      if (slideId === slide.id) {
        const { length } = slide.options || { length: 0 };
        newOption.id = length > 0 ? slide.options[length - 1].id + 1 : 0;
        newOption.numberAnswer = 0;
        slide.options = [...slide.options, newOption];
      }
      return slide;
    });
    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = newState;
      return newPresentation;
    });
  }

  const deleteOptionFromSlide = (deleteOptionId) => {
    const { id: slideId } = presentation.slides[currentSelect];
    const newState = presentation.slides.map((slide) => {
      if (slideId === slide.id) {
        slide.options = slide.options.filter(
          (option) => option.id !== deleteOptionId
        );
        console.log(deleteOptionId);
      }
      return slide;
    });
    setPresentation((prev) => {
      const newPresentation = { ...prev };
      newPresentation.slides = newState;
      return newPresentation;
    });
  };

  return (
    <>
      <DashboardHeader
        onOpenSidebar={() => setOpen(true)}
        verticalLayout={true}
      />
      <Box
        sx={{
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT - 25}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT - 25}px`
          }
        }}
      />

      {presentation && (
        <Card sx={{ height: { md: '92vh' }, display: { md: 'flex' } }}>
          <Drawer
            variant="permanent"
            PaperProps={{
              sx: { width: NAVBAR.BASE_WIDTH, position: 'relative' }
            }}
          >
            <Box sx={{ p: 1 }}>
              <Stack justifyContent="center" direction="row">
                <Button onClick={removeSelectedSlide}>
                  <Close /> Delete
                </Button>
                <div>
                  <Button
                    id="add-slide-button"
                    aria-controls={
                      slideTypeDialogOpen ? 'slide-type-menu' : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={slideTypeDialogOpen ? 'true' : undefined}
                    onClick={(event) => onAddSlideButtonClick(event)}
                  >
                    <Add /> Add new
                  </Button>
                  <Menu
                    id="slide-type-menu"
                    aria-labelledby="add-slide-button"
                    anchorEl={anchorEl}
                    open={slideTypeDialogOpen}
                    onClose={() => onCloseSlideTypeDialog(null)}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    sx={{
                      mt: -1,
                      width: 170,
                      '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': { mr: 1 }
                      }
                    }}
                  >
                    <MenuItem
                      onClick={() => addNewSlide(SlideType.MULTIPLE_CHOICE)}
                    >
                      <Iconify icon="material-symbols:select-check-box" />{' '}
                      Multiple choice
                    </MenuItem>
                    <MenuItem onClick={() => addNewSlide(SlideType.HEADING)}>
                      <Iconify icon="humbleicons:heading" /> Heading
                    </MenuItem>
                    <MenuItem onClick={() => addNewSlide(SlideType.PARAGRAPH)}>
                      <Iconify icon="teenyicons:paragraph-outline" /> Paragraph
                    </MenuItem>
                  </Menu>
                </div>
              </Stack>
            </Box>
            <Divider />
            <Scrollbar>
              <List disablePadding>
                {presentation.slides.map((slide, index) => (
                  <SlideItem
                    isSelected={currentSelect === index}
                    /* eslint-disable-next-line react/no-array-index-key */
                    key={index}
                    index={index}
                    slide={slide}
                    onClick={onSlideItemClick}
                  />
                ))}
              </List>
            </Scrollbar>
          </Drawer>

          <BarSubmitContainer>
            <Box sx={{ p: 1, display: 'flex' }}>
              <Typography> {presentation.title}</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <Button onClick={onSave}> Save </Button>
                {presentation.isPresenting ? (
                  <Button onClick={onStopPresent}> Stop Present </Button>
                ) : (
                  <Button onClick={onPresent}> Present </Button>
                )}
              </Box>
            </Box>
            <Divider />
            <Grid container alignContent="stretch" spacing={2}>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Grid item xs>
                {presentation?.slides[currentSelect] ? (
                  <SlideReport
                    roomCode={presentation.code}
                    slide={presentation.slides[currentSelect]}
                    link={presentation.link}
                  />
                ) : (
                  <Container
                    sx={{ padding: '20px', pb: '50px', height: '100%' }}
                  >
                    <Box sx={{ bgcolor: '#cfe8fc', height: '100%' }} />
                  </Container>
                )}
              </Grid>
              <Grid item xs={3}>
                {presentation.slides[currentSelect] && (
                  <SlideForm
                    slide={presentation.slides[currentSelect]}
                    onChangeQuestion={onChangeQuestion}
                    onChangeContent={onChangeContent}
                    onChangeOption={(optionChange) =>
                      onChangeOption(
                        presentation.slides[currentSelect].id,
                        optionChange
                      )
                    }
                    onAddOptionButtonClick={(newOption) =>
                      addNewOptionToSlide(newOption)
                    }
                    onDeleteOptionClick={(deleteOptionId) =>
                      deleteOptionFromSlide(deleteOptionId)
                    }
                  />
                )}
              </Grid>
            </Grid>
          </BarSubmitContainer>
        </Card>
      )}
    </>
  );
}
