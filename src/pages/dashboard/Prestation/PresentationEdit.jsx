import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import useAuth from '../../../hooks/useAuth';
import LoadingScreen from '../../../components/LoadingScreen';
import { useDispatch } from '../../../redux/store';

const BarSubmitContainer = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column'
});

const MyDrawer = styled(Drawer, {
  // when the screen is smaller, take the full width
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
    backgroundColor: theme.palette.background.default,
    border: 'none',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }, // take it fullwidth when size is small,
  [theme.breakpoints.down('sm')]: {
    '& .MuiDrawer-paper': {
      width: '100%'
    }
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiDrawer-paper': {
      width: '100%'
    }
  }
}));

let socket;

const forcePresentation = async (
  groupId,
  link,
  presentationId,
  presentLink,
  callbackSuccess
) => {
  await axios
    .post(`api/group/presentation-start-confirm`, {
      presentationId,
      groupId,
      link,
      presentLink
    })
    .then((res) => {
      if (res.data) {
        socket.emit('presentation-started', {
          groupId,
          message: `Presentation started in group ${res.data.name}, please join!`
        });
        callbackSuccess(res.data.code);
      }
    });
};

const presentationStart = async (
  groupId,
  memberLink,
  presentationId,
  hostLink,
  callbackSuccess,
  callbackFailure
) => {
  if (groupId) {
    await axios
      .post(`api/group/presentation-start`, {
        presentationId,
        groupId,
        link: memberLink,
        presentLink: hostLink
      })
      .then((res) => {
        if (res.data) {
          socket.emit('presentation-started', {
            groupId,
            message: `Presentation started in group ${res.data.name}, please join!`
          });
          callbackSuccess();
        }
      })
      .catch((error) => {
        callbackFailure(error.code);
      });
  } else {
    await axios.post(`api/presentation/presentation-start`, {
      presentationId
    });
    callbackSuccess();
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
        socket.emit('presentation-end');
      });
  } else {
    await axios.post(`api/presentation/presentation-stop`, {
      presentationId
    });
    socket.emit('presentation-end');
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
  const [role, setCurrentRole] = useState('collaborator');
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .post(`api/presentation/get-role`, {
        presentationId
      })
      .then((res) => {
        setCurrentRole(res.data.role);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
        navigate('/dashboard/presentations', { replace: true });
      });
  }, []);

  useEffect(() => {
    axios
      .post(`api/presentation/get-presentation`, {
        presentationId
      })
      .then((res) => {
        setPresentation(res.data);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
        navigate('/dashboard/presentations', { replace: true });
      });
  }, []);

  useEffect(() => {
    socket = io(HOST_SK);
    socket.on('connect', () => {
      socket.emit('join', {
        room: code,
        slideIndex: 0
      });

      socket.on('present-start', () => {
        console.log('hello');
        enqueueSnackbar(
          'The presentation has started, so you cannot edit at this time.',
          { variant: 'success' }
        );
        setPresentation((prev) => {
          const newPresentation = { ...prev };
          newPresentation.isPresenting = true;
          return newPresentation;
        });
      });
      socket.on('present-end', () => {
        console.log('end');
        enqueueSnackbar('The presentation has ended, so now you can edit.', {
          variant: 'success'
        });
        setPresentation((prev) => {
          const newPresentation = { ...prev };
          newPresentation.isPresenting = false;
          return newPresentation;
        });
      });
    });

    return () => {
      socket.off('connect');
      socket.off('present-start');
      socket.off('present-end');
    };
  }, []);

  useEffect(() => {
    socket.on('vote', (data) => {
      if (data) {
        const { slideIndex } = data;
        if (presentation?.isPresenting) {
          setPresentation((prev) => {
            const newPresentation = { ...prev };
            data.numberAnswer.forEach((number, index) => {
              newPresentation.slides[slideIndex].options[index].numberAnswer =
                number;
            });
            return newPresentation;
          });
        }
      }
    });

    return () => {
      socket.off('vote');
    };
  }, [presentation]);

  if (!presentation) {
    return <LoadingScreen />;
  }

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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function presentLink() {
    if (group) {
      return `${window.location.origin}/present/${presentation.code}?max=${
        presentation.slides.length || 0
      }&groupId=${group}`;
    }
    return `${window.location.origin}/present/${presentation.code}?max=${
      presentation.slides.length || 0
    }`;
  }

  const onConfirmPresent = () => {
    const link = presentLink();

    const cb = (codePresentation) => {
      socket.emit('overwrite-presentation', {
        room: `${codePresentation}`
      });
      socket.emit('present-start');
      onSave();
      openNewWindow();
    };

    forcePresentation(group, presentation.link, presentationId, link, cb);
    handleClose();
  };

  function openNewWindow() {
    if (group) {
      window.open(
        `/present/${presentation.code}?max=${
          presentation.slides.length || 0
        }&groupId=${group}`,
        '_blank'
      );
    } else {
      window.open(
        `/present/${presentation.code}?max=${presentation.slides.length || 0}`,
        '_blank'
      );
    }
  }

  const openPresent = () => {
    openNewWindow();
  };

  const callbackSuccess = () => {
    // this one is for realtime update
    socket.emit('present-start');
    onSave();
    openNewWindow();
  };

  const callbackFailure = () => {
    handleClickOpen();
  };

  const onPresent = async () => {
    const hostLink = presentLink();
    await presentationStart(
      group,
      presentation.link,
      presentationId,
      hostLink,
      callbackSuccess,
      callbackFailure
    );
  };

  const onStopPresent = async () => {
    await presentationStop(group, presentationId);
    socket.emit('present-end');
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

  // if is owner then check condition if it's presenting or not

  let renderButton;
  if (role === 'owner') {
    if (presentation.isPresenting) {
      renderButton = (
        <>
          <Button onClick={onStopPresent}>Stop Present</Button>
          <Button onClick={openPresent}>Open Present</Button>
        </>
      );
    } else {
      renderButton = (
        <>
          <Button onClick={onSave}> Save </Button>
          <Button onClick={onPresent}> Present </Button>
        </>
      );
    }
  } else if (!presentation.isPresenting) {
    renderButton = (
      <>
        <Button onClick={onSave}> Save </Button>
      </>
    );
  }

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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          This group has another presentation that is being presented
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you certain that you wish to present this material? Another
            presentation will be terminated as a result.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirmPresent} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {presentation && (
        <Card sx={{ height: { md: '92vh' }, display: { md: 'flex' } }}>
          <MyDrawer
            variant="permanent"
            PaperProps={{
              sx: { width: NAVBAR.BASE_WIDTH, position: 'relative' }
            }}
          >
            {!presentation.isPresenting && (
              <>
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
                        <MenuItem
                          onClick={() => addNewSlide(SlideType.HEADING)}
                        >
                          <Iconify icon="humbleicons:heading" /> Heading
                        </MenuItem>
                        <MenuItem
                          onClick={() => addNewSlide(SlideType.PARAGRAPH)}
                        >
                          <Iconify icon="teenyicons:paragraph-outline" />{' '}
                          Paragraph
                        </MenuItem>
                      </Menu>
                    </div>
                  </Stack>
                </Box>
                <Divider />
              </>
            )}
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
          </MyDrawer>

          <BarSubmitContainer>
            <Box sx={{ p: 1, display: 'flex' }}>
              <Typography> {presentation.title}</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                {renderButton}
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
              {!presentation.isPresenting && (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
              )}
            </Grid>
          </BarSubmitContainer>
        </Card>
      )}
    </>
  );
}
