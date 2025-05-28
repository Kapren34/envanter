import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Anasayfa from './pages/Anasayfa';
import UrunListesi from './pages/UrunListesi';
import UrunEkle from './pages/UrunEkle';
import UrunDetay from './pages/UrunDetay';
import Hareketler from './pages/Hareketler';
import HareketEkle from './pages/HareketEkle';
import Raporlar from './pages/Raporlar';
import Ayarlar from './pages/Ayarlar';
import Depo from './pages/Depo';
import { EnvanterProvider } from './contexts/EnvanterContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <EnvanterProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Anasayfa />} />
              <Route path="depo" element={<Depo />} />
              <Route path="urunler" element={<UrunListesi />} />
              <Route path="urunler/ekle" element={<UrunEkle />} />
              <Route path="urunler/:id" element={<UrunDetay />} />
              <Route path="hareketler" element={<Hareketler />} />
              <Route path="hareketler/ekle" element={<HareketEkle />} />
              <Route path="raporlar" element={<Raporlar />} />
              <Route path="ayarlar" element={<Ayarlar />} />
            </Route>
          </Routes>
        </Router>
      </EnvanterProvider>
    </AuthProvider>
  );
}

export default App;