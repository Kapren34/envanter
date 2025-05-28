import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Save, User } from 'lucide-react';

const Ayarlar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserProfile(prev => ({
          ...prev,
          fullName: data.full_name || '',
          email: data.email || ''
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Profil bilgileri yüklenirken bir hata oluştu');
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Update profile information
      const updates = {
        id: user?.id,
        full_name: userProfile.fullName,
        updated_at: new Date()
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update password if provided
      if (userProfile.newPassword) {
        if (userProfile.newPassword !== userProfile.confirmPassword) {
          throw new Error('Yeni şifreler eşleşmiyor');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: userProfile.newPassword
        });

        if (passwordError) throw passwordError;

        // Clear password fields
        setUserProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      setSuccessMessage('Profil başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">Profil Ayarları</h1>
            <p className="text-gray-600">Hesap bilgilerinizi güncelleyin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              name="fullName"
              value={userProfile.fullName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={userProfile.email}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email adresi değiştirilemez
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Şifre Değiştir
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={userProfile.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={userProfile.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Çıkış Yap
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ayarlar;