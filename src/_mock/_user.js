import _mock from './_mock';
import { randomNumberRange, randomInArray } from './funcs';

// ----------------------------------------------------------------------

// eslint-disable-next-line no-underscore-dangle
export const _userList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
  address: '908 Jack Locks',
  country: _mock.address.country(index),
  state: 'Virginia',
  city: 'Rancho Cordova',
  zipCode: '85807',
  company: _mock.company(index),
  isVerified: _mock.boolean(index),
  status: randomInArray(['active', 'banned']),
  role: _mock.role(index)
}));

// eslint-disable-next-line no-underscore-dangle
export const _userFeeds = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  author: {
    id: _mock.id(8),
    avatarUrl: _mock.image.avatar(1),
    name: 'Caitlyn Kerluke'
  },
  isLiked: true,
  createdAt: _mock.time(index),
  media: _mock.image.feed(index),
  message: _mock.text.sentence(index),
  // eslint-disable-next-line no-shadow
  personLikes: [...Array(36)].map((_, index) => ({
    name: _mock.name.fullName(index),
    avatarUrl: _mock.image.avatar(index + 2)
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(randomInArray([2, 3, 4, 5, 6]) || 2),
        name: _mock.name.fullName(index + 5)
      },
      createdAt: _mock.time(2),
      message: 'Praesent venenatis metus at'
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(randomInArray([7, 8, 9, 10, 11]) || 7),
        name: _mock.name.fullName(index + 6)
      },
      createdAt: _mock.time(3),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.'
    }
  ]
}));

// eslint-disable-next-line no-underscore-dangle
export const _userMembers = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  firstName: _mock.name.fullName(index).split(' ')[0],
  lastName: _mock.name.fullName(index).split(' ')[1],
  role: _mock.role(index)
}));

// eslint-disable-next-line no-underscore-dangle
export const _userAbout = {
  id: _mock.id(1),
  cover: _mock.image.cover(1),
  position: 'UI Designer',
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  country: _mock.address.country(1),
  email: _mock.email(1),
  company: _mock.company(1),
  school: _mock.company(2),
  role: 'Manager'
};
