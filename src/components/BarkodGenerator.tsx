import React from 'react';
import JsBarcode from 'jsbarcode';

interface BarkodGeneratorProps {
  barkod: string;
  urunAdi: string;
}

const BarkodGenerator: React.FC<BarkodGeneratorProps> = ({ barkod, urunAdi }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (canvasRef.current && barkod) {
      JsBarcode(canvasRef.current, barkod, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true,
        text: barkod,
        fontSize: 16,
        margin: 10,
      });
    }
  }, [barkod]);

  return (
    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-white">
      <p className="text-sm text-gray-700 mb-2">{urunAdi}</p>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BarkodGenerator;