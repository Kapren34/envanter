import { useNavigate } from 'react-router-dom';
import { Save, X, Camera } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { generateBarkod } from '../utils/barkodUtils';
import { supabase } from '../lib/supabase';
import React, { useState, useEffect } from 'react';

const UrunEkle = () => {
  const navigate = useNavigate();
  const { loadProducts } = useEnvanter();

  // Fetch categories
  const [kategoriler, setKategoriler] = useState([]);
  useEffect(() => {
    const fetchKategoriler = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Fetch categories error:', error.message);
      } else {
        setKategoriler(data);
      }
    };
    fetchKategoriler();
  }, []);

  // Fetch locations from DB, to get id and name
  const [lokasyonlar, setLokasyonlar] = useState([]);
  useEffect(() => {
    const fetchLokasyonlar = async () => {
      const { data, error } = await supabase.from('locations').select('id, name');
      if (error) {
        console.error('Fetch locations error:', error.message);
      } else {
        setLokasyonlar(data);
      }
    };
    fetchLokasyonlar();
  }, []);

  // Status options
  const durumlar = ['Depoda', 'Otelde', 'Serviste', 'Kiralandı'];

  const [formData, setFormData] = useState({
    ad: '',
    marka: '',
    model: '',
    kategori: '',
    durum: 'Depoda',
    lokasyon: '',
    seriNo: '',
    aciklama: '',
    miktar: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'miktar' ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const products = [];
      
      // Generate multiple products based on quantity
      for (let i = 0; i < formData.miktar; i++) {
        // Generate a unique barcode for each product
        const barcode = generateBarkod();

        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              barcode: barcode, // Include the generated barcode
              name: formData.ad,
              brand: formData.marka || null,
              model: formData.model || null,
              category_id: formData.kategori || null,
              serial_number: formData.seriNo ? `${formData.seriNo}-${i + 1}` : null,
              description: formData.aciklama || null,
              status: formData.durum || 'Depoda',
              location_id: formData.lokasyon || null,
              photo_url: null,
              created_by: null,
              quantity: 1, // Each product instance has quantity 1
            },
          ])
          .select();

        if (error) throw error;
        if (data) {
          products.push(data[0]);
        }
      }

      // Reload the data in the context to reflect the changes
      await loadProducts();
      
      navigate('/urunler');
    } catch (error) {
      console.error('Error saving products:', error);
      alert('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Ürün Ekle</h1>
        <button onClick={() => navigate('/urunler')} className="text-gray-600 hover:text-gray-900">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı*
              </label>
              <input
                type="text"
                id="ad"
                name="ad"
                required
                value={formData.ad}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="marka" className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
              <input
                type="text"
                id="marka"
                name="marka"
                value={formData.marka}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori*
              </label>
              <select
                id="kategori"
                name="kategori"
                required
                value={formData.kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Kategori Seçin</option>
                {kategoriler.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="miktar" className="block text-sm font-medium text-gray-700 mb-1">
                Miktar*
              </label>
              <input
                type="number"
                id="miktar"
                name="miktar"
                min="1"
                value={formData.miktar}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="durum" className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                id="durum"
                name="durum"
                value={formData.durum}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {durumlar.map((durum) => (
                  <option key={durum} value={durum}>
                    {durum}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lokasyon" className="block text-sm font-medium text-gray-700 mb-1">
                Lokasyon
              </label>
              <select
                id="lokasyon"
                name="lokasyon"
                value={formData.lokasyon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Lokasyon Seçin</option>
                {lokasyonlar.map((lokasyon) => (
                  <option key={lokasyon.id} value={lokasyon.id}>
                    {lokasyon.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="seriNo" className="block text-sm font-medium text-gray-700 mb-1">
                Seri No
              </label>
              <input
                type="text"
                id="seriNo"
                name="seriNo"
                value={formData.seriNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formData.miktar > 1 && formData.seriNo && (
                <p className="text-sm text-gray-500 mt-1">
                  Her ürün için seri numarasına -1, -2, ... eklenir
                </p>
              )}
            </div>

            <div>
              <label htmlFor="aciklama" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                id="aciklama"
                name="aciklama"
                rows={4}
                value={formData.aciklama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Fotoğraf Ekle */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <button
              type="button"
              className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg h-32 w-32 hover:border-indigo-500"
            >
              <div className="text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto" />
                <span className="text-sm text-gray-500 mt-1 block">Fotoğraf Ekle</span>
              </div>
            </button>
            <p className="text-sm text-gray-500 ml-4">
              Ürün fotoğrafı eklemek için tıklayın. <br />
              Önerilen boyut: 600x600 piksel
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/urunler')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrunEkle;