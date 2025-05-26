import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';

const Ayarlar = () => {
  const { kategoriler, addKategori, removeKategori } = useEnvanter();
  const [yeniKategori, setYeniKategori] = useState('');
  
  const handleKategoriEkle = () => {
    if (yeniKategori.trim()) {
      addKategori({
        id: Date.now().toString(),
        ad: yeniKategori.trim()
      });
      setYeniKategori('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
      
      {/* Kategoriler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kategori Yönetimi</h2>
        
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Yeni kategori adı..."
            value={yeniKategori}
            onChange={(e) => setYeniKategori(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleKategoriEkle}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ekle
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {kategoriler.length > 0 ? (
            kategoriler.map((kategori) => (
              <div key={kategori.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">{kategori.ad}</span>
                <button
                  onClick={() => removeKategori(kategori.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Henüz kategori bulunmamaktadır.</p>
          )}
        </div>
      </div>
      
      {/* Kullanıcı Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kullanıcı Ayarları</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              defaultValue="Admin Kullanıcı"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              defaultValue="admin@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre Değiştir
            </label>
            <input
              type="password"
              placeholder="Yeni şifre"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
            />
            <input
              type="password"
              placeholder="Şifreyi tekrar girin"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
      
      {/* Sistem Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sistem Ayarları</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şirket Adı
            </label>
            <input
              type="text"
              defaultValue="ABC Ses Işık Görüntü Sistemleri"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Düşük Stok Uyarı Limiti
            </label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
              E-posta bildirimlerini etkinleştir
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoBackup"
              defaultChecked
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
              Otomatik yedeklemeyi etkinleştir
            </label>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Ayarları Kaydet
          </button>
        </div>
      </div>
      
      {/* Versiyon Bilgisi */}
      <div className="text-center text-gray-500 text-sm">
        <p>Envanter Takip Sistemi v1.0.0</p>
        <p>© 2025 Tüm Hakları Saklıdır</p>
      </div>
    </div>
  );
};

export default Ayarlar;