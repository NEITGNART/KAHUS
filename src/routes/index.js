import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
// layouts

// ----------------------------------------------------------------------

const Loadable = (Component) =>
  function (props) {
    const { pathname } = useLocation();

    return (
      <Suspense>
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
      path: '/',
      element: <HomePage />
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
// const HomePage = Loadable(lazy(() => import('../pages/Home')));
