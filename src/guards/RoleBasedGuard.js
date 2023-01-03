import PropTypes from 'prop-types';
import { Alert, AlertTitle, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Login from '../pages/auth/Login';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

const useCurrentRole = () => {
  return 'admin';
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { code } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const code1 = searchParams.get('code');
  const navigate = useNavigate();

  const validCode = code || code1;

  useEffect(() => {
    axios
      .post(`api/presentation/get-role-by-code`, {
        code: validCode
      })
      .then((response) => {
        const { role } = response.data;
        if (accessibleRoles.includes(role)) {
          setLoading(false);
          setRender(true);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar(error.message, { variant: 'error' });
        navigate('/dashboard/presentations', { replace: true });
      });
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (render) {
    return <>{children}</>;
  }

  return (
    <Container>
      <Alert severity="error">
        <AlertTitle>Permission Denied</AlertTitle>
        You do not have permission to access this page
      </Alert>
    </Container>
  );
}
