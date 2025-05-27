import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 h-16 flex items-center justify-between px-6 md:px-8 shadow-lg border-b border-indigo-800/30">
      <div className="flex items-center">
        <button 
          id="sidebar-toggle"
          onClick={toggleSidebar} 
          className="p-1.5 mr-4 -ml-1 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-indigo-800/50 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative group p-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full group-hover:animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium shadow-lg border-2 border-indigo-700/50 cursor-pointer hover:scale-105 transition-transform duration-200">
              {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="p-2 text-sm text-gray-700">
                <div className="px-3 py-2 font-medium">{user?.name || 'Kullanıcı'}</div>
                <div className="px-3 py-1 text-xs text-gray-500">{user?.email}</div>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 rounded flex items-center space-x-2 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;