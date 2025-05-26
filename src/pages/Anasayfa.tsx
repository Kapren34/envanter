import React from 'react';
import { Package, RefreshCw, BarChart3, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEnvanter } from '../contexts/EnvanterContext';

const Anasayfa = () => {
  const { urunler, hareketler } = useEnvanter();

  // Son hareketler
  const sonHareketler = hareketler.slice(0, 5);

  // Düşük stok ürünleri (stok < 5 olarak kabul edildi)
  const dusukStokUrunleri = urunler.filter((urun) => urun.stokMiktari < 5);

  // Toplam ürün sayısı
  const toplamUrun = urunler.length;

  // Dışarıda olan ürünler (durumu "Dışarıda" olanlar)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hoş Geldiniz</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Toplam Ürün</p>
              <h3 className="text-2xl font-bold text-gray-800">{toplamUrun}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/urunler"
              className="text-sm text-blue-600 hover:underline"
            >
              Tüm ürünleri görüntüle
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Dışarıda</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {disaridaOlanUrunler}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/hareketler"
              className="text-sm text-green-600 hover:underline"
            >
              Hareketleri görüntüle
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Serviste</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {servistekiUrunler}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/raporlar"
              className="text-sm text-yellow-600 hover:underline"
            >
              Detaylı rapor
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Kiralandı</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {kiralananUrunler}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/raporlar"
              className="text-sm text-purple-600 hover:underline"
            >
              Kiralama detayları
            </Link>
          </div>
        </div>
      </div>

      {/* Son Hareketler ve Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Hareketler */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Son Hareketler
          </h2>
          {sonHareketler.length > 0 ? (
            <div className="space-y-3">
              {sonHareketler.map((hareket) => (
                <div
                  key={hareket.id}
                  className="flex items-center p-3 border-b border-gray-100"
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
                  <div className="text-sm font-medium">
                    {hareket.miktar} adet
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Henüz hareket kaydı bulunmamaktadır.
            </p>
          )}
          <div className="mt-4 text-right">
            <Link
              to="/hareketler"
              className="text-sm text-indigo-600 hover:underline"
            >
              Tüm hareketleri görüntüle
            </Link>
          </div>
        </div>

        {/* Düşük Stok Uyarıları */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4"></h2>
          {dusukStokUrunleri.length > 0 ? (
            <div className="space-y-3">
              {dusukStokUrunleri.map((urun) => (
                <div
                  key={urun.id}
                  className="flex items-center p-3 border-b border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {urun.ad}
                    </p>
                    <p className="text-xs text-gray-500">{urun.kategori}</p>
                  </div>
                  <div className="text-sm font-medium text-red-600"></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4"></p>
          )}
          <div className="mt-4 text-right">
            <Link
              to="/urunler"
              className="text-sm text-indigo-600 hover:underline"
            ></Link>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim Butonları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/urunler/ekle"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm text-center transition duration-150"
        >
          Yeni Ürün Ekle
        </Link>
        <Link
          to="/hareketler/ekle"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm text-center transition duration-150"
        >
          Yeni Hareket Kaydet
        </Link>
        <Link
          to="/raporlar"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm text-center transition duration-150"
        >
          Raporları Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default Anasayfa;
