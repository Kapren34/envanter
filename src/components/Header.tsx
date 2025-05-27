import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-900 h-16 flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center">
        <button 
          id="sidebar-toggle"
          onClick={toggleSidebar} 
          className="p-1 mr-4 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-indigo-200 hover:text-white transition-colors duration-200">
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-medium">
            {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
          </div>
          <button
            onClick={logout}
            className="text-indigo-200 hover:text-white transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;