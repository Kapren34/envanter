export const printBarkod = (barkodRef: React.RefObject<HTMLCanvasElement>) => {
  const canvas = barkodRef.current;
  if (!canvas) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Get the barcode image
  const barkodImage = canvas.toDataURL('image/png');

  // Create print document
  printWindow.document.write(`
    <html>
      <head>
        <title>Barkod Yazdır</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          img { max-width: 100%; height: auto; }
          @media print {
            body { margin: 0; padding: 0; }
            img { width: 100%; max-width: 300px; }
          }
        </style>
      </head>
      <body>
        <img src="${barkodImage}" onload="window.print(); window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
};