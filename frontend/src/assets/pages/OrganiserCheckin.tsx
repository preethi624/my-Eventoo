import { useState } from "react";
import QrScanner from "../components/QRScanner";
import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import { 
  ScanLine, 
  CheckCircle, 
  XCircle,
  Ticket,
  Shield,
  Zap
} from "lucide-react";
import OrganiserFooter from "../components/OrganiserFooter";

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

  // Determine if message indicates success or error
  const isSuccess = message && !message.toLowerCase().includes("invalid") && !message.toLowerCase().includes("error") && !message.toLowerCase().includes("failed");
  const isError = message && !isSuccess;

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl shadow-blue-500/30">
              <ScanLine className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Scan Ticket
            </h2>
            <p className="text-gray-400 text-lg">
              Position QR code in the scanner to verify entry
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2.5 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Fast</p>
                  <p className="text-sm font-semibold text-white">Instant Check-In</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2.5 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Secure</p>
                  <p className="text-sm font-semibold text-white">Verified Entry</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 shadow-lg hover:shadow-green-500/20 transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2.5 rounded-lg">
                  <Ticket className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Real-Time</p>
                  <p className="text-sm font-semibold text-white">Live Updates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scanner Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">QR Code Scanner</h3>
                  <p className="text-blue-100 text-sm">Hold the QR code steady within the frame</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Scanner with decorative corners */}
              <div className="relative rounded-2xl bg-gray-900/50 border-2 border-gray-700/50 shadow-inner">
                {/* Decorative scanning corners */}
                <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-blue-500 rounded-tl-2xl z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-blue-500 rounded-tr-2xl z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-blue-500 rounded-bl-2xl z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-blue-500 rounded-br-2xl z-10 pointer-events-none"></div>
                
                {/* Scanner Component */}
                <div className="relative w-full">
                  <div className="w-full [&>div]:w-full [&>div]:h-auto [&_video]:w-full [&_video]:h-auto [&_video]:rounded-xl">
                    <QrScanner onScanSuccess={handleScanSuccess} />
                  </div>
                </div>
              </div>

              {/* Scanning Status */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-300 font-medium">Ready to scan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`rounded-2xl p-6 shadow-2xl border transition-all duration-300 ${
                isSuccess
                  ? "bg-green-500/10 border-green-500/30"
                  : isError
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-blue-500/10 border-blue-500/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isSuccess
                      ? "bg-green-500/20"
                      : isError
                      ? "bg-red-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-bold text-lg mb-1 ${
                      isSuccess
                        ? "text-green-300"
                        : isError
                        ? "text-red-300"
                        : "text-blue-300"
                    }`}
                  >
                    {isSuccess ? "Check-In Successful!" : "Check-In Failed"}
                  </h4>
                  <p
                    className={`font-medium ${
                      isSuccess
                        ? "text-green-200"
                        : isError
                        ? "text-red-200"
                        : "text-blue-200"
                    }`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default CheckInPage;