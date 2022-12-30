import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import Router from './routes';
import ThemeProvider from './theme';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import NotistackProvider from './components/NotistackProvider';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider>
        <NotistackProvider>
          <MotionLazyContainer>
            <>
              <Router />
            </>
          </MotionLazyContainer>
        </NotistackProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
