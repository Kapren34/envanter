import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  miktar: number;
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
  loadProducts: () => Promise<void>;
}

const EnvanterContext = createContext<EnvanterContextType | undefined>(undefined);

export const EnvanterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [hareketler, setHareketler] = useState<Hareket[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `);

      if (productsError) {
        console.error('Products loading error:', productsError);
      } else if (products) {
        const mappedProducts = products.map(p => ({
          id: p.id,
          ad: p.name,
          marka: p.brand,
          model: p.model,
          kategori: p.categories?.name || '',
          durum: p.status,
          lokasyon: p.location_id,
          seriNo: p.serial_number,
          aciklama: p.description,
          barkod: p.barcode,
          miktar: p.quantity || 1,
          eklemeTarihi: new Date(p.created_at).toLocaleDateString('tr-TR')
        }));
        setUrunler(mappedProducts);
      }
    } catch (error) {
      console.error('Products loading error:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      // Load categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (categoriesError) {
        console.error('Categories loading error:', categoriesError);
      } else if (categories) {
        const mappedCategories = categories.map(c => ({
          id: c.id,
          ad: c.name
        }));
        setKategoriler(mappedCategories);
      }

      // Load products
      await loadProducts();

      // Load movements
      const { data: movements, error: movementsError } = await supabase
        .from('movements')
        .select(`
          *,
          products (
            name
          )
        `);

      if (movementsError) {
        console.error('Movements loading error:', movementsError);
      } else if (movements) {
        const mappedMovements = movements.map(m => ({
          id: m.id,
          urunId: m.product_id,
          urunAdi: m.products?.name || '',
          tip: m.type,
          miktar: m.quantity,
          tarih: new Date(m.created_at).toLocaleDateString('tr-TR'),
          aciklama: m.description,
          lokasyon: m.location_id,
          kullanici: m.user_id
        }));
        setHareketler(mappedMovements);
      }
    } catch (error) {
      console.error('Data loading error:', error);
    }
  };

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
          barcode: urun.barkod,
          quantity: urun.miktar
        }])
        .select()
        .single();

      if (error) throw error;

      await loadProducts(); // Reload products to ensure consistency
    } catch (error) {
      console.error('Product addition error:', error);
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
          description: updatedUrun.aciklama,
          quantity: updatedUrun.miktar
        })
        .eq('id', id);

      if (error) throw error;

      await loadProducts(); // Reload products to ensure consistency
    } catch (error) {
      console.error('Product update error:', error);
      throw error;
    }
  };

  const removeUrun = async (id: string) => {
    try {
      // First, delete all related movements
      const { error: movementsError } = await supabase
        .from('movements')
        .delete()
        .eq('product_id', id);

      if (movementsError) throw movementsError;

      // Then delete the product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) throw productError;

      // Update local state immediately
      setUrunler(prevUrunler => prevUrunler.filter(urun => urun.id !== id));
      setHareketler(prevHareketler => prevHareketler.filter(hareket => hareket.urunId !== id));

      // Reload data to ensure consistency
      await loadData();
    } catch (error) {
      console.error('Product deletion error:', error);
      throw error;
    }
  };

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

      // Update product quantity based on movement type
      const product = urunler.find(u => u.id === hareket.urunId);
      if (product) {
        const newQuantity = hareket.tip === 'Giriş' 
          ? product.miktar + hareket.miktar 
          : product.miktar - hareket.miktar;

        await updateUrun(hareket.urunId, { miktar: newQuantity });
      }

      await loadData(); // Reload all data to ensure consistency
    } catch (error) {
      console.error('Movement addition error:', error);
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

      await loadData(); // Reload all data to ensure consistency
    } catch (error) {
      console.error('Movement deletion error:', error);
      throw error;
    }
  };

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

      await loadData(); // Reload all data to ensure consistency
    } catch (error) {
      console.error('Category addition error:', error);
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

      await loadData(); // Reload all data to ensure consistency
    } catch (error) {
      console.error('Category deletion error:', error);
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
    isAdmin,
    loadProducts
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