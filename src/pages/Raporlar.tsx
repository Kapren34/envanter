import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Printer } from 'lucide-react';
import { useEnvanter } from '../contexts/EnvanterContext';
import { exportToExcel } from '../utils/excelUtils';
import { supabase } from '../lib/supabase';

const Raporlar = () => {
  const { urunler, hareketler } = useEnvanter();
  const [reportType, setReportType] = useState('stok');
  const [dateRange, setDateRange] = useState('30');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
      } else if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);
  
  // Kategori bazında stok raporu
  const kategoriStokVerileri = categories.map(category => {
    const categoryProducts = urunler.filter(urun => urun.kategori === category.id);
    return {
      name: category.name,
      value: categoryProducts.length
    };
  }).filter(data => data.value > 0);
  
  // Durum bazında ürün dağılımı
  const durumVerileri = [
    { name: 'Depoda', value: urunler.filter(urun => urun.durum === 'Depoda').length },
    { name: 'Dışarıda', value: urunler.filter(urun => urun.durum === 'Dışarıda').length },
    { name: 'Serviste', value: urunler.filter(urun => urun.durum === 'Serviste').length },
    { name: 'Kiralandı', value: urunler.filter(urun => urun.durum === 'Kiralandı').length },
  ].filter(data => data.value > 0);
  
  // Günlük hareket raporu için veri hazırlama
  const gunlukHareketVerileri = () => {
    const tarihler = [];
    const bugun = new Date();
    const gunSayisi = parseInt(dateRange);
    
    for (let i = 0; i < gunSayisi; i++) {
      const tarih = new Date();
      tarih.setDate(bugun.getDate() - i);
      tarihler.push(tarih.toLocaleDateString('tr-TR'));
    }
    
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

  // Calculate summary statistics
  const totalProducts = urunler.length;
  const productsInStock = urunler.filter(urun => urun.durum === 'Depoda').length;
  const productsInService = urunler.filter(urun => urun.durum === 'Serviste').length;
  const productsRented = urunler.filter(urun => urun.durum === 'Kiralandı').length;
  const productsOutside = urunler.filter(urun => urun.durum === 'Dışarıda').length;
  
  // Calculate movement statistics
  const totalMovements = hareketler.length;
  const incomingMovements = hareketler.filter(h => h.tip === 'Giriş').length;
  const outgoingMovements = hareketler.filter(h => h.tip === 'Çıkış').length;
  
  // Renk paleti
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF5733'];

  // Export report data
  const exportReport = () => {
    let data = [];
    
    if (reportType === 'stok') {
      data = kategoriStokVerileri.map(item => ({
        'Kategori': item.name,
        'Ürün Sayısı': item.value
      }));
    } else if (reportType === 'durum') {
      data = durumVerileri.map(item => ({
        'Durum': item.name,
        'Ürün Sayısı': item.value
      }));
    } else {
      data = gunlukHareketVerileri().map(item => ({
        'Tarih': item.name,
        'Giriş': item.giriş,
        'Çıkış': item.çıkış
      }));
    }

    exportToExcel(data, `Rapor_${reportType}_${new Date().toLocaleDateString('tr-TR')}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.print()}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150"
          >
            <Printer className="h-5 w-5 mr-2" />
            Yazdır
          </button>
          <button 
            onClick={exportReport}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-150"
          >
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
          {reportType === 'stok' && kategoriStokVerileri.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={kategoriStokVerileri}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Ürün Sayısı" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {reportType === 'durum' && durumVerileri.length > 0 && (
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
      
      {/* Özet Bilgiler */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Özet Bilgiler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ürün İstatistikleri */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Toplam Ürün</h3>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalProducts}</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Depodaki Ürünler</h3>
              <p className="text-2xl font-bold text-green-900 mt-1">{productsInStock}</p>
            </div>
          </div>

          {/* Durum İstatistikleri */}
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Servisteki Ürünler</h3>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{productsInService}</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Kiralanan Ürünler</h3>
              <p className="text-2xl font-bold text-purple-900 mt-1">{productsRented}</p>
            </div>
          </div>

          {/* Hareket İstatistikleri */}
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-800">Toplam Hareket</h3>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{totalMovements}</p>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Dışarıdaki Ürünler</h3>
              <p className="text-2xl font-bold text-red-900 mt-1">{productsOutside}</p>
            </div>
          </div>

          {/* Giriş/Çıkış İstatistikleri */}
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h3 className="text-sm font-medium text-emerald-800">Giriş Hareketleri</h3>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{incomingMovements}</p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800">Çıkış Hareketleri</h3>
              <p className="text-2xl font-bold text-orange-900 mt-1">{outgoingMovements}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raporlar;