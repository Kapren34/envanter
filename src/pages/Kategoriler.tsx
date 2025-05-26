import React, { useState } from 'react';
import { Plus, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';

const Kategoriler = () => {
  const { kategoriler, addKategori, removeKategori } = useEnvanter();
  const [yeniKategori, setYeniKategori] = useState('');

  const handleKategoriEkle = async () => {
    if (yeniKategori.trim()) {
      try {
        await addKategori({
          id: Date.now().toString(),
          ad: yeniKategori.trim()
        });
        setYeniKategori('');
      } catch (error) {
        console.error('Kategori eklenirken hata oluştu:', error);
      }
    }
  };

  const handleKategoriSil = async (id: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await removeKategori(id);
      } catch (error) {
        console.error('Kategori silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kategori Yönetimi</h1>
      </div>

      {/* Yeni Kategori Ekleme */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Yeni Kategori Ekle</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={yeniKategori}
            onChange={(e) => setYeniKategori(e.target.value)}
            placeholder="Kategori adı..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleKategoriEkle}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ekle
          </button>
        </div>
      </div>

      {/* Kategori Listesi */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mevcut Kategoriler</h2>
        
        {kategoriler.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kategoriler.map((kategori) => (
              <div
                key={kategori.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-800">{kategori.ad}</span>
                </div>
                <button
                  onClick={() => handleKategoriSil(kategori.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Henüz kategori bulunmamaktadır.</p>
            <p className="text-sm text-gray-400 mt-1">
              Yeni kategori eklemek için yukarıdaki formu kullanın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kategoriler;