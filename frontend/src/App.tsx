import { Routes, Route } from 'react-router-dom';
import { Login } from './views/Login/Login';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};
