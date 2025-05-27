import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-900 to-indigo-800 h-16 flex items-center justify-between px-6 md:px-8 shadow-lg">
      <div className="flex items-center">
        <button 
          id="sidebar-toggle"
          onClick={toggleSidebar} 
          className="p-1 mr-4 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-indigo-800/50 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-medium shadow-inner border-2 border-indigo-700">
            {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
          </div>
          <button
            onClick={logout}
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Çıkış Yap"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;