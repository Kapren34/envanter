import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Camera } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { generateBarkod, checkExistingBarkod } from '../utils/barkodUtils';
import { supabase } from '../lib/supabase';
import React, { useState, useEffect } from 'react';

const UrunEkle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addUrun } = useEnvanter();
  const isDepoProduct = location.pathname.includes('/depo');

  // Fetch categories
  const [kategoriler, setKategoriler] = useState([]);
  const [depoProducts, setDepoProducts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');
      
      if (catError) {
        console.error('Fetch categories error:', catError);
      } else {
        setKategoriler(catData);
      }

      // If adding malzeme, fetch depo products
      if (!isDepoProduct) {
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('inventory_type', 'depo');
        
        if (prodError) {
          console.error('Fetch depo products error:', prodError);
        } else {
          setDepoProducts(prodData);
        }
      }
    };

    fetchData();
  }, [isDepoProduct]);

  // Fetch locations
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name');
      
      if (error) {
        console.error('Fetch locations error:', error);
      } else {
        setLocations(data);
      }
    };
    
    fetchLocations();
  }, []);

  const [formData, setFormData] = useState({
    ad: '',
    marka: '',
    model: '',
    kategori: '',
    durum: 'Depoda',
    lokasyon: '',
    seriNo: '',
    aciklama: '',
    referenceProductId: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If selecting a reference product, auto-fill some fields
    if (name === 'referenceProductId' && value) {
      const selectedProduct = depoProducts.find(p => p.id === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          ad: selectedProduct.name,
          marka: selectedProduct.brand || '',
          model: selectedProduct.model || '',
          kategori: selectedProduct.category_id,
          referenceProductId: selectedProduct.id
        }));
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUniqueBarcode = async () => {
    let barcode;
    let isUnique = false;
    let maxAttempts = 10;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      barcode = generateBarkod();
      
      // Check if barcode exists
      const { data, error } = await supabase
        .from('products')
        .select('barcode')
        .eq('barcode', barcode)
        .single();

      if (error && error.code === 'PGRST116') { // no rows returned
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Could not generate a unique barcode after multiple attempts');
    }

    return barcode;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let barcode;
      
      if (isDepoProduct) {
        // For depo products, first try to get existing barcode
        barcode = await checkExistingBarkod(
          supabase,
          formData.ad,
          formData.marka,
          formData.model
        );
        
        // If no existing barcode found, generate a unique one
        if (!barcode) {
          barcode = await generateUniqueBarcode();
        }
      } else {
        // For malzeme products, use the same barcode as reference product
        const refProduct = depoProducts.find(p => p.id === formData.referenceProductId);
        if (!refProduct?.barcode) {
          throw new Error('Reference product barcode not found');
        }
        barcode = refProduct.barcode;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            barcode,
            name: formData.ad,
            brand: formData.marka || null,
            model: formData.model || null,
            category_id: formData.kategori || null,
            serial_number: formData.seriNo || null,
            description: formData.aciklama || null,
            status: formData.durum || 'Depoda',
            location_id: formData.lokasyon || null,
            photo_url: null,
            created_by: null,
            inventory_type: isDepoProduct ? 'depo' : 'malzeme',
            reference_product_id: isDepoProduct ? null : formData.referenceProductId || null
          },
        ]);

      if (error) throw error;

      if (addUrun && data) {
        addUrun(data[0]);
      }

      navigate(isDepoProduct ? '/depo' : '/urunler');
    } catch (error) {
      console.error(error);
      alert('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isDepoProduct ? 'Yeni Depo Ürünü Ekle' : 'Yeni Malzeme Ekle'}
        </h1>
        <button 
          onClick={() => navigate(isDepoProduct ? '/depo' : '/urunler')} 
          className="text-gray-600 hover:text-gray-900"
        >
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
            {!isDepoProduct && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depo Ürünü Seç
                </label>
                <select
                  name="referenceProductId"
                  value={formData.referenceProductId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Depo Ürünü Seçin</option>
                  {depoProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.brand} {product.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                <option value="Depoda">Depoda</option>
                <option value="Otelde">Otelde</option>
                <option value="Serviste">Serviste</option>
                <option value="Kiralandı">Kiralandı</option>
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
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
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

        {/* Buttons */}
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(isDepoProduct ? '/depo' : '/urunler')}
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