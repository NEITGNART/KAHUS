import { SlideType } from './SlideType';

export function headingSlide(id, title, content) {
  return {
    id,
    type: SlideType.HEADING,
    question: title,
    content
  };
}
