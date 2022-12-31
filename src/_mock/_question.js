import _mock from './_mock';

// eslint-disable-next-line no-underscore-dangle
export const _questions = [...Array(24)].map((_, index) => ({
  id: index.toString(),
  author: _mock.name.fullName(index),
  email: _mock.email(index),
  content: _mock.text.sentence(index),
  isAnswered: false
}));
