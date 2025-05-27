import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Shield, Settings as SettingsIcon, UserPlus } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserSettings {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
}

interface SystemSettings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  inventory: {
    low_stock_threshold: number;
    enable_notifications: boolean;
    auto_backup: boolean;
  };
  notifications: {
    email_enabled: boolean;
    push_enabled: boolean;
  };
}

const Ayarlar = () => {
  const { user, isAdmin } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: 'light',
    language: 'tr',
    notifications_enabled: true,
    email_notifications: true
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    company: {
      name: 'POWERSOUND',
      address: '',
      phone: '',
      email: ''
    },
    inventory: {
      low_stock_threshold: 5,
      enable_notifications: true,
      auto_backup: true
    },
    notifications: {
      email_enabled: true,
      push_enabled: false
    }
  });

  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    loadSettings();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadSettings = async () => {
    try {
      // Load user settings
      const { data: userSettingsData, error: userSettingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (userSettingsError) {
        console.error('Error loading user settings:', userSettingsError);
      } else if (userSettingsData) {
        setUserSettings(userSettingsData);
      }

      // Load system settings if admin
      if (isAdmin) {
        const { data: systemSettingsData, error: systemSettingsError } = await supabase
          .from('system_settings')
          .select('*');

        if (systemSettingsError) {
          console.error('Error loading system settings:', systemSettingsError);
        } else if (systemSettingsData) {
          const settings = systemSettingsData.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          setSystemSettings(settings as SystemSettings);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleUserSettingsChange = async (changes: Partial<UserSettings>) => {
    try {
      const { data, error } = await supabase.rpc('update_user_settings', changes);

      if (error) throw error;
      setUserSettings({ ...userSettings, ...changes });
      alert('Kullanıcı ayarları güncellendi');
    } catch (error) {
      console.error('Error updating user settings:', error);
      alert('Ayarlar güncellenirken bir hata oluştu');
    }
  };

  const handleSystemSettingsChange = async (key: string, value: any) => {
    try {
      const { data, error } = await supabase.rpc('update_system_settings', {
        p_key: key,
        p_value: value
      });

      if (error) throw error;
      setSystemSettings({ ...systemSettings, [key]: value });
      alert('Sistem ayarları güncellendi');
    } catch (error) {
      console.error('Error updating system settings:', error);
      alert('Sistem ayarları güncellenirken bir hata oluştu');
    }
  };

  const handleAddUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
            role: newUser.role
          }
        }
      });

      if (error) throw error;

      // Create user record in public schema
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: data.user?.id,
          email: newUser.email,
          username: newUser.username,
          full_name: newUser.full_name,
          role: newUser.role
        }]);

      if (userError) throw userError;

      loadUsers();
      setNewUser({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      });
      alert('Kullanıcı başarıyla eklendi');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Kullanıcı eklenirken bir hata oluştu');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      loadUsers();
      alert('Kullanıcı başarıyla silindi');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Kullanıcı silinirken bir hata oluştu');
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

      {/* Kullanıcı Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Kullanıcı Ayarları
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <select
                value={userSettings.theme}
                onChange={(e) => handleUserSettingsChange({ theme: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dil
              </label>
              <select
                value={userSettings.language}
                onChange={(e) => handleUserSettingsChange({ language: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userSettings.notifications_enabled}
                onChange={(e) => handleUserSettingsChange({ notifications_enabled: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Bildirimleri Etkinleştir</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userSettings.email_notifications}
                onChange={(e) => handleUserSettingsChange({ email_notifications: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">E-posta Bildirimleri</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sistem Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Şirket Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şirket Adı
            </label>
            <input
              type="text"
              value={systemSettings.company.name}
              onChange={(e) => handleSystemSettingsChange('company', {
                ...systemSettings.company,
                name: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={systemSettings.company.email}
              onChange={(e) => handleSystemSettingsChange('company', {
                ...systemSettings.company,
                email: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={systemSettings.company.phone}
              onChange={(e) => handleSystemSettingsChange('company', {
                ...systemSettings.company,
                phone: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <input
              type="text"
              value={systemSettings.company.address}
              onChange={(e) => handleSystemSettingsChange('company', {
                ...systemSettings.company,
                address: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Envanter Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Envanter Ayarları
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Düşük Stok Uyarı Limiti
            </label>
            <input
              type="number"
              min="0"
              value={systemSettings.inventory.low_stock_threshold}
              onChange={(e) => handleSystemSettingsChange('inventory', {
                ...systemSettings.inventory,
                low_stock_threshold: parseInt(e.target.value)
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={systemSettings.inventory.enable_notifications}
                onChange={(e) => handleSystemSettingsChange('inventory', {
                  ...systemSettings.inventory,
                  enable_notifications: e.target.checked
                })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Stok Bildirimlerini Etkinleştir</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={systemSettings.inventory.auto_backup}
                onChange={(e) => handleSystemSettingsChange('inventory', {
                  ...systemSettings.inventory,
                  auto_backup: e.target.checked
                })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Otomatik Yedekleme</span>
            </label>
          </div>
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
            <div>
              <input
                type="text"
                placeholder="Kullanıcı adı"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="E-posta"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Şifre"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
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
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Kullanıcı Ekle
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
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
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
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default Ayarlar;