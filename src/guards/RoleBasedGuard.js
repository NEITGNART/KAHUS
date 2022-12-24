import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router';
import Login from '../pages/auth/Login';
import useAuth from '../hooks/useAuth';
import PresentationGroup from '../components/PresentationGroup';
import LoadingScreen from '../components/LoadingScreen';

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
  const [displayChart, setDisplayChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const role = useCurrentRole();

  useEffect(() => {
    const checkRole = async () => {
      // create promise in 1 seconds
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('done!'), 1000);
      });
      // wait until the promise returns us a value
      const result = await promise;
      // "done!"
      if (accessibleRoles.includes(role)) {
        setLoading(false);
        setDisplayChart(true);
      } else {
        setLoading(false);
      }
    };
    checkRole();
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

  if (displayChart) {
    return <PresentationGroup />;
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
