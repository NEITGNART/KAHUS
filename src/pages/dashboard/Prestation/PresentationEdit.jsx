import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Grid,
  List,
  Stack,
  Typography
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DashboardHeader from '../../../layout/dashboard/header';
import './Prestation.scss';
import { HEADER, NAVBAR } from '../../../config';
import SlideItem from '../../../sections/presentation/slideItem/SlideItem';
import SlideReport from '../../../sections/presentation/slideReport/SlideReport';
import SlideForm from '../../../sections/presentation/SlideForm/SlideForm';
import presentationData from '../../../_mock/presentation_data';
import Scrollbar from '../../../components/Scrollbar';

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

export default function PresentationEdit() {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState(presentationData.slides);
  const [currentSelect, setCurrentSelect] = useState(0);

  useEffect(() => {
    console.log(currentSelect);
  }, [currentSelect]);

  const onChangeQuestion = (slideId, question) => {
    const newState = slides.map((slide) => {
      if (slideId === slide.id) {
        return { ...slide, question };
      }
      return slide;
    });

    setSlides(newState);
  };

  const onChangeOption = (slideId, option) => {
    const newState = slides.map((slide) => {
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
    setSlides(newState);
    console.log(newState);
  };

  const onSlideItemClick = (index) => {
    setCurrentSelect(index);
  };

  const addNewSlide = () => {
    const { length } = slides || { length: 0 };
    const id = length > 0 ? slides[length - 1].id + 1 : 0;
    const slide = {
      id,
      question: '',
      options: [
        { id: 1, content: 'Option 1', isCorrect: false },
        { id: 2, content: 'Option 2', isCorrect: false },
        { id: 3, content: 'Option 3', isCorrect: false }
      ]
    };

    setSlides([...slides, slide]);
    setCurrentSelect(length);
  };

  const removeSelectedSlide = () => {
    setSlides(
      slides.filter(
        (slide) =>
          slides[currentSelect] && slide.id !== slides[currentSelect].id
      )
    );
    if (currentSelect - 1 >= 0) {
      setCurrentSelect(currentSelect - 1);
    } else if (slides.length > 0) {
      setCurrentSelect(0);
    } else {
      setCurrentSelect(null);
    }
  };

  function addNewOptionToSlide(newOption) {
    const { id: slideId } = slides[currentSelect];
    const newState = slides.map((slide) => {
      if (slideId === slide.id) {
        const { length } = slide.options || { length: 0 };
        newOption.id = length > 0 ? slide.options[length - 1].id + 1 : 0;
        slide.options = [...slide.options, newOption];
      }
      return slide;
    });
    setSlides(newState);
  }

  const deleteOptionFromSlide = (deleteOptionId) => {
    const { id: slideId } = slides[currentSelect];
    const newState = slides.map((slide) => {
      if (slideId === slide.id) {
        slide.options = slide.options.filter(
          (option) => option.id !== deleteOptionId
        );
        console.log(deleteOptionId);
      }
      return slide;
    });
    setSlides(newState);
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
              <Button onClick={addNewSlide}>
                <Add /> Add new
              </Button>
            </Stack>
          </Box>
          <Divider />
          <Scrollbar>
            <List disablePadding>
              {slides.map((slide, index) => (
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
            <Typography> Presentation`s Name</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Button> Save </Button>
              <Button> Present </Button>
            </Box>
          </Box>
          <Divider />
          <Grid container alignContent="stretch" spacing={2}>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid item xs>
              <SlideReport />
            </Grid>
            <Grid item xs={3}>
              {slides[currentSelect] && (
                <SlideForm
                  slide={slides[currentSelect]}
                  onChangeQuestion={onChangeQuestion}
                  onChangeOption={(optionChange) =>
                    onChangeOption(slides[currentSelect].id, optionChange)
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
    </>
  );
}
