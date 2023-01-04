import { createContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import { v4 as uuid } from 'uuid';
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  deviceId: uuid(),
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  googleLogin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: JSON.parse(window.localStorage.getItem('user'))
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };
    initialize();
  }, []);

  const emailLogin = async (accessToken) => {
    setSession(accessToken);
    const response = await axios.get('/api/user/profile');
    // store user to local storage
    const user = response.data;
    window.localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: 'LOGIN',
      payload: {
        user: JSON.parse(window.localStorage.getItem('user'))
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      await axios.post('/api/account/register', {
        email,
        password,
        firstName,
        lastName
      });
    } finally {
      /* empty */
    }
  };

  const googleLogin = async (accessToken) => {
    setSession(accessToken);

    const response = await axios.get('/api/user/profile');
    // store user to local storage
    const user = response.data;
    window.localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    window.localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const refetchUser = async () => {
    const response = await axios.get('/api/user/profile');
    // store user to local storage
    const user = response.data;
    window.localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const auth = useMemo(
    () => ({
      ...state,
      method: 'jwt',
      login: emailLogin,
      refetchUser,
      logout,
      register,
      googleLogin
    }),
    [state]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
