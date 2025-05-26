import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-1 mr-4 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Ara..."
            className="w-64 pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="flex items-center">
        <button className="p-2 mr-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
          AK
        </div>
      </div>
    </header>
  );
};

export default Header;