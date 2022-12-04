import { Fragment, useEffect, useState } from 'react';
import { Box, Button, Divider, Grid, Stack } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import DashboardHeader from '../../../layout/dashboard/header';
import './Prestation.scss';
import { HEADER } from '../../../config';
import NavbarHorizontal from '../../../layout/dashboard/navbar/NavbarHorizontal';
import Scrollbar from '../../../components/Scrollbar';
import SlideItem from '../../../sections/presentation/slideItem/SlideItem';
import SlideReport from '../../../sections/presentation/slideReport/SlideReport';
import SlideForm from '../../../sections/presentation/SlideForm/SlideForm';
import presentationData from '../../../_mock/presentation_data';

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
    const newSlides = [...slides];
    const newState = newSlides.map((slide) => {
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

  return (
    <>
      <DashboardHeader
        onOpenSidebar={() => setOpen(true)}
        verticalLayout={true}
      />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`
          },
          pb: {
            xs: `20px`,
            lg: `20px`
          }
        }}
      >
        <Button> Save </Button>
        <Button> Present </Button>
      </Stack>
      <Grid container alignContent="stretch" spacing={2}>
        <Grid className="" item xs={2}>
          <Stack>
            <Stack justifyContent="center" direction="row">
              <Button onClick={removeSelectedSlide}>
                <Close /> Delete
              </Button>
              <Button onClick={addNewSlide}>
                <Add /> Add new
              </Button>
            </Stack>
            <Stack spacing={1}>
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
            </Stack>
          </Stack>
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid item xs>
          <SlideReport />
        </Grid>
        <Grid item xs={3}>
          {slides[currentSelect] && (
            <SlideForm
              slide={slides[currentSelect]}
              onChangeQuestion={onChangeQuestion}
              onChangeOption={onChangeOption}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
