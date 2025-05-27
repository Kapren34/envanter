import React from 'react';
import { Package, RefreshCw, BarChart3, ArrowRight, Clock, MapPin, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEnvanter } from '../contexts/EnvanterContext';

const Anasayfa = () => {
  const { urunler, hareketler } = useEnvanter();

  // Son hareketler
  const sonHareketler = hareketler.slice(0, 5);

  // Toplam ürün sayısı
  const toplamUrun = urunler.length;

  // Dışarıda olan ürünler
  const disaridaOlanUrunler = urunler.filter(
    (urun) => urun.durum === 'Dışarıda'
  ).length;

  // Servisteki ürünler
  const servistekiUrunler = urunler.filter(
    (urun) => urun.durum === 'Serviste'
  ).length;

  // Kiralanan ürünler
  const kiralananUrunler = urunler.filter(
    (urun) => urun.durum === 'Kiralandı'
  ).length;

  return (
    <div className="space-y-8">
      {/* Hoş Geldiniz Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz</h1>
        <p className="text-indigo-100 mb-6">Cyprus PowerSound Depo Yönetimi</p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/urunler/ekle"
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center"
          >
            <Package className="h-5 w-5 mr-2" />
            Yeni Malzeme Ekle
          </Link>
          <Link
            to="/hareketler/ekle"
            className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Hareket Kaydet
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Toplam Malzeme</p>
              <h3 className="text-2xl font-bold text-gray-800">{toplamUrun}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/urunler"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Tüm malzemeleri görüntüle
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Dışarıda</p>
              <h3 className="text-2xl font-bold text-gray-800">{disaridaOlanUrunler}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/hareketler"
              className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
            >
              Hareketleri görüntüle
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Serviste</p>
              <h3 className="text-2xl font-bold text-gray-800">{servistekiUrunler}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Tool className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/raporlar"
              className="text-sm text-yellow-600 hover:text-yellow-800 font-medium flex items-center"
            >
              Detaylı rapor
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Kiralandı</p>
              <h3 className="text-2xl font-bold text-gray-800">{kiralananUrunler}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/raporlar"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
            >
              Kiralama detayları
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Son Hareketler ve Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Hareketler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-indigo-600" />
            Son Hareketler
          </h2>
          {sonHareketler.length > 0 ? (
            <div className="space-y-4">
              {sonHareketler.map((hareket) => (
                <div
                  key={hareket.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      hareket.tip === 'Giriş'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {hareket.urunAdi}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hareket.tip} - {hareket.tarih} - {hareket.kullanici}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {hareket.miktar} adet
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Henüz hareket kaydı bulunmamaktadır.</p>
            </div>
          )}
          <div className="mt-6 text-right">
            <Link
              to="/hareketler"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Tüm hareketleri görüntüle
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-indigo-600" />
            Hızlı Erişim
          </h2>
          <div className="grid gap-4">
            <Link
              to="/urunler"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Malzeme Listesi</p>
                <p className="text-xs text-gray-500">Tüm malzemeleri görüntüle ve yönet</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              to="/hareketler"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <RefreshCw className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Hareket Kayıtları</p>
                <p className="text-xs text-gray-500">Giriş ve çıkışları takip et</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              to="/raporlar"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Raporlar</p>
                <p className="text-xs text-gray-500">Detaylı analiz ve raporlar</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anasayfa;