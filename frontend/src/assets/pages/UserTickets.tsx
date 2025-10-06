import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  QrCode,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  Filter,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import { paymentRepository } from "../../repositories/paymentRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import UserNavbar from "../components/UseNavbar";
import targetLogo from "../images/target_3484438 (2).png";
import Footer from "../components/Footer";

interface Ticket {
  _id: string;
  userId: string;
  orderId: string;
  eventId: string;
  qrToken: string;
  issuedAt: Date;
  checkedIn: boolean;
  event: {
    _id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    venue: string;
    image: string;
    category: string;
  };
  order: {
    _id: string;
    totalAmount: number;
    status: string;
  };
}

const getBase64FromImage = (imgUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context is null");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });
};

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, filterStatus, limit, currentPage]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (filterStatus != "all") params.append("status", filterStatus);
      if (!user || !user.id) {
        throw new Error("user not present");
      }
      const data = await paymentRepository.getTicketDetails(
        user?.id,
        params.toString(),
        currentPage,
        limit
      );
      setTickets(data.tickets);
      setTotalPage(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isUpcoming = (date: Date) => new Date(date) > new Date();

  const downloadTicket = async (ticket: any) => {
    if (!ticket) return;

    const logoBase64 = await getBase64FromImage(targetLogo);
    const doc = new jsPDF();

    const logoX = 70;
    const logoY = 20;
    const logoWidth = 15;
    const logoHeight = 15;

    doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
    doc.setFontSize(18);
    doc.setTextColor(0);

    const textX = logoX + logoWidth + 5;
    const textY = logoY + logoHeight / 2 + 2;
    doc.text(`${ticket.event.title}`, textX, textY);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 55, 190, 65);

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");

    doc.text(`Event: ${ticket.event.title}`, 20, 65);
    doc.text(`Date: ${formatDate(ticket.event.date)}`, 20, 75);
    doc.text(`Venue: ${ticket.event.venue}`, 20, 85);
    doc.text(`Order ID: ${ticket.order._id}`, 20, 95);
    doc.text(`Tickets: 1`, 20, 105);
    doc.text(`Amount Paid: ${formatCurrency(ticket.order.totalAmount)}`, 20, 115);

    const qrText = `https://myeventsite.com/verify/${ticket.qrToken}`;
    const qrImage = await QRCode.toDataURL(qrText);
    doc.addImage(qrImage, "PNG", 150, 70, 40, 40);

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text("✨ Thank you for booking with EVENTOO ✨", 105, 130, {
      align: "center",
    });

    doc.save(`ticket_${ticket.event.title.replace(/\s+/g, "_")}.pdf`);
  };

  const shareTicket = async (ticket: Ticket) => {
    const doc = new jsPDF();

    const qrText = `https://myeventsite.com/verify/${ticket.qrToken}`;
    const qrImage = await QRCode.toDataURL(qrText);

    doc.text(`Ticket Confirmation`, 10, 10);
    doc.text(`Ticket ID: ${ticket._id.slice(-6)}`, 10, 20);
    doc.text(`Event: ${ticket.event.title}`, 10, 30);
    doc.text(`Date: ${formatDate(ticket.event.date)}`, 10, 40);
    doc.text(`Venue: ${ticket.event.venue}`, 10, 50);
    doc.text(`Amount Paid: ${formatCurrency(ticket.order.totalAmount)}`, 10, 60);
    doc.addImage(qrImage, "PNG", 10, 70, 50, 50);

    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], `ticket_${ticket._id}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.event.title}`,
          text: `Here's my ticket for "${ticket.event.title}" on ${formatDate(ticket.event.date)} at ${ticket.event.venue}.`,
          files: [file],
        });
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket_${ticket._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const message = `🎟️ My Ticket for "${ticket.event.title}"\n\n📅 ${formatDate(ticket.event.date)}\n📍 ${ticket.event.venue}\n💳 Amount Paid: ${formatCurrency(ticket.order.totalAmount)}\n\nYou can verify it here:\n${qrText}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const getImage = (ticket: any) => {
    let imageSrc = "https://via.placeholder.com/300x200";
    if (ticket.event.image && ticket.event.image.length > 0) {
      const img = ticket.event.image[0];
      if (typeof img === "string") {
        if (img.startsWith("http")) {
          imageSrc = img;
        } else {
          imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
        }
      } else if (typeof img === "object" && img.url) {
        imageSrc = img.url;
      }
    }
    return imageSrc;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
          <p className="text-gray-400 text-lg">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />

      {/* Hero Header */}
      <div className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-4">
            <Ticket className="w-4 h-4" />
            MY TICKETS
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Event Tickets</span>
          </h1>
          <p className="text-xl text-gray-400">Access and manage all your event passes in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets by event name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <Filter className="absolute left-4 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-12 pr-8 py-4 bg-transparent text-white appearance-none cursor-pointer focus:outline-none w-full"
                >
                  <option value="all" className="bg-black">All Tickets</option>
                  <option value="upcoming" className="bg-black">Upcoming</option>
                  <option value="past" className="bg-black">Past Events</option>
                  <option value="checkedIn" className="bg-black">Checked In</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value={5} className="bg-black">5</option>
                <option value={10} className="bg-black">10</option>
                <option value={25} className="bg-black">25</option>
                <option value={50} className="bg-black">50</option>
              </select>
            </div>
            <div className="text-gray-400 text-sm">
              Page {currentPage} of {totalPage}
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">No Tickets Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You do not have any tickets matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket, index) => (
              <div
                key={ticket._id}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-purple-500/50 overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-3xl blur opacity-0 group-hover:opacity-20 transition"></div>
                  <img
                    src={getImage(ticket)}
                    alt="Event"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {ticket.checkedIn ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 backdrop-blur-xl">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Checked In
                      </span>
                    ) : isUpcoming(ticket.event.date) ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-xl">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-gray-400 border border-white/20 backdrop-blur-xl">
                        <XCircle className="w-3 h-3 mr-1" />
                        Past Event
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white backdrop-blur-xl shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      #{ticket._id.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                    {ticket.event.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-400" />
                      </div>
                      {formatDate(ticket.event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-400" />
                      </div>
                      {ticket.event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">
                        <MapPin className="w-4 h-4 text-pink-400" />
                      </div>
                      <span className="truncate">{ticket.event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      View QR
                    </button>
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className="ml-2 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10 hover:border-purple-500/50"
                      title="Download Ticket"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareTicket(ticket)}
                      className="ml-2 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10 hover:border-purple-500/50"
                      title="Share Ticket"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentPage === 1
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-purple-500/50"
              }`}
            >
              Previous
            </button>
            <span className="px-6 py-3 bg-white/5 rounded-xl text-white font-semibold border border-white/10">
              Page {currentPage} of {totalPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPage}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentPage === totalPage
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-purple-500/50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-950 via-black to-slate-950 rounded-3xl max-w-md w-full p-8 border border-white/10 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20"></div>
            <div className="relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedTicket.event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-1">
                  {formatDate(selectedTicket.event.date)}
                </p>
                <p className="text-gray-400 text-sm">{selectedTicket.event.venue}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-center">
                <QRCodeSVG
                  value={`https://myeventsite.com/verify/${selectedTicket.qrToken}`}
                  size={200}
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-xs text-gray-500 mb-2 text-center">QR Token</p>
                <p className="text-xs font-mono text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 text-center break-all">
                  {selectedTicket.qrToken}
                </p>
              </div>

              <div className="text-center text-sm text-gray-400 mb-6">
                <p className="mb-1">Show this QR code at the event entrance</p>
                <p className="font-semibold text-white">
                  Ticket ID: #{selectedTicket._id.slice(-6)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadTicket(selectedTicket)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default TicketsPage;