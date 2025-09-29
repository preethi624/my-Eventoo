// pages/organizer/CheckIn.tsx
import { useState } from "react";



import QrScanner from "../components/QRScanner";

import { organiserRepository } from "../../repositories/organiserRepositories";

const CheckInPage = () => {
  const [message, setMessage] = useState("");

  const handleScanSuccess = async (qrData: string) => {
    try {
      const qrToken = qrData.split("/").pop();
      if (!qrToken) {
        throw new Error("qr token not present");
      }
      const response = await organiserRepository.updateTicket(qrToken);

      setMessage(response.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid ticket");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Scan Ticket</h2>
      <QrScanner onScanSuccess={handleScanSuccess} />
      <p className="mt-4 text-green-600 font-medium">{message}</p>
    </div>
  );
};

export default CheckInPage;
