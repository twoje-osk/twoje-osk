import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { HomePage } from './views/HomePage/HomePage';
import { Login } from './views/Login/Login';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<HomePage />} />
        <Route path="/kursanci" element={<HomePage />} />
      </Route>
    </Routes>
  );
};
