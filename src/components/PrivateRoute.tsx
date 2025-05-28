import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  // Since we removed the login page, we'll just render the content
  // This assumes the user is always authenticated
  return children;
};

export default PrivateRoute;