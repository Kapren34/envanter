import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Shield, Settings as SettingsIcon, UserPlus, Key } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
  settings?: {
    company_name: string;
    low_stock_limit: number;
    email_notifications: boolean;
    auto_backup: boolean;
  };
}

const Ayarlar = () => {
  const { kategoriler, addKategori, removeKategori } = useEnvanter();
  const { user, isAdmin } = useAuth();
  const [yeniKategori, setYeniKategori] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'user'
  });
  const [settings, setSettings] = useState({
    company_name: 'POWERSOUND',
    low_stock_limit: 5,
    email_notifications: false,
    auto_backup: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadSettings();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('settings')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data?.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    }
  };

  const handleKategoriEkle = async () => {
    if (!yeniKategori.trim()) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: yeniKategori.trim() }])
        .select()
        .single();

      if (error) throw error;

      if (addKategori) {
        addKategori({
          id: data.id,
          ad: data.name
        });
      }
      setYeniKategori('');
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
      alert('Kategori eklenirken bir hata oluştu');
    }
  };

  const handleSettingsSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ settings })
        .eq('id', user?.id);

      if (error) throw error;
      alert('Ayarlar başarıyla kaydedildi.');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .rpc('create_new_user', {
          new_username: newUser.username,
          new_password: newUser.password,
          new_full_name: newUser.full_name,
          new_role: newUser.role
        });

      if (error) throw error;

      await loadUsers();
      setNewUser({ username: '', password: '', full_name: '', role: 'user' });
      alert('Kullanıcı başarıyla eklendi.');
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error);
      alert('Kullanıcı eklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await loadUsers();
      alert('Kullanıcı başarıyla silindi.');
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      alert('Kullanıcı silinirken bir hata oluştu');
    } finally {
      setIsLoading(false);
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

      {/* Kullanıcı Yönetimi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
          Kullanıcı Yönetimi
        </h2>

        {/* Yeni Kullanıcı Formu */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Yeni Kullanıcı Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Kullanıcı adı"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                placeholder="Şifre"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ad Soyad"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Yönetici</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddUser}
            disabled={isLoading}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isLoading ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
          </button>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg flex items-center disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isLoading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {kategoriler.length > 0 ? (
            kategoriler.map((kategori) => (
              <div key={kategori.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">{kategori.ad}</span>
                <button
                  onClick={() => removeKategori(kategori.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
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