import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Trash2, Edit, ArrowDown, ArrowUp, Download, LogIn, LogOut } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import BarkodGenerator from '../components/BarkodGenerator';
import { exportToExcel } from '../utils/excelUtils';

const UrunListesi = () => {
  const { urunler, kategoriler, removeUrun, addHareket } = useEnvanter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('ad');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedUrun, setSelectedUrun] = useState<string | null>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProductForMovement, setSelectedProductForMovement] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<'Giriş' | 'Çıkış'>('Çıkış');
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementDescription, setMovementDescription] = useState('');
  const [movementLocation, setMovementLocation] = useState('');
  
  // Filtreleme
  const filteredUrunler = urunler.filter((urun) => {
    const matchesSearch = urun.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          urun.barkod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? urun.kategori === selectedCategory : true;
    const matchesStatus = selectedStatus ? urun.durum === selectedStatus : true;
    const matchesLocation = selectedLocation ? urun.lokasyon === selectedLocation : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
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
  
  // Barkod görüntüleme
  const handleBarkodClick = (urunId: string) => {
    setSelectedUrun(urunId);
  };

  // Hareket işlemleri
  const handleMovementClick = (urunId: string, type: 'Giriş' | 'Çıkış') => {
    setSelectedProductForMovement(urunId);
    setMovementType(type);
    setShowMovementModal(true);
  };

  const handleMovementSubmit = async () => {
    if (!selectedProductForMovement) return;

    try {
      await addHareket({
        id: '',
        urunId: selectedProductForMovement,
        urunAdi: urunler.find(u => u.id === selectedProductForMovement)?.ad || '',
        tip: movementType,
        miktar: movementQuantity,
        tarih: new Date().toLocaleDateString('tr-TR'),
        aciklama: movementDescription,
        lokasyon: movementLocation,
        kullanici: 'Admin'
      });

      setShowMovementModal(false);
      setSelectedProductForMovement(null);
      setMovementQuantity(1);
      setMovementDescription('');
      setMovementLocation('');

      alert(`Ürün ${movementType.toLowerCase()} kaydı başarıyla oluşturuldu.`);
    } catch (error) {
      console.error('Hareket oluşturma hatası:', error);
      alert('Hareket kaydı oluşturulurken bir hata oluştu.');
    }
  };
  
  // Konumlar ve durumlar
  const lokasyonlar = [
    'Depo',
    'Merit Park',
    'Merit Royal',
    'Merit Cristal',
    'Lord Place',
    'Kaya Plazzo',
    'Cratos',
    'Acapolco',
    'Elexsus',
    'Chamada',
    'Limak',
    'Kaya Artemis',
    'Concorde',
    'Concorde Lefkosa',
    'Grand Saphire'
  ];
  const durumlar = ['Depoda', 'Otelde', 'Serviste', 'Kiralandı'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ürün Listesi</h1>
        <Link to="/urunler/ekle" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Ürün
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
              {kategoriler.map((kategori) => (
                <option key={kategori.id} value={kategori.ad}>
                  {kategori.ad}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tüm Durumlar</option>
              {durumlar.map((durum) => (
                <option key={durum} value={durum}>
                  {durum}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tüm Lokasyonlar</option>
              {lokasyonlar.map((lokasyon) => (
                <option key={lokasyon} value={lokasyon}>
                  {lokasyon}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <Filter className="h-5 w-5 mr-2" />
            <span className="text-sm">{filteredUrunler.length} ürün filtrelendi</span>
          </div>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
              setSelectedLocation('');
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
      
      {/* Ürün Tablosu */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
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
                  Barkod
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('durum')}
                >
                  <div className="flex items-center">
                    Durum
                    {sortBy === 'durum' && (
                      sortDir === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lokasyon')}
                >
                  <div className="flex items-center">
                    Lokasyon
                    {sortBy === 'lokasyon' && (
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
              {sortedUrunler.length > 0 ? (
                sortedUrunler.map((urun) => (
                  <tr key={urun.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{urun.ad}</div>
                      <div className="text-sm text-gray-500">{urun.marka} {urun.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{urun.kategori}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleBarkodClick(urun.id)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        {urun.barkod}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        urun.durum === 'Depoda' ? 'bg-green-100 text-green-800' :
                        urun.durum === 'Dışarıda' ? 'bg-blue-100 text-blue-800' :
                        urun.durum === 'Serviste' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100  text-purple-800'
                      }`}>
                        {urun.durum}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {urun.lokasyon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleMovementClick(urun.id, 'Çıkış')}
                          className="text-red-600 hover:text-red-900"
                          title="Çıkış"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleMovementClick(urun.id, 'Giriş')}
                          className="text-green-600 hover:text-green-900"
                          title="Giriş"
                        >
                          <LogIn className="h-5 w-5" />
                        </button>
                        <Link to={`/urunler/${urun.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => removeUrun(urun.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Ürün bulunamadı
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
            sortedUrunler.map(urun => ({
              'Ürün Adı': urun.ad,
              'Marka': urun.marka,
              'Model': urun.model,
              'Kategori': urun.kategori,
              'Durum': urun.durum,
              'Lokasyon': urun.lokasyon,
              'Seri No': urun.seriNo,
              'Barkod': urun.barkod,
            })),
            'Urunler'
          )}
          className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150"
        >
          <Download className="h-5 w-5 mr-2" />
          Excel'e Aktar
        </button>
      </div>
      
      {/* Barkod Modalı */}
      {selectedUrun && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Barkod</h2>
            <div className="mb-4">
              <BarkodGenerator
                barkod={urunler.find(u => u.id === selectedUrun)?.barkod || ''}
                urunAdi={urunler.find(u => u.id === selectedUrun)?.ad || ''}
                onPrint={() => setSelectedUrun(null)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUrun(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hareket Modalı */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Ürün {movementType}i
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miktar
                </label>
                <input
                  type="number"
                  min="1"
                  value={movementQuantity}
                  onChange={(e) => setMovementQuantity(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasyon
                </label>
                <select
                  value={movementLocation}
                  onChange={(e) => setMovementLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Lokasyon Seçin</option>
                  {lokasyonlar.map((lokasyon) => (
                    <option key={lokasyon} value={lokasyon}>
                      {lokasyon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={movementDescription}
                  onChange={(e) => setMovementDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowMovementModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                İptal
              </button>
              <button
                onClick={handleMovementSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrunListesi;