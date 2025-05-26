import React, { useState } from 'react';
import { Save, Plus, Trash2, UserPlus, Shield, Mail } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';

const Ayarlar = () => {
  const { kategoriler, addKategori, removeKategori } = useEnvanter();
  const [yeniKategori, setYeniKategori] = useState('');
  const [yeniKullanici, setYeniKullanici] = useState({
    ad: '',
    email: '',
    yetki: 'kullanici',
    sifre: '',
    sifreTekrar: ''
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

  const handleKullaniciEkle = (e: React.FormEvent) => {
    e.preventDefault();
    // Kullanıcı ekleme işlemi burada yapılacak
    console.log('Yeni kullanıcı:', yeniKullanici);
    setYeniKullanici({
      ad: '',
      email: '',
      yetki: 'kullanici',
      sifre: '',
      sifreTekrar: ''
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
      
      {/* Kullanıcı Yönetimi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
          Kullanıcı Yönetimi
        </h2>
        
        {/* Kullanıcı Listesi */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mevcut Kullanıcılar</h3>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  AK
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin Kullanıcı</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  Yönetici
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
                  MK
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mehmet Kullanıcı</p>
                  <p className="text-xs text-gray-500">mehmet@example.com</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  Kullanıcı
                </span>
              </div>
              <button className="text-red-600 hover:text-red-900">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Yeni Kullanıcı Formu */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Yeni Kullanıcı Ekle</h3>
          <form onSubmit={handleKullaniciEkle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={yeniKullanici.ad}
                  onChange={(e) => setYeniKullanici({...yeniKullanici, ad: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={yeniKullanici.email}
                  onChange={(e) => setYeniKullanici({...yeniKullanici, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yetki Seviyesi
                </label>
                <select
                  value={yeniKullanici.yetki}
                  onChange={(e) => setYeniKullanici({...yeniKullanici, yetki: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="kullanici">Kullanıcı</option>
                  <option value="yonetici">Yönetici</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  value={yeniKullanici.sifre}
                  onChange={(e) => setYeniKullanici({...yeniKullanici, sifre: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  value={yeniKullanici.sifreTekrar}
                  onChange={(e) => setYeniKullanici({...yeniKullanici, sifreTekrar: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Kullanıcı Ekle
              </button>
            </div>
          </form>
        </div>

        {/* Yetki Açıklamaları */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Yetki Seviyeleri</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Yönetici</p>
                <p className="text-xs text-gray-500">Tüm sistem ayarlarına ve kullanıcı yönetimine erişim</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Kullanıcı</p>
                <p className="text-xs text-gray-500">Temel işlemlere erişim (ürün listesi, hareket kaydı)</p>
              </div>
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