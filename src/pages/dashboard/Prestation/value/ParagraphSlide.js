import { SlideType } from './SlideType';

export function paragraphSlide(id, title, content) {
  return {
    id,
    type: SlideType.PARAGRAPH,
    question: title,
    content
  };
}
