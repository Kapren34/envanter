import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, ArrowDown, ArrowUp, Plus, Edit, Download } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { exportToExcel } from '../utils/excelUtils';
import { supabase } from '../lib/supabase';

const Depo = () => {
  const { urunler } = useEnvanter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('ad');
  const [sortDir, setSortDir] = useState('asc');
  const [locations, setLocations] = useState<{id: string, name: string}[]>([]);

  // Fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching locations:', error);
      } else if (data) {
        setLocations(data);
      }
    };

    fetchLocations();
  }, []);

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  // Depodaki ürünleri filtrele
  const depodakiUrunler = urunler.filter(urun => urun.durum === 'Depoda');

  // Arama ve kategori filtreleme
  const filteredUrunler = depodakiUrunler.filter((urun) => {
    const matchesSearch = urun.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         urun.barkod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? urun.kategori === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Sıralama
  const sortedUrunler = [...filteredUrunler].sort((a, b) => {
    if (sortDir === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Sütuna göre sıralama
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Depo Durumu</h1>
        <Link
          to="/urunler/ekle"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Toplam Ürün</h3>
              <p className="text-2xl font-bold text-blue-600">{depodakiUrunler.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Kullanılabilir</h3>
              <p className="text-2xl font-bold text-green-600">
                {depodakiUrunler.filter(u => u.durum === 'Depoda').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Bakımda</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {depodakiUrunler.filter(u => u.durum === 'Serviste').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün adı veya barkod..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tüm Kategoriler</option>
              {/* Kategorileri listele */}
            </select>
          </div>
        </div>
      </div>

      {/* Ürün Tablosu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('ad')}
                >
                  <div className="flex items-center">
                    Ürün Adı
                    {sortBy === 'ad' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Barkod
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('kategori')}
                >
                  <div className="flex items-center">
                    Kategori
                    {sortBy === 'kategori' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Son İşlem
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUrunler.map((urun) => (
                <tr key={urun.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{urun.ad}</div>
                        <div className="text-sm text-gray-500">{urun.marka} {urun.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {urun.barkod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {urun.kategori}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      urun.durum === 'Depoda' ? 'bg-green-100 text-green-800' :
                      urun.durum === 'Serviste' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {urun.durum}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {urun.eklemeTarihi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/urunler/${urun.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel'e Aktar Butonu */}
      <div className="flex justify-end">
        <button
          onClick={() => exportToExcel(
            sortedUrunler.map(urun => ({
              'Ürün Adı': urun.ad,
              'Marka': urun.marka,
              'Model': urun.model,
              'Kategori': urun.kategori,
              'Durum': urun.durum,
              'Lokasyon': getLocationName(urun.lokasyon),
              'Seri No': urun.seriNo,
              'Barkod': urun.barkod,
              'Son İşlem': urun.eklemeTarihi
            })),
            'Depo_Urunleri'
          )}
          className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150"
        >
          <Download className="h-5 w-5 mr-2" />
          Excel'e Aktar
        </button>
      </div>
    </div>
  );
};

export default Depo;