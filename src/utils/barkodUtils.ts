// Benzersiz barkod oluşturma fonksiyonu
export const generateBarkod = (): string => {
  const prefix = 'INV'; // Inventory prefix
  const timestamp = Date.now().toString().slice(-10); // Son 10 haneyi al
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 haneli rastgele sayı
  
  return `${prefix}${timestamp}${random}`;
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