import { SlideType } from './SlideType';
import { multipleChoiceSlide } from './MultipleChoiceSlide';
import { headingSlide } from './HeadingSlide';
import { paragraphSlide } from './ParagraphSlide';

export const SlideFactory = {
  createNew(slideType, id = 0) {
    switch (slideType) {
      case SlideType.MULTIPLE_CHOICE:
        return multipleChoiceSlide(id);
      case SlideType.HEADING:
        return headingSlide(id, 'Heading slide', 'Write your content');
      case SlideType.PARAGRAPH:
        return paragraphSlide(id, 'Paragraph slide', 'Write your content');
      default:
        throw new Error('The slide type is supported!');
    }
  }
};
