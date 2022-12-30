import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import socket from '../../utils/socket';
import axios from '../../utils/axios';

function GlobalAlert() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getGroups = async () => {
      const accessToken = window.localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          const response = await axios.get('/api/group/get-all-groups');
          socket.emit('joinGroup', response.data);
        } catch (error) {
          enqueueSnackbar(error.message, {
            variant: 'error'
          });
        }
      }
    };
    socket.on('presentation-started', (message) => {
      enqueueSnackbar(message, {
        variant: 'info'
      });
    });
    getGroups();
    return () => {
      socket.off('connect');
      socket.off('presentation-started');
    };
  }, []);

  return <></>;
}

export default GlobalAlert;
