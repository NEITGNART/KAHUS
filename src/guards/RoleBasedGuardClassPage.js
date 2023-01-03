import PropTypes from 'prop-types';
import { Alert, AlertTitle, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Login from '../pages/auth/Login';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

RoleBasedGuardClassPage.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuardClassPage({ accessibleRoles, children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { classId } = useParams();

  useEffect(() => {
    if (!user.email) return;
    const checkRole = async () => {
      const response = await axios.post('/api/group/get-role', {
        groupId: classId,
        email: user.email
      });
      const { role } = response.data;
      if (!accessibleRoles.includes(role)) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
      }
    };
    checkRole();
  }, [user]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
