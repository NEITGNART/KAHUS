import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// guard
import AuthGuard from '../guards/AuthGuard';
import HomePage from '../pages/Home';
// layouts

// ----------------------------------------------------------------------

import LoadingScreen from '../components/LoadingScreen';
import { PATH_AFTER_LOGIN } from '../config';
import DashboardLayout from '../layout/dashboard';
import { ROOTS_DASHBOARD } from './paths';

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
          path: 'register',
          element: <Register />
        }
      ]
    },
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/classes" replace />, index: true },
        { path: 'classes', element: <ClassroomList /> }
      ]
    }
    // { path: '*', element: <Navigate to='/404' replace /> }
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
