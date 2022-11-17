import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
