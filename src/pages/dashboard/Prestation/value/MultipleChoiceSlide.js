import { SlideType } from './SlideType';

export function multipleChoiceSlide(id) {
  return {
    id,
    type: SlideType.MULTIPLE_CHOICE,
    question: '',
    options: [
      { id: 1, content: 'Option 1', isCorrect: false, numberAnswer: 0 },
      {
        id: 2,
        content: 'Option 2',
        isCorrect: false,
        numberAnswer: 0
      },
      { id: 3, content: 'Option 3', isCorrect: false, numberAnswer: 0 }
    ]
  };
}
