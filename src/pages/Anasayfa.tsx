import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

function Anasayfa() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Anasayfa</h1>
        <Link
          to="/urunler/ekle"
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center"
        >
          <Package className="h-5 w-5 mr-2" />
          Yeni Malzeme Ekle
        </Link>
      </div>
    </div>
  );
}

export default Anasayfa;