import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import razorpayLogo from "../../assets/razorpayLogo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaArrowLeft,
  FaCreditCard,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import UserNavbar from "../components/UseNavbar";
import { type IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { paymentRepository } from "../../repositories/paymentRepositories";
import type { RazorpayPaymentResponse } from "../../interfaces/IPayment";
import Footer from "../components/Footer";

const EventBooking: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<{
    type: string;
    capacity: number;
    price: number;
    sold?: number;
  } | null>(null);

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (event?.ticketTypes?.length) {
      setSelectedType(event.ticketTypes[0].type);
    }
  }, [event]);

  useEffect(() => {
    if (!event) return;
    if (event.ticketTypes && event.ticketTypes.length > 0) {
      const selectedTicket = event.ticketTypes.find((t) => t.type === selectedType);
      if (selectedTicket) {
        setSelectedTicket(selectedTicket);
        setTotalPrice(selectedTicket.price * ticketCount);
      }
    } else {
      setTotalPrice(ticketCount * (event.ticketPrice || 0));
    }
  }, [event, selectedType, ticketCount]);

  let imageSrc = "https://via.placeholder.com/300x200";
  if (event && event.images && event.images.length > 0) {
    const img = event.images[0];
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState({
    id: "",
    currency: "",
    amount: 0,
    _id: "",
  });
  console.log(orderData);
  

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  if (userId) {
    localStorage.setItem("userId", userId);
  } else {
    localStorage.getItem("userId");
  }

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (user) {
      setBookingData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => {
          resolve(false);
          setError("Razorpay SDK failed to load. Please check your connection.");
        };
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const fetchEventDetail = async (eventId: string) => {
    try {
      setIsLoading(true);
      const response = await eventRepository.getEventById(eventId);
      if (response.success && response.result) {
        setEvent(response.result.result);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (event && count > 0 && count <= event.capacity - (event.ticketsSold || 0)) {
      setTicketCount(count);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const validateForm = () => {
    const { name, email } = bookingData;
    if (!name.trim()) {
      toast("Name is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleFreebooking = async () => {
    try {
      setIsLoading(true);
      if (!eventId || !userId || !event) throw new Error("all args required");
      const response = await paymentRepository.createFreeBooking({
        totalPrice: totalPrice,
        ticketCount: ticketCount,
        eventId,
        userId,
        eventTitle: event?.title,
      });
      if (response && response.success) {
        setPaymentStatus("Not required");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextStep = async () => {
    if (bookingStep === 2) {
      const isValid = validateForm();
      if (!isValid) return;
    }
    if (totalPrice === 0 && !event?.ticketTypes) {
      await handleFreebooking();
      setBookingStep(4);
      return;
    }
    if (bookingStep < 4) {
      setBookingStep(bookingStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    } else {
      navigate(`/event/${eventId}`);
    }
  };

  const createRazorpayOrder = async () => {
    try {
      const eventTitle = event?.title;
      setIsLoading(true);
      const userId = user?.id;
      if (!eventTitle) throw new Error("event title not present");
      if (!eventId) throw new Error("eventId is not present");
      if (!userId) throw new Error("UserId not present");
      const orderData = await paymentRepository.createOrder({
        totalPrice: totalPrice,
        ticketCount: ticketCount,
        selectedTicket: selectedTicket,
        eventId,
        userId,
        eventTitle,
        email: user.email,
      });
      setOrderData(orderData);
      return orderData;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      setError("Failed to create order. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const order = await createRazorpayOrder();
    if (!order) return;
    if (!order.success) {
      toast.error(order.message);
    }
    const options = {
      key: "rzp_test_4MBYamMKeUifHI",
      amount: order.order.amount,
      currency: order.order.currency,
      name: "Event Ticketing",
      description: `Booking for ${event?.title}`,
      order_id: order.order.razorpayOrderId,
      handler: function (response: any) {
        handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          handlePaymentFailure("failed", order.order._id);
        },
      },
      prefill: {
        name: bookingData.name,
        email: bookingData.email,
        contact: bookingData.phone,
      },
      notes: {
        eventId: eventId,
        ticketCount: ticketCount,
      },
      theme: {
        color: "black",
      },
    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentSuccess = async (paymentResponse: RazorpayPaymentResponse) => {
    setIsLoading(true);
    try {
      const response = await paymentRepository.verifyPayment(paymentResponse);
      if (response.success) {
        setPaymentStatus("paid");
        setBookingStep(4);
      } else {
        toast(response.message || "payment not verified");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Payment verification failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentFailure = async (payStatus: string, orderId: string) => {
    setIsLoading(true);
    try {
      if (!userId) throw new Error("userId not present");
      const response = await paymentRepository.failurePayment(payStatus, orderId, userId);
      if (response.success) {
        setPaymentStatus("failed");
        setBookingStep(4);
      } else {
        toast(response.message || "payment not verified");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Payment verification failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !event)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );

  if (error && !event)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center text-gray-300">Event not found</div>
      </div>
    );

 const renderStepIndicator = () => (
    <div className="flex justify-center mb-8 sm:mb-12 px-2">
      <div className="flex items-center max-w-full overflow-x-auto pb-2 sm:pb-0">
        {[
          { num: 1, label: "Tickets" },
          { num: 2, label: "Details" },
          { num: 3, label: "Payment" },
          { num: 4, label: "Confirm" },
        ].map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg transition-all duration-300 ${
                  bookingStep >= step.num
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 border-2 border-white/10 text-gray-400"
                }`}
              >
                {step.num}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium whitespace-nowrap ${
                  bookingStep >= step.num ? "text-purple-300" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < 3 && (
              <div
                className={`w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 mx-1 sm:mx-2 mb-5 sm:mb-6 flex-shrink-0 rounded-full transition-all duration-300 ${
                  bookingStep > step.num
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-white/10"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  const renderTicketSelection = () => {
    const currentTicket = event.ticketTypes.find((t) => t.type === selectedType);
    const availableTickets =
      currentTicket?.capacity && currentTicket?.sold !== undefined
        ? currentTicket.capacity - currentTicket.sold
        : 0;

    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <FaTicketAlt className="text-white" />
            </div>
            Select Tickets
          </h2>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={imageSrc}
                alt={event.title}
                className="w-24 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">{event.title}</h3>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <FaCalendar className="text-purple-400" size={12} />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  ₹{currentTicket?.price || 0}
                </div>
                <div className="text-sm text-gray-400">{selectedType}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Ticket Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setTicketCount(1);
              }}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            >
              {event.ticketTypes.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.type} - ₹{t.price} ({t.capacity - (t.sold ?? 0)} available)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Number of Tickets
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="px-5 py-3 text-white hover:bg-white/5 transition-colors font-bold"
                  onClick={() => ticketCount > 1 && setTicketCount(ticketCount - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={availableTickets}
                  value={ticketCount}
                  onChange={handleTicketChange}
                  className="w-20 text-center bg-transparent border-x border-white/10 py-3 text-white font-bold outline-none"
                />
                <button
                  className="px-5 py-3 text-white hover:bg-white/5 transition-colors font-bold"
                  onClick={() => {
                    if (ticketCount < availableTickets) {
                      setTicketCount(ticketCount + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-400">
                <span className="text-purple-400 font-semibold">{availableTickets}</span>{" "}
                tickets available
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>
                  Price ({ticketCount} × ₹{currentTicket?.price || 0})
                </span>
                <span className="font-semibold">₹{ticketCount * (currentTicket?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Booking Fee</span>
                <span className="font-semibold text-green-400">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-3 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  ₹{ticketCount * (currentTicket?.price || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handlePreviousStep}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
            >
              <FaArrowLeft /> Back to Event
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUserDetails = () => (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <FaUser className="text-white" />
          </div>
          Contact Information
        </h2>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={bookingData.name}
              placeholder={user?.name || "Enter full name"}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingData.email}
              placeholder={user?.email || "Enter email"}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Your tickets will be sent to this email</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FaTicketAlt className="text-purple-400" />
              <span className="font-semibold text-white">
                {ticketCount} tickets for {event.title}
              </span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span className="text-gray-300">Total</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                ₹{totalPrice}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!bookingData.name || !bookingData.email}
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <FaCreditCard className="text-white" />
          </div>
          Payment Information
        </h2>

        <div className="mb-6">
          <div className="flex items-center justify-center mb-6 bg-white/5 rounded-2xl p-6 border border-white/10">
            <img src={razorpayLogo} alt="Razorpay" className="h-16" />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl mb-6">
            <p className="text-sm text-blue-300 mb-3 font-semibold">Secure Payment Gateway</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              You will be redirected to Razorpay's secure payment gateway. We accept Credit/Debit Cards, UPI, Netbanking, and Wallets.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaUser className="text-purple-400" size={14} />
              <div>
                <div className="text-white font-semibold">{bookingData.name}</div>
                <div className="text-sm text-gray-400">{bookingData.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <FaTicketAlt className="text-blue-400" size={14} />
              <span className="text-gray-300">
                {ticketCount} × {event?.title}
              </span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-3 border-t border-white/10">
              <span className="text-white">Total Payment</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
          >
            <FaArrowLeft /> Back
          </button>
          <button
            onClick={handleRazorpayPayment}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-500/30 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (
              <>
                <FaCreditCard /> Pay ₹{totalPrice} Securely
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    if (paymentStatus === "failed") {
      return (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur-lg opacity-20"></div>
          <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <FaExclamationTriangle className="text-red-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
              Payment Failed
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
              Unfortunately, your payment was not successful. Please try again or contact support if the issue persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setBookingStep(3)}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-500/30"
              >
                Try Payment Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === "Not required") {
      return (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-lg opacity-20"></div>
          <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <FaTicketAlt className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Booking Confirmed!
            </h2>
            <p className="text-sm text-gray-500 mb-2">Free Event</p>
            <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
              Your tickets have been sent to{" "}
              <span className="text-green-400 font-semibold">{bookingData.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/my-bookings")}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-500/30"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-lg opacity-20"></div>
        <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <FaTicketAlt className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Booking Confirmed!
            </h2>
            <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
              Your tickets have been sent to{" "}
              <span className="text-green-400 font-semibold">{bookingData.email}</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-white mb-4 text-lg">Booking Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-white mb-2">{event?.title}</div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <FaCalendar className="text-purple-400" size={12} />
                    {event?.date ? new Date(event.date).toLocaleDateString() : ""} at {event?.time}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-400" size={12} />
                    {event?.venue}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Tickets</span>
                  <span>
                    {ticketCount} × ₹{event?.ticketPrice || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Payment ID</span>
                  <span className="text-blue-400 font-mono">
                    RP_{Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <UserNavbar />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-2">
            Book Tickets
          </h1>
          <p className="text-gray-400">Complete your booking in 4 simple steps</p>
        </div>

        {renderStepIndicator()}

        <div className="mt-8">
          {bookingStep === 1 && renderTicketSelection()}
          {bookingStep === 2 && renderUserDetails()}
          {bookingStep === 3 && renderPayment()}
          {bookingStep === 4 && renderConfirmation()}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default EventBooking;