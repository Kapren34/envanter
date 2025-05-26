import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  addUrun: (urun: Urun) => Promise<void>;
  updateUrun: (id: string, updatedUrun: Partial<Urun>) => Promise<void>;
  removeUrun: (id: string) => Promise<void>;
  addHareket: (hareket: Hareket) => Promise<void>;
  removeHareket: (id: string) => Promise<void>;
  addKategori: (kategori: Kategori) => Promise<void>;
  removeKategori: (id: string) => Promise<void>;
  isAdmin: boolean;
}

const EnvanterContext = createContext<EnvanterContextType | undefined>(undefined);

export const EnvanterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [hareketler, setHareketler] = useState<Hareket[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [isAdmin, setIsAdmin] = useState(true); // Always admin for now

  // Verileri Supabase'den yükle
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Kategorileri yükle
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (categoriesError) {
        console.error('Kategoriler yüklenirken hata:', categoriesError);
      } else {
        setKategoriler(categories.map(c => ({
          id: c.id,
          ad: c.name
        })));
      }

      // Ürünleri yükle
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) {
        console.error('Ürünler yüklenirken hata:', productsError);
      } else {
        setUrunler(products.map(p => ({
          id: p.id,
          ad: p.name,
          marka: p.brand,
          model: p.model,
          kategori: p.category_id,
          durum: p.status,
          lokasyon: p.location_id,
          seriNo: p.serial_number,
          aciklama: p.description,
          barkod: p.barcode,
          eklemeTarihi: new Date(p.created_at).toLocaleDateString('tr-TR')
        })));
      }

      // Hareketleri yükle
      const { data: movements, error: movementsError } = await supabase
        .from('movements')
        .select('*');
      
      if (movementsError) {
        console.error('Hareketler yüklenirken hata:', movementsError);
      } else {
        setHareketler(movements.map(m => ({
          id: m.id,
          urunId: m.product_id,
          urunAdi: urunler.find(u => u.id === m.product_id)?.ad || '',
          tip: m.type,
          miktar: m.quantity,
          tarih: new Date(m.created_at).toLocaleDateString('tr-TR'),
          aciklama: m.description,
          lokasyon: m.location_id,
          kullanici: m.user_id
        })));
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    }
  };

  // Ürün işlemleri
  const addUrun = async (urun: Urun) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: urun.ad,
          brand: urun.marka,
          model: urun.model,
          category_id: urun.kategori,
          status: urun.durum,
          location_id: urun.lokasyon,
          serial_number: urun.seriNo,
          description: urun.aciklama,
          barcode: urun.barkod
        }])
        .select()
        .single();

      if (error) throw error;

      setUrunler([...urunler, { ...urun, id: data.id }]);
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      throw error;
    }
  };

  const updateUrun = async (id: string, updatedUrun: Partial<Urun>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedUrun.ad,
          brand: updatedUrun.marka,
          model: updatedUrun.model,
          category_id: updatedUrun.kategori,
          status: updatedUrun.durum,
          location_id: updatedUrun.lokasyon,
          serial_number: updatedUrun.seriNo,
          description: updatedUrun.aciklama
        })
        .eq('id', id);

      if (error) throw error;

      setUrunler(urunler.map((urun) => 
        urun.id === id ? { ...urun, ...updatedUrun } : urun
      ));
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      throw error;
    }
  };

  const removeUrun = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUrunler(urunler.filter((urun) => urun.id !== id));
      setHareketler(hareketler.filter((hareket) => hareket.urunId !== id));
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      throw error;
    }
  };

  // Hareket işlemleri
  const addHareket = async (hareket: Hareket) => {
    try {
      const { data, error } = await supabase
        .from('movements')
        .insert([{
          product_id: hareket.urunId,
          type: hareket.tip,
          quantity: hareket.miktar,
          description: hareket.aciklama,
          location_id: hareket.lokasyon
        }])
        .select()
        .single();

      if (error) throw error;

      setHareketler([...hareketler, { ...hareket, id: data.id }]);
    } catch (error) {
      console.error('Hareket ekleme hatası:', error);
      throw error;
    }
  };

  const removeHareket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHareketler(hareketler.filter((hareket) => hareket.id !== id));
    } catch (error) {
      console.error('Hareket silme hatası:', error);
      throw error;
    }
  };

  // Kategori işlemleri
  const addKategori = async (kategori: Kategori) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: kategori.ad
        }])
        .select()
        .single();

      if (error) throw error;

      setKategoriler([...kategoriler, { ...kategori, id: data.id }]);
    } catch (error) {
      console.error('Kategori ekleme hatası:', error);
      throw error;
    }
  };

  const removeKategori = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKategoriler(kategoriler.filter((kategori) => kategori.id !== id));
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      throw error;
    }
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
    isAdmin
  };

  return (
    <EnvanterContext.Provider value={value}>
      {children}
    </EnvanterContext.Provider>
  );
};

export const useEnvanter = () => {
  const context = useContext(EnvanterContext);
  if (context === undefined) {
    throw new Error('useEnvanter hook must be used within an EnvanterProvider');
  }
  return context;
};