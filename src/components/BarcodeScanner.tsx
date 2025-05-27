import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BarcodeScannerProps {
  onClose?: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Focus input when component mounts
    const input = document.getElementById('barcode-input');
    if (input) {
      input.focus();
    }

    // Handle barcode scanner input
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.key === 'Enter' && barcodeInput) {
        try {
          // Search for product with scanned barcode
          const { data, error } = await supabase
            .from('products')
            .select('id')
            .eq('barcode', barcodeInput)
            .single();

          if (error) {
            console.error('Error searching for product:', error);
            return;
          }

          if (data) {
            // Navigate to product details
            navigate(`/urunler/${data.id}`);
            if (onClose) onClose();
          } else {
            alert('Ürün bulunamadı');
          }
        } catch (error) {
          console.error('Error:', error);
        }

        setBarcodeInput('');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [barcodeInput, navigate, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Barkod Tarama</h2>
        <input
          id="barcode-input"
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Barkodu okutun veya girin..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          autoComplete="off"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;