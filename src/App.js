import Router from './routes';
import ThemeProvider from './theme';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import NotistackProvider from './components/NotistackProvider';

function App() {
  return (
    <ThemeProvider>
      <NotistackProvider>
        <MotionLazyContainer>
          <Router />
        </MotionLazyContainer>
      </NotistackProvider>
    </ThemeProvider>
  );
}

export default App;
