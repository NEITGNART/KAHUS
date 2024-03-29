// scroll bar
import 'simplebar/src/simplebar.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from './redux/store';
import App from './App';
import { AuthProvider } from './contexts/JWTContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

root.render(
  <AuthProvider>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ReduxProvider>
    </HelmetProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
