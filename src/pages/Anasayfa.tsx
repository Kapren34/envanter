import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, BarChart3, ArrowRight, Clock, MapPin, PenTool as Tool, SpeakerIcon, Lightbulb, Monitor, Music2, Radio, Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEnvanter } from '../contexts/EnvanterContext';

const Anasayfa = () => {
  const { urunler, hareketler } = useEnvanter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sonHareketler = hareketler.slice(0, 5);
  const toplamUrun = urunler.length;
  const disaridaOlanUrunler = urunler.filter(urun => urun.durum === 'Dışarıda').length;
  const servistekiUrunler = urunler.filter(urun => urun.durum === 'Serviste').length;
  const kiralananUrunler = urunler.filter(urun => urun.durum === 'Kiralandı').length;

  return (
    <div className={`space-y-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl text-white p-8 shadow-lg">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">POWERSOUND</h1>
              <p className="text-indigo-200 mb-6">Profesyonel Ses, Işık ve Görüntü Sistemleri</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <SpeakerIcon className="h-8 w-8 mx-auto mb-2 text-indigo-300" />
                  <p className="text-sm font-medium">Ses Sistemleri</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <p className="text-sm font-medium">Işık Sistemleri</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <p className="text-sm font-medium">Görüntü Sistemleri</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/urunler/ekle"
                  className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center transform hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Yeni Ekipman Ekle
                </Link>
                <Link
                  to="/hareketler/ekle"
                  className="bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-800 transition-all duration-300 flex items-center transform hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Hareket Kaydet
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <div className="absolute inset-0 bg-gradient-to-l from-white via-white to-transparent transform rotate-12 translate-x-1/2"></div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Music2 className="h-8 w-8" />
              <span className="text-2xl font-bold">{toplamUrun}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Ses Ekipmanları</h3>
            <p className="text-blue-100 text-sm">Mikrofon, Hoparlör, Mixer</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Radio className="h-8 w-8" />
              <span className="text-2xl font-bold">{disaridaOlanUrunler}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Işık Sistemleri</h3>
            <p className="text-yellow-100 text-sm">Spot, LED, Efekt</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Mic2 className="h-8 w-8" />
              <span className="text-2xl font-bold">{servistekiUrunler}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Görüntü Sistemleri</h3>
            <p className="text-purple-100 text-sm">Projeksiyon, LED Ekran</p>
          </div>
        </div>
      </div>

      {/* Son Hareketler ve Hızlı Erişim */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Hareketler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-indigo-600" />
            Son Ekipman Hareketleri
          </h2>
          {sonHareketler.length > 0 ? (
            <div className="space-y-3">
              {sonHareketler.map((hareket, index) => (
                <div
                  key={hareket.id}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-[1.01] duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
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
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Henüz hareket kaydı bulunmamaktadır.</p>
            </div>
          )}
          <div className="mt-6 text-right">
            <Link
              to="/hareketler"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
            >
              Tüm hareketleri görüntüle
              <ArrowRight className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-indigo-600" />
            Hızlı Erişim
          </h2>
          <div className="grid gap-3">
            {[
              {
                title: 'Ekipman Listesi',
                description: 'Tüm ekipmanları görüntüle ve yönet',
                icon: <Package className="h-5 w-5 text-blue-600" />,
                link: '/urunler',
                bgColor: 'bg-blue-100'
              },
              {
                title: 'Hareket Kayıtları',
                description: 'Giriş ve çıkışları takip et',
                icon: <RefreshCw className="h-5 w-5 text-green-600" />,
                link: '/hareketler',
                bgColor: 'bg-green-100'
              },
              {
                title: 'Raporlar ve Analizler',
                description: 'Detaylı raporlar ve istatistikler',
                icon: <BarChart3 className="h-5 w-5 text-purple-600" />,
                link: '/raporlar',
                bgColor: 'bg-purple-100'
              }
            ].map((item, index) => (
              <Link
                key={item.title}
                to={item.link}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mr-4`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transform transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Anasayfa;