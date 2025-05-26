import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Printer } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';

const Raporlar = () => {
  const { urunler, hareketler, kategoriler } = useEnvanter();
  const [reportType, setReportType] = useState('stok');
  const [dateRange, setDateRange] = useState('30');
  
  // Kategori bazında stok raporu
  const kategoriStokVerileri = kategoriler.map(kategori => {
    const kategoriUrunleri = urunler.filter(urun => urun.kategori === kategori.ad);
    const toplamStok = kategoriUrunleri.reduce((toplam, urun) => toplam + urun.stokMiktari, 0);
    
    return {
      name: kategori.ad,
      value: toplamStok
    };
  });
  
  // Durum bazında ürün dağılımı
  const durumVerileri = [
    { name: 'Depoda', value: urunler.filter(urun => urun.durum === 'Depoda').length },
    { name: 'Dışarıda', value: urunler.filter(urun => urun.durum === 'Dışarıda').length },
    { name: 'Serviste', value: urunler.filter(urun => urun.durum === 'Serviste').length },
    { name: 'Kiralandı', value: urunler.filter(urun => urun.durum === 'Kiralandı').length },
  ];
  
  // Günlük hareket raporu için veri hazırlama
  const gunlukHareketVerileri = () => {
    // Son X gün için tarih oluşturma
    const tarihler = [];
    const bugun = new Date();
    const gunSayisi = parseInt(dateRange);
    
    for (let i = 0; i < gunSayisi; i++) {
      const tarih = new Date();
      tarih.setDate(bugun.getDate() - i);
      tarihler.push(tarih.toLocaleDateString('tr-TR'));
    }
    
    // Her gün için giriş/çıkış sayıları
    return tarihler.map(tarih => {
      const gunlukGirisler = hareketler.filter(h => h.tarih === tarih && h.tip === 'Giriş');
      const gunlukCikislar = hareketler.filter(h => h.tarih === tarih && h.tip === 'Çıkış');
      
      return {
        name: tarih,
        giriş: gunlukGirisler.reduce((toplam, hareket) => toplam + hareket.miktar, 0),
        çıkış: gunlukCikislar.reduce((toplam, hareket) => toplam + hareket.miktar, 0)
      };
    }).reverse();
  };
  
  // Renk paleti
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF5733'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
        <div className="flex space-x-2">
          <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150">
            <Printer className="h-5 w-5 mr-2" />
            Yazdır
          </button>
          <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150">
            <Download className="h-5 w-5 mr-2" />
            Excel'e Aktar
          </button>
        </div>
      </div>
      
      {/* Rapor Seçenekleri */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Tipi</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="stok">Kategori Bazlı Stok Raporu</option>
              <option value="durum">Durum Bazlı Ürün Dağılımı</option>
              <option value="hareket">Günlük Hareket Raporu</option>
            </select>
          </div>
          
          {reportType === 'hareket' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="7">Son 7 Gün</option>
                <option value="30">Son 30 Gün</option>
                <option value="90">Son 90 Gün</option>
              </select>
            </div>
          )}
          
          <div className="flex items-end">
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-150">
              <Filter className="h-5 w-5 mr-2" />
              Raporu Göster
            </button>
          </div>
        </div>
      </div>
      
      {/* Rapor Görselleştirme */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {reportType === 'stok' && 'Kategori Bazlı Stok Raporu'}
          {reportType === 'durum' && 'Durum Bazlı Ürün Dağılımı'}
          {reportType === 'hareket' && `Son ${dateRange} Gün Hareket Raporu`}
        </h2>
        
        <div className="h-96">
          {reportType === 'stok' && (
            <ResponsiveContainer width="100%\" height="100%">
              <BarChart
                data={kategoriStokVerileri}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Stok Miktarı" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {reportType === 'durum' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={durumVerileri}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {durumVerileri.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          {reportType === 'hareket' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gunlukHareketVerileri()}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="giriş" name="Giriş" fill="#4ADE80" />
                <Bar dataKey="çıkış" name="Çıkış" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* Özet Tablosu */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Özet Bilgiler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Toplam Ürün</h3>
            <p className="text-2xl font-bold text-blue-900 mt-1">{urunler.length}</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Toplam Stok</h3>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {urunler.reduce((toplam, urun) => toplam + urun.stokMiktari, 0)}
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800">Dışarıdaki Ürünler</h3>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {urunler.filter(urun => urun.durum === 'Dışarıda').length}
            </p>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Düşük Stok Uyarısı</h3>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {urunler.filter(urun => urun.stokMiktari < 5).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raporlar;