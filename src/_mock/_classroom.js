import _mock from './_mock';
import { fullName } from './name';
import { randomNumberRange, randomInArray } from './funcs';

// ----------------------------------------------------------------------

// eslint-disable-next-line no-underscore-dangle
export const _classroomCards = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  hostAvatarUrl: _mock.image.avatar(index),
  cover: _mock.image.cover(index),
  name: _mock.name.fullName(index),
  hostId: randomNumberRange(999, 99999),
  hostName: fullName[randomNumberRange(0, 10)]
}));
