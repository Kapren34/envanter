import React, { useState } from 'react';
import { Save, Plus, Trash2, Shield, Settings as SettingsIcon } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Ayarlar = () => {
  const { kategoriler, addKategori, removeKategori } = useEnvanter();
  const { user, isAdmin } = useAuth();
  const [yeniKategori, setYeniKategori] = useState('');
  const [settings, setSettings] = useState(user?.settings || {
    company_name: 'POWERSOUND',
    low_stock_limit: 5,
    email_notifications: false,
    auto_backup: true
  });
  
  const handleKategoriEkle = () => {
    if (yeniKategori.trim()) {
      addKategori({
        id: Date.now().toString(),
        ad: yeniKategori.trim()
      });
      setYeniKategori('');
    }
  };

  const handleSettingsSave = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ settings })
        .eq('id', user?.id);

      if (error) throw error;

      alert('Ayarlar başarıyla kaydedildi.');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata oluştu:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-100 max-w-md">
          <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Yetkisiz Erişim</h2>
          <p className="text-yellow-700">
            Bu sayfadaki ayarları görüntülemek ve değiştirmek için yönetici yetkisine sahip olmanız gerekmektedir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Admin Paneli</span>
        </div>
      </div>

      {/* Admin Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-indigo-600" />
          Admin Hesap Bilgileri
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Yönetici</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Kullanıcı Adı</p>
              <p className="font-medium">admin</p>
            </div>
            <div>
              <p className="text-gray-500">Şifre</p>
              <p className="font-medium">admin123</p>
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Sistem Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Sistem Ayarları
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şirket Adı
            </label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Düşük Stok Uyarı Limiti
            </label>
            <input
              type="number"
              value={settings.low_stock_limit}
              onChange={(e) => setSettings({ ...settings, low_stock_limit: parseInt(e.target.value) })}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.email_notifications}
              onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
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
              checked={settings.auto_backup}
              onChange={(e) => setSettings({ ...settings, auto_backup: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
              Otomatik yedeklemeyi etkinleştir
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSettingsSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Ayarları Kaydet
          </button>
        </div>
      </div>
      
      {/* Versiyon Bilgisi */}
      <div className="text-center text-gray-500 text-sm">
        <p>POWERSOUND DEPO TAKİP v1.0.0</p>
        <p>© 2025 Tüm Hakları Saklıdır</p>
      </div>
    </div>
  );
};

export default Ayarlar;