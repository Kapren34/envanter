import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
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
          <div className="flex items-center">
            <div className="text-sm text-gray-700 mr-2">PowerSound Admin</div>
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-medium">
              PA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;