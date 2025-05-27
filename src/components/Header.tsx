import React, { useState } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 md:px-8 shadow-md z-20">
      <div className="flex items-center">
        <button 
          id="sidebar-toggle"
          onClick={toggleSidebar} 
          className="p-1.5 mr-4 -ml-1 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="flex items-center">
              <div className="text-sm text-gray-700 mr-2">{user?.full_name || 'Kullanıcı'}</div>
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-medium">
                {user?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                <div className="font-medium">{user?.full_name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;