// Benzersiz barkod oluşturma fonksiyonu
export const generateBarkod = (): string => {
  const prefix = 'PS'; // PowerSound prefix
  const timestamp = Date.now().toString().slice(-10); // Son 10 haneyi al
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 haneli rastgele sayı
  
  return `${prefix}${timestamp}${random}`;
};

// Barkod kontrolü
export const checkExistingBarkod = async (supabase: any, name: string, brand: string, model: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('barcode')
      .eq('name', name)
      .eq('brand', brand || '')
      .eq('model', model || '')
      .single();

    if (error) {
      console.error('Barkod kontrol hatası:', error);
      return null;
    }

    return data?.barcode || null;
  } catch (error) {
    console.error('Barkod kontrol hatası:', error);
    return null;
  }
};

// Tarih formatlama fonksiyonu (YYYY-MM-DD -> DD.MM.YYYY)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

// Tarih formatlama fonksiyonu (DD.MM.YYYY -> YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
};