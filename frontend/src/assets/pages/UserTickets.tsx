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
} from "lucide-react";
import { paymentRepository } from "../../repositories/paymentRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import UserNavbar from "../components/UseNavbar";
import targetLogo from "../images/target_3484438 (2).png";

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
        throw new Error("usser not present");
      }
      const data = await paymentRepository.getTicketDetails(
        user?.id,
        params.toString(),
        currentPage,
        limit
      );
      console.log("data", data);
      setTickets(data.tickets);
      setTotalPage(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("tot", totalPage);

  const generateQRCode = (qrToken: string) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">QR: ${qrToken}</text>
      </svg>
    `)}`;
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
  console.log("limit", limit);

  const isUpcoming = (date: Date) => new Date(date) > new Date();

  const downloadTicket = async (ticket: any) => {
    if (!ticket) return;

    const logoBase64 = await getBase64FromImage(targetLogo);
    const doc = new jsPDF();

    // Header logo + title
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

    // Ticket body
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
    doc.text(`Tickets: 1`, 20, 105); // if each record = 1 ticket
    doc.text(
      `Amount Paid: ${formatCurrency(ticket.order.totalAmount)}`,
      20,
      115
    );

    // QR Code
    const qrText = `https://myeventsite.com/verify/${ticket.qrToken}`;
    const qrImage = await QRCode.toDataURL(qrText);
    doc.addImage(qrImage, "PNG", 150, 70, 40, 40);

    // Footer
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text("✨ Thank you for booking with EVENTOO ✨", 105, 130, {
      align: "center",
    });

    // Save PDF
    doc.save(`ticket_${ticket.event.title.replace(/\s+/g, "_")}.pdf`);
  };

  const shareTicket = async (ticket: Ticket) => {
    const doc = new jsPDF();

    const qrText = `https://myeventsite.com/verify/${ticket.qrToken}`;
    const qrImage = await QRCode.toDataURL(qrText);

    // Ticket Content
    doc.text(`Ticket Confirmation`, 10, 10);
    doc.text(`Ticket ID: ${ticket._id.slice(-6)}`, 10, 20);
    doc.text(`Event: ${ticket.event.title}`, 10, 30);
    doc.text(`Date: ${formatDate(ticket.event.date)}`, 10, 40);
    doc.text(`Venue: ${ticket.event.venue}`, 10, 50);
    doc.text(
      `Amount Paid: ${formatCurrency(ticket.order.totalAmount)}`,
      10,
      60
    );
    doc.addImage(qrImage, "PNG", 10, 70, 50, 50);

    const pdfBlob = doc.output("blob"); // PDF as a Blob

    const file = new File([pdfBlob], `ticket_${ticket._id}.pdf`, {
      type: "application/pdf",
    });

    // Web Share API - for mobile browsers that support file sharing
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.event.title}`,
          text: `Here's my ticket for "${ticket.event.title}" on ${formatDate(
            ticket.event.date
          )} at ${ticket.event.venue}.`,
          files: [file],
        });
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      // Fallback for Desktop: Offer download + WhatsApp text
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket_${ticket._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // WhatsApp text share
      const message = `🎟️ My Ticket for "${
        ticket.event.title
      }"\n\n📅 ${formatDate(ticket.event.date)}\n📍 ${
        ticket.event.venue
      }\n💳 Amount Paid: ${formatCurrency(
        ticket.order.totalAmount
      )}\n\nYou can verify it here:\n${qrText}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-2">
            Manage and view all your event tickets
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Tickets</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
              <option value="checkedIn">Checked In</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 text-gray-600">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-gray-600 text-sm">
            Page {currentPage} of {totalPage}
          </div>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600">
              You don't have any tickets matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={getImage(ticket)}
                    alt="Event"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {ticket.checkedIn ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Checked In
                      </span>
                    ) : isUpcoming(ticket.event.date) ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Past Event
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ticket.event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(ticket.event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {ticket.event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {ticket.event.venue}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Ticket #{ticket._id.slice(-6)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadTicket(ticket)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Download Ticket"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => shareTicket(ticket)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Share Ticket"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-1">
          Page {currentPage} of {totalPage}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPage}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedTicket.event.title}
              </h3>

              <p>
                {new Date(selectedTicket.event.date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
              <p>{selectedTicket.event.venue}</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <QRCodeSVG
                  value={`https://myeventsite.com/verify/${selectedTicket.qrToken}`}
                  size={128}
                />
                <p className="text-sm text-gray-600 mb-2">QR Token</p>
                <p className="text-xs font-mono bg-white px-3 py-2 rounded border">
                  {selectedTicket.qrToken}
                </p>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <p>Show this QR code at the event entrance</p>
                <p className="font-medium">
                  Ticket ID: #{selectedTicket._id.slice(-6)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => downloadTicket(selectedTicket)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
