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
  const { user } = useAuth();
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

  useEffect(() => {
    loadSettings();
  }, []);

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

      // Load system settings
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
    } catch (error) {
      console.error('Error loading settings:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
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
    </div>
  );
};

export default Ayarlar;