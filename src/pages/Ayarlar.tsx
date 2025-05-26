import React, { useState } from 'react';
import { Save, Plus, Trash2, UserPlus, Shield, Mail, Key } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { useAuth } from '../contexts/AuthContext';

const Ayarlar = () => {
  const { kategoriler, addKategori, removeKategori, isAdmin } = useEnvanter();
  const { user } = useAuth();
  const [yeniKategori, setYeniKategori] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  
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
      
      {/* Admin Hesap Bilgileri */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-indigo-600" />
            Admin Hesap Bilgileri
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Yönetici</p>
                </div>
              </div>
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Key className="h-5 w-5" />
              </button>
            </div>

            {showCredentials && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h3 className="text-sm font-medium text-indigo-800 mb-3">Giriş Bilgileri</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kullanıcı Adı:</span>
                    <span className="text-sm font-medium text-gray-900">admin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Şifre:</span>
                    <span className="text-sm font-medium text-gray-900">admin123</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-indigo-600">
                  Bu bilgileri güvenli bir yerde saklayın ve kimseyle paylaşmayın.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Kategoriler */}
      {isAdmin && (
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
      )}
      
      {/* Sistem Ayarları */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sistem Ayarları</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şirket Adı
              </label>
              <input
                type="text"
                defaultValue="POWERSOUND"
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
      )}
      
      {/* Message for non-admin users */}
      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-center">
            Bu sayfadaki ayarları görüntülemek ve değiştirmek için yönetici yetkisine sahip olmanız gerekmektedir.
          </p>
        </div>
      )}
      
      {/* Versiyon Bilgisi */}
      <div className="text-center text-gray-500 text-sm">
        <p>POWERSOUND DEPO TAKİP v1.0.0</p>
        <p>© 2025 Tüm Hakları Saklıdır</p>
      </div>
    </div>
  );
};

export default Ayarlar;