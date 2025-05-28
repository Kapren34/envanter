import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated) {
        try {
          await login('admin@powersound.com', 'Admin123');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };

    autoLogin();
  }, [isAuthenticated, login]);

  // Show loading state while attempting auto-login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;