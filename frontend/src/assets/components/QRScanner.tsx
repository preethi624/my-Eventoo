// components/QrScanner.tsx
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import React from "react";

interface Props {
  onScanSuccess: (scannedToken: string) => void;
}

const QrScanner: React.FC<Props> = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear();
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div className="p-4">
      <div id="qr-reader" className="w-full h-[300px]"></div>
    </div>
  );
};

export default QrScanner;
