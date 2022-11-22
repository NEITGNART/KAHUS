import { Suspense, lazy, useState } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// guard
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import AuthGuard from '../guards/AuthGuard';
import HomePage from '../pages/Home';
// layouts

// ----------------------------------------------------------------------

import LoadingScreen from '../components/LoadingScreen';
import { PATH_AFTER_LOGIN } from '../config';
import DashboardLayout from '../layout/dashboard';
import { ROOTS_DASHBOARD } from './paths';
import useAuth from '../hooks/useAuth';
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

SuccessVerify.propTypes = {
  children: PropTypes.node
};

function SuccessVerify({ children }) {
  const { isInitialized } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  if (isInitialized) {
    enqueueSnackbar('Verify success', {
      variant: 'success'
    });
  }
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
            <SuccessVerify>
              <Login />
            </SuccessVerify>
          )
        },
        {
          path: 'register',
          element: <Register />
        }
      ]
    },
    {
      path: 'dashboard',
      element: (
        // <AuthGuard>
        <DashboardLayout />
        // </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/classes" replace />, index: true },
        { path: 'classes', element: <ClassroomList /> },
        { path: 'classes/create', element: <CreateClass /> },
        { path: 'user/account', element: <ProfileManagement /> }
      ]
    },
    {
      path: '/',
      element: <Navigate to="/dashboard/classes" replace />
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

const ProfileManagement = Loadable(
  lazy(() => import('../pages/dashboard/ProfileManagement'))
);
