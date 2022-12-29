// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
export const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_PRESENTATION = '/presentations';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    classroom: path(ROOTS_DASHBOARD, '/classroom/classes'),
    create: path(ROOTS_DASHBOARD, '/classroom/create'),
    detailClassroom: (id) => path(ROOTS_DASHBOARD, `/classroom/class/${id}`)
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  presentation: {
    presentations: path(ROOTS_DASHBOARD, '/presentations')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`)
  }
};

export const PATH_PRESENTATION = {
  root: ROOTS_PRESENTATION,
  presentation: {
    editPresentation: (id, code) =>
      path(ROOTS_PRESENTATION, `/${id}/edit?code=${code}`)
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
