import React, { createContext, useContext, useState, useEffect } from 'react';

// Tip tanımlamaları
interface Urun {
  id: string;
  ad: string;
  marka: string;
  model: string;
  kategori: string;
  durum: string;
  lokasyon: string;
  seriNo: string;
  aciklama: string;
  barkod: string;
  eklemeTarihi: string;
}

interface Hareket {
  id: string;
  urunId: string;
  urunAdi: string;
  tip: string;
  miktar: number;
  tarih: string;
  aciklama: string;
  lokasyon: string;
  kullanici: string;
}

interface Kategori {
  id: string;
  ad: string;
}

interface EnvanterContextType {
  urunler: Urun[];
  hareketler: Hareket[];
  kategoriler: Kategori[];
  addUrun: (urun: Urun) => void;
  updateUrun: (id: string, updatedUrun: Partial<Urun>) => void;
  removeUrun: (id: string) => void;
  addHareket: (hareket: Hareket) => void;
  removeHareket: (id: string) => void;
  addKategori: (kategori: Kategori) => void;
  removeKategori: (id: string) => void;
}

// Örnek veriler
const ornekKategoriler: Kategori[] = [
  { id: '1', ad: 'Ses Sistemleri' },
  { id: '2', ad: 'Işık Sistemleri' },
  { id: '3', ad: 'Görüntü Sistemleri' },
  { id: '4', ad: 'Kablolar' },
  { id: '5', ad: 'Mikserler' },
  { id: '6', ad: 'Mikrofonlar' },
  { id: '7', ad: 'Projektörler' },
];

const ornekUrunler: Urun[] = [
  {
    id: '1',
    ad: 'Profesyonel Mikrofon',
    marka: 'Shure',
    model: 'SM58',
    kategori: 'Mikrofonlar',
    durum: 'Depoda',
    lokasyon: 'Merkez',
    seriNo: 'SHR-1234567',
    aciklama: 'Profesyonel sahne mikrofonu',
    barkod: 'MIKSHUSM58-001',
    eklemeTarihi: '15.01.2024',
  },
  {
    id: '2',
    ad: 'LED Par Işık',
    marka: 'Stairville',
    model: 'PAR64',
    kategori: 'Işık Sistemleri',
    durum: 'Depoda',
    lokasyon: 'Merkez',
    seriNo: 'STV-98765',
    aciklama: 'RGB LED sahne ışığı',
    barkod: 'ISISTVPAR-002',
    eklemeTarihi: '20.11.2023',
  },
  {
    id: '3',
    ad: 'Aktif Hoparlör',
    marka: 'JBL',
    model: 'EON615',
    kategori: 'Ses Sistemleri',
    durum: 'Dışarıda',
    lokasyon: 'Otel A',
    seriNo: 'JBL-7654321',
    aciklama: '1000W 15" aktif hoparlör',
    barkod: 'SESJBLEON-003',
    eklemeTarihi: '05.09.2023',
  },
  {
    id: '4',
    ad: 'HDMI Projeksiyon Cihazı',
    marka: 'Epson',
    model: 'EB-X41',
    kategori: 'Görüntü Sistemleri',
    durum: 'Kiralandı',
    lokasyon: 'Otel B',
    seriNo: 'EPS-112233',
    aciklama: '3600 lümen XGA projeksiyon',
    barkod: 'GOREPSON-004',
    eklemeTarihi: '10.12.2023',
  },
  {
    id: '5',
    ad: 'Dijital Mikser',
    marka: 'Behringer',
    model: 'X32',
    kategori: 'Mikserler',
    durum: 'Serviste',
    lokasyon: 'Merkez',
    seriNo: 'BHR-445566',
    aciklama: '32 kanallı dijital mikser',
    barkod: 'MIKBEHX32-005',
    eklemeTarihi: '22.08.2023',
  },
  {
    id: '6',
    ad: 'DMX Kontrol Ünitesi',
    marka: 'American DJ',
    model: 'DMX Operator',
    kategori: 'Işık Sistemleri',
    durum: 'Depoda',
    lokasyon: 'Merkez',
    seriNo: 'ADJ-998877',
    aciklama: 'Profesyonel DMX ışık kontrol ünitesi',
    barkod: 'ISIADJDMX-006',
    eklemeTarihi: '05.02.2024',
  },
];

const ornekHareketler: Hareket[] = [
  {
    id: '1',
    urunId: '3',
    urunAdi: 'Aktif Hoparlör',
    tip: 'Çıkış',
    miktar: 2,
    tarih: '01.03.2024',
    aciklama: 'Otel A etkinliği için çıkış yapıldı',
    lokasyon: 'Otel A',
    kullanici: 'Admin',
  },
  {
    id: '2',
    urunId: '4',
    urunAdi: 'HDMI Projeksiyon Cihazı',
    tip: 'Çıkış',
    miktar: 1,
    tarih: '05.03.2024',
    aciklama: 'Otel B konferans salonu için kiralama',
    lokasyon: 'Otel B',
    kullanici: 'Admin',
  },
  {
    id: '3',
    urunId: '5',
    urunAdi: 'Dijital Mikser',
    tip: 'Çıkış',
    miktar: 1,
    tarih: '10.03.2024',
    aciklama: 'Arıza tespiti için servise gönderildi',
    lokasyon: 'Servis',
    kullanici: 'Admin',
  },
  {
    id: '4',
    urunId: '1',
    urunAdi: 'Profesyonel Mikrofon',
    tip: 'Giriş',
    miktar: 3,
    tarih: '15.03.2024',
    aciklama: 'Yeni stok alımı',
    lokasyon: 'Merkez',
    kullanici: 'Admin',
  },
  {
    id: '5',
    urunId: '2',
    urunAdi: 'LED Par Işık',
    tip: 'Giriş',
    miktar: 5,
    tarih: '20.03.2024',
    aciklama: 'Yeni stok alımı',
    lokasyon: 'Merkez',
    kullanici: 'Admin',
  },
];

// Context oluşturma
const EnvanterContext = createContext<EnvanterContextType | undefined>(undefined);

// Provider bileşeni
export const EnvanterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urunler, setUrunler] = useState<Urun[]>(ornekUrunler);
  const [hareketler, setHareketler] = useState<Hareket[]>(ornekHareketler);
  const [kategoriler, setKategoriler] = useState<Kategori[]>(ornekKategoriler);
  
  // localStorage'dan verileri yükle
  useEffect(() => {
    const storedUrunler = localStorage.getItem('urunler');
    const storedHareketler = localStorage.getItem('hareketler');
    const storedKategoriler = localStorage.getItem('kategoriler');
    
    if (storedUrunler) setUrunler(JSON.parse(storedUrunler));
    if (storedHareketler) setHareketler(JSON.parse(storedHareketler));
    if (storedKategoriler) setKategoriler(JSON.parse(storedKategoriler));
  }, []);
  
  // Verileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('urunler', JSON.stringify(urunler));
    localStorage.setItem('hareketler', JSON.stringify(hareketler));
    localStorage.setItem('kategoriler', JSON.stringify(kategoriler));
  }, [urunler, hareketler, kategoriler]);
  
  // Ürün işlemleri
  const addUrun = (urun: Urun) => {
    setUrunler([...urunler, urun]);
  };
  
  const updateUrun = (id: string, updatedUrun: Partial<Urun>) => {
    setUrunler(
      urunler.map((urun) => (urun.id === id ? { ...urun, ...updatedUrun } : urun))
    );
  };
  
  const removeUrun = (id: string) => {
    setUrunler(urunler.filter((urun) => urun.id !== id));
    setHareketler(hareketler.filter((hareket) => hareket.urunId !== id));
  };
  
  // Hareket işlemleri
  const addHareket = (hareket: Hareket) => {
    setHareketler([...hareketler, hareket]);
  };
  
  const removeHareket = (id: string) => {
    setHareketler(hareketler.filter((hareket) => hareket.id !== id));
  };
  
  // Kategori işlemleri
  const addKategori = (kategori: Kategori) => {
    setKategoriler([...kategoriler, kategori]);
  };
  
  const removeKategori = (id: string) => {
    setKategoriler(kategoriler.filter((kategori) => kategori.id !== id));
  };
  
  const value = {
    urunler,
    hareketler,
    kategoriler,
    addUrun,
    updateUrun,
    removeUrun,
    addHareket,
    removeHareket,
    addKategori,
    removeKategori,
  };

  return (
    <EnvanterContext.Provider value={value}>
      {children}
    </EnvanterContext.Provider>
  );
};

// Context'i kullanmak için hook
export const useEnvanter = () => {
  const context = useContext(EnvanterContext);
  if (context === undefined) {
    throw new Error('useEnvanter hook must be used within an EnvanterProvider');
  }
  return context;
};