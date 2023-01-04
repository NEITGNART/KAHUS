import React, { lazy, Suspense, useEffect } from 'react';
import {
  Navigate,
  useLocation,
  useRoutes,
  useSearchParams
} from 'react-router-dom';

// guard
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import AuthGuard from '../guards/AuthGuard';
// layouts
// ----------------------------------------------------------------------
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layout/dashboard';
import axios from '../utils/axios';
import PresentationAudience from '../components/Presentation';
import PresentationHost from '../components/PresentationHost';
import PresentationGroup from '../components/PresentationGroup';
import RoleBasedGuard from '../guards/RoleBasedGuard';
import GlobalAlert from '../layout/dashboard/GlobalAlert';
import RoleBasedGuardClassPage from '../guards/RoleBasedGuardClassPage';
// ----------------------------------------------------------------------

const Loadable = (Component) =>
  function (props) {
    const { pathname } = useLocation();
    return (
      <Suspense
        fallback={
          <LoadingScreen isDashboard={pathname.includes('/dashboard')} />
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };

Verify.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  status: PropTypes.string
};

function Verify({ children, message, status }) {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    enqueueSnackbar(message, {
      variant: status
    });
  }, []);
  return <>{children}</>;
}

// eslint-disable-next-line react/prop-types
InviteClassRoom.propTypes = {
  children: PropTypes.node
};

function InviteClassRoom({ children }) {
  // get classId from url
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { enqueueSnackbar } = useSnackbar();

  // const { isLoading, isError } = useQuery({
  //   queryKey: ['addMember'],
  //   queryFn: async () => {
  //     const response = await axios
  //       .post('/api/group/join-link', {
  //         token
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });
  //     return response.data;
  //   }
  // });

  useEffect(() => {
    const sendInvite = async () => {
      const response = await axios
        .post('/api/group/join-link', {
          token
        })
        .then((data) => {
          enqueueSnackbar('Join group successfully', {
            variant: 'success'
          });
        })
        .catch((err) => {
          enqueueSnackbar('You already in the group', {
            variant: 'error'
          });
        });
      return response.data;
    };
    sendInvite();
  }, []);

  return <>{children}</>;
}

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'login/success',
          element: (
            <Verify message="Verify account successfully" status="success">
              <Login />
            </Verify>
          )
        },
        {
          path: 'register',
          element: <Register />
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <GlobalAlert />
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <Navigate to="/dashboard/classroom" replace />,
          index: true
        },
        {
          path: 'classroom',
          children: [
            {
              element: <Navigate to="/dashboard/classroom/classes" replace />,
              index: true
            },
            {
              path: 'classes',
              element: (
                <>
                  <ClassroomList />
                </>
              )
            },
            {
              path: 'classes/join',
              element: (
                <>
                  <InviteClassRoom>
                    <ClassroomList />
                  </InviteClassRoom>
                </>
              )
            },
            { path: 'create', element: <CreateClass /> },
            {
              path: 'class/:classId',
              element: (
                <>
                  <RoleBasedGuardClassPage
                    accessibleRoles={['member', 'owner', 'co-owner']}
                  >
                    <ClassroomPage />
                  </RoleBasedGuardClassPage>
                </>
              )
            },
            { path: 'member', element: <MemberList /> }
          ]
        },
        {
          path: 'user',
          children: [
            {
              element: <Navigate to="/dashboard/user/account" replace />,
              index: true
            },
            { path: 'account', element: <ProfileManagement /> }
          ]
        },
        {
          path: 'presentations',
          element: (
            <>
              <PresentationManagement />
            </>
          )
        }
      ]
    },
    {
      path: 'presentations',
      children: [
        {
          element: <Navigate to="/dashboard/presentations" replace />,
          index: true
        },
        {
          path: ':presentationId/edit',
          element: (
            <>
              <AuthGuard>
                <RoleBasedGuard accessibleRoles={['owner', 'collaborator']}>
                  <Presentation />
                </RoleBasedGuard>
              </AuthGuard>
            </>
          )
        }
      ]
    },
    {
      path: '/present/:code',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['owner', 'co-owner']}>
            <PresentationHost />
          </RoleBasedGuard>
        </AuthGuard>
      )
    },
    {
      path: '/present-audience/:code',
      element: <PresentationAudience />
    },
    {
      path: '/present-audience-group/:code',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['owner', 'co-owner', 'member']}>
            <PresentationGroup />
          </RoleBasedGuard>
        </AuthGuard>
      )
    },
    {
      path: '/',
      element: <Navigate to="/dashboard/classroom" replace />
    }
    // { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
// const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
//
// // MAIN
const ClassroomList = Loadable(
  lazy(() => import('../pages/dashboard/ClassroomList'))
);

const CreateClass = Loadable(
  lazy(() => import('../pages/dashboard/CreateClass'))
);

const ClassroomPage = Loadable(
  lazy(() => import('../pages/dashboard/ClassroomPage'))
);

const ProfileManagement = Loadable(
  lazy(() => import('../pages/dashboard/ProfileManagement'))
);

const MemberList = Loadable(
  lazy(() => import('../pages/dashboard/MemberList'))
);

const PresentationManagement = Loadable(
  lazy(() => import('../pages/dashboard/PresentationList'))
);

const Presentation = Loadable(
  lazy(() => import('../pages/dashboard/Prestation/PresentationEdit'))
);

const ResetPassword = Loadable(
  lazy(() => import('../pages/auth/ResetPassword'))
);
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
