import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, RefreshCw, BarChart3, Settings, SpeakerIcon, Lightbulb, Monitor, Warehouse } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      <div className="px-4 py-6 border-b border-indigo-800/50">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">POWERSOUND</h2>
        <p className="text-indigo-200 text-sm">Depo Takip Sistemi</p>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <Home className="h-5 w-5 mr-3" />
          <span>Anasayfa</span>
        </NavLink>
        <NavLink
          to="/depo"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <Warehouse className="h-5 w-5 mr-3" />
          <span>Depo</span>
        </NavLink>
        <NavLink
          to="/urunler"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <Package className="h-5 w-5 mr-3" />
          <span>Malzeme Takip</span>
        </NavLink>
        <NavLink
          to="/hareketler"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <RefreshCw className="h-5 w-5 mr-3" />
          <span>Hareketler</span>
        </NavLink>
        <NavLink
          to="/raporlar"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <BarChart3 className="h-5 w-5 mr-3" />
          <span>Raporlar</span>
        </NavLink>
        <NavLink
          to="/ayarlar"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800/80 text-white shadow-lg shadow-indigo-900/20'
                : 'text-indigo-100 hover:bg-indigo-800/50'
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Ayarlar</span>
        </NavLink>
      </nav>
      <div className="px-4 py-6 border-t border-indigo-800/50">
        <div className="flex items-center justify-around text-sm">
          <div className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200">
            <SpeakerIcon className="h-4 w-4 mr-1" />
            <span>Ses</span>
          </div>
          <div className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200">
            <Lightbulb className="h-4 w-4 mr-1" />
            <span>Işık</span>
          </div>
          <div className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200">
            <Monitor className="h-4 w-4 mr-1" />
            <span>Görüntü</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;