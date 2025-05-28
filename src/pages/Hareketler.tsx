import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Trash2, RefreshCw, ArrowDown, ArrowUp, Download } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { exportToExcel } from '../utils/excelUtils';
import { supabase } from '../lib/supabase';

const Hareketler = () => {
  const { hareketler, urunler, removeHareket } = useEnvanter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('tarih');
  const [sortDir, setSortDir] = useState('desc');
  const [locations, setLocations] = useState<{id: string, name: string}[]>([]);
  const [users, setUsers] = useState<{id: string, username: string}[]>([]);
  
  // Fetch locations and users from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');
      
      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
      } else if (locationsData) {
        setLocations(locationsData);
      }

      // Fetch users from auth_users table instead of users
      const { data: usersData, error: usersError } = await supabase
        .from('auth_users')
        .select('id, username')
        .order('username');
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else if (usersData) {
        setUsers(usersData);
      }
    };

    fetchData();
  }, []);

  // Helper functions to get names
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };
  
  // Filtreleme
  const filteredHareketler = hareketler.filter((hareket) => {
    const matchesSearch = hareket.urunAdi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          hareket.aciklama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? hareket.tip === selectedType : true;
    
    let matchesDateFrom = true;
    let matchesDateTo = true;
    
    if (dateFrom) {
      const hareketTarihiParts = hareket.tarih.split('.');
      const hareketTarihi = new Date(
        parseInt(hareketTarihiParts[2]), 
        parseInt(hareketTarihiParts[1]) - 1, 
        parseInt(hareketTarihiParts[0])
      );
      const fromDate = new Date(dateFrom);
      matchesDateFrom = hareketTarihi >= fromDate;
    }
    
    if (dateTo) {
      const hareketTarihiParts = hareket.tarih.split('.');
      const hareketTarihi = new Date(
        parseInt(hareketTarihiParts[2]), 
        parseInt(hareketTarihiParts[1]) - 1, 
        parseInt(hareketTarihiParts[0])
      );
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      matchesDateTo = hareketTarihi <= toDate;
    }
    
    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });
  
  // Sıralama
  const sortedHareketler = [...filteredHareketler].sort((a, b) => {
    if (sortBy === 'tarih') {
      const dateA = a.tarih.split('.').reverse().join('-');
      const dateB = b.tarih.split('.').reverse().join('-');
      return sortDir === 'asc' 
        ? dateA.localeCompare(dateB) 
        : dateB.localeCompare(dateA);
    } else {
      return sortDir === 'asc'
        ? a[sortBy] > b[sortBy] ? 1 : -1
        : a[sortBy] < b[sortBy] ? 1 : -1;
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
        <h1 className="text-2xl font-bold text-gray-800">Hareket Kayıtları</h1>
        <Link to="/hareketler/ekle" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Hareket
        </Link>
      </div>
      
      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün veya açıklama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hareket Tipi</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tüm Hareketler</option>
              <option value="Giriş">Giriş</option>
              <option value="Çıkış">Çıkış</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <Filter className="h-5 w-5 mr-2" />
            <span className="text-sm">{filteredHareketler.length} kayıt filtrelendi</span>
          </div>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setDateFrom('');
              setDateTo('');
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
      
      {/* Hareket Tablosu */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('tarih')}
                >
                  <div className="flex items-center">
                    Tarih
                    {sortBy === 'tarih' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('urunAdi')}
                >
                  <div className="flex items-center">
                    Ürün
                    {sortBy === 'urunAdi' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('tip')}
                >
                  <div className="flex items-center">
                    Tip
                    {sortBy === 'tip' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('miktar')}
                >
                  <div className="flex items-center">
                    Miktar
                    {sortBy === 'miktar' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lokasyon
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Açıklama
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('kullanici')}
                >
                  <div className="flex items-center">
                    İşlemi Yapan
                    {sortBy === 'kullanici' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedHareketler.length > 0 ? (
                sortedHareketler.map((hareket) => (
                  <tr key={hareket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hareket.tarih}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hareket.urunAdi}</div>
                      <div className="text-xs text-gray-500">
                        {urunler.find(u => u.id === hareket.urunId)?.kategori || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        hareket.tip === 'Giriş' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {hareket.tip}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hareket.miktar} adet
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLocationName(hareket.lokasyon)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {hareket.aciklama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getUserName(hareket.kullanici)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => removeHareket(hareket.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Hareket kaydı bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Dışa Aktar Butonu */}
      <div className="flex justify-end">
        <button 
          onClick={() => exportToExcel(
            sortedHareketler.map(hareket => ({
              'Tarih': hareket.tarih,
              'Ürün': hareket.urunAdi,
              'Tip': hareket.tip,
              'Miktar': hareket.miktar,
              'Lokasyon': getLocationName(hareket.lokasyon),
              'Açıklama': hareket.aciklama,
              'İşlemi Yapan': getUserName(hareket.kullanici)
            })),
            'Hareketler'
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

export default Hareketler;