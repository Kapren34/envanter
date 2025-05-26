import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, RefreshCw, BarChart3, Settings, SpeakerIcon, Lightbulb, Monitor } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-white">Envanter Takip</h2>
        <p className="text-indigo-200 text-sm">Ses, Işık ve Görüntü Sistemleri</p>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
            }`
          }
        >
          <Home className="h-5 w-5 mr-3" />
          <span>Anasayfa</span>
        </NavLink>
        <NavLink
          to="/urunler"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
            }`
          }
        >
          <Package className="h-5 w-5 mr-3" />
          <span>Ürünler</span>
        </NavLink>
        <NavLink
          to="/hareketler"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition duration-150 rounded-lg ${
              isActive
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
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
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
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
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Ayarlar</span>
        </NavLink>
      </nav>
      <div className="px-4 py-6">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-indigo-200">
            <SpeakerIcon className="h-4 w-4 mr-1" />
            <span>Ses</span>
          </div>
          <div className="flex items-center text-indigo-200">
            <Lightbulb className="h-4 w-4 mr-1" />
            <span>Işık</span>
          </div>
          <div className="flex items-center text-indigo-200">
            <Monitor className="h-4 w-4 mr-1" />
            <span>Görüntü</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;