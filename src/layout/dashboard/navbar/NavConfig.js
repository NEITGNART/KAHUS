// routes
import { PATH_DASHBOARD, PATH_PRESENTATION } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const navConfig = [
  // @GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     {
  //       title: 'Classroom',
  //       path: PATH_DASHBOARD.general.classroom,
  //       icon: ICONS.banking,
  //       children: [
  //         { title: 'Classes', path: PATH_DASHBOARD.general.classroom },
  //         { title: 'Create', path: PATH_DASHBOARD.general.create }
  //       ]
  //     }
  //   ]
  // },

  // @MANAGEMENT
  {
    subheader: 'management',
    items: [
      {
        title: 'My account',
        path: PATH_DASHBOARD.user.account,
        icon: ICONS.user
      },
      {
        title: 'My presentations',
        path: PATH_DASHBOARD.presentation.presentations,
        icon: ICONS.kanban
      }
    ]
  }
];

export default navConfig;
