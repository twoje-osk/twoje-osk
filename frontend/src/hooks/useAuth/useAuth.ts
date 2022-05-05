import { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext/AuthContext';

export const useAuth = () => useContext(AuthContext);
