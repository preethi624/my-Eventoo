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
import { userRepository } from "../../repositories/userRepositories";
import { useLocation } from "react-router-dom";


const EventBooking: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [offerCode, setOfferCode] = useState("");
const [isOfferApplied, setIsOfferApplied] = useState(false);
const [offerMessage, setOfferMessage] = useState("");
const [offer,setOffer]=useState<{discountType?:string,discountValue?:number,maxDiscountAmount?:number,minOrderAmount?:number,startDate?:string,usageLimit?:number,usedCount?:number}>({})
const [discountAmount, setDiscountAmount] = useState(0);
const [finalAmount, setFinalAmount] = useState(totalPrice);
const location=useLocation()
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const codeFromUrl = params.get("code");

  if (codeFromUrl&&totalPrice>0) {
    setOfferCode(codeFromUrl);
    handleOfferApply(codeFromUrl);
  }
}, [location.search,totalPrice]);
console.log(offer);


useEffect(() => {
  setFinalAmount(totalPrice - discountAmount);
}, [totalPrice, discountAmount]);

console.log("Total:", totalPrice, "Discount:", discountAmount, "Final:", finalAmount);


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
    finalAmount:0
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
  console.log("orderData",orderData);
  

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
        offerCode:offerCode
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
  /*const handleOfferApply=async(e:any)=>{
    try {
      e.preventDefault()
    if(!offerCode){
      setOfferMessage("Please Enter An OfferCode");
      setIsOfferApplied(false)
      return
    }
    
    setIsOfferApplied(true)
     setOfferMessage(`Offer code "${offerCode}" applied!`);
     const response=await userRepository.findOffer(offerCode);
     const offerData=response.result
    
     
     setOffer(offerData)
     let discount = 0;
    const totalBeforeDiscount = totalPrice;

    if (offerData.discountType === "flat") {
      if(!offerData.discountValue||!offerData.maxDiscountAmount) throw new Error("something wrong")
      discount = Math.min(offerData?.discountValue, offerData.maxDiscountAmount);
    console.log("discount",discount);
    
    } else if (offerData.discountType === "percentage") {
        if(!offerData.discountValue||!offerData.maxDiscountAmount) throw new Error("something wrong")
      discount = (totalBeforeDiscount * offerData.discountValue) / 100;
      if (offerData.maxDiscountAmount) {
        discount = Math.min(discount, offerData.maxDiscountAmount);
      }
    }

    // only apply if meets min amount
    if(!offerData.minOrderAmount)throw new Error("wrong")
    if (totalBeforeDiscount >= offerData.minOrderAmount) {
      setDiscountAmount(discount);
      toast.success(`Offer applied! You saved ₹${discount}`);
    } else {
      toast.error(`Minimum order ₹${offer.minOrderAmount} required.`);
    }
      
    } catch (error) {
      
    }
    
     
    

  }*/
 const handleOfferApply = async (e?: React.FormEvent | string) => {
  try {
    // If it's an event (manual submit), prevent page reload
    if (typeof e !== "string" && e) {
      e.preventDefault();
    }

    // Determine the actual offer code
    const codeToApply = typeof e === "string" ? e : offerCode;

    if (!codeToApply) {
      setOfferMessage("Please Enter An OfferCode");
      setIsOfferApplied(false);
      return;
    }

    setIsOfferApplied(true);
    setOfferMessage(`Offer code "${codeToApply}" applied!`);

    const response = await userRepository.findOffer(codeToApply);
    const offerData = response.result;

    setOffer(offerData);

    let discount = 0;
    const totalBeforeDiscount = totalPrice;

    if (offerData.discountType === "flat") {
      if (!offerData.discountValue || !offerData.maxDiscountAmount)
        throw new Error("Invalid flat discount data");
      discount = Math.min(offerData.discountValue, offerData.maxDiscountAmount);
    } else if (offerData.discountType === "percentage") {
      if (!offerData.discountValue || !offerData.maxDiscountAmount)
        throw new Error("Invalid percentage discount data");
      discount = (totalBeforeDiscount * offerData.discountValue) / 100;
      discount = Math.min(discount, offerData.maxDiscountAmount);
    }

    if (!offerData.minOrderAmount) throw new Error("Invalid min order amount");

    if (totalBeforeDiscount >= offerData.minOrderAmount) {
      setDiscountAmount(discount);
      toast.success(`Offer applied! You saved ₹${discount}`);
    } else {
      toast.error(`Minimum order ₹${offerData.minOrderAmount} required.`);
    }
  } catch (error) {
    console.error(error);
    setIsOfferApplied(false);
    toast.error("Failed to apply offer. Please try again.");
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

 // Replace renderStepIndicator function:
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
                  : "bg-gray-200 border-2 border-gray-300 text-gray-700"
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium whitespace-nowrap ${
                bookingStep >= step.num ? "text-purple-600" : "text-gray-600"
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
                  : "bg-gray-300"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);
  // Replace renderTicketSelection function:
const renderTicketSelection = () => {
  const currentTicket = event.ticketTypes.find((t) => t.type === selectedType);
  const availableTickets =
    currentTicket?.capacity && currentTicket?.sold !== undefined
      ? currentTicket.capacity - currentTicket.sold
      : 0;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <FaTicketAlt className="text-white" />
          </div>
          Select Tickets
        </h2>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={imageSrc}
              alt={event.title}
              className="w-24 h-20 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendar className="text-purple-600" size={12} />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                ₹{currentTicket?.price || 0}
              </div>
              <div className="text-sm text-gray-600">{selectedType}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Ticket Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setTicketCount(1);
            }}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
          >
            {event.ticketTypes.map((t) => (
              <option key={t.type} value={t.type}>
                {t.type} - ₹{t.price} ({t.capacity - (t.sold ?? 0)} available)
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Number of Tickets
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                className="px-5 py-3 text-gray-900 hover:bg-gray-100 transition-colors font-bold"
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
                className="w-20 text-center bg-transparent border-x border-gray-300 py-3 text-gray-900 font-bold outline-none"
              />
              <button
                className="px-5 py-3 text-gray-900 hover:bg-gray-100 transition-colors font-bold"
                onClick={() => {
                  if (ticketCount < availableTickets) {
                    setTicketCount(ticketCount + 1);
                  }
                }}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">
              <span className="text-purple-600 font-semibold">{availableTickets}</span>{" "}
              tickets available
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>
                Price ({ticketCount} × ₹{currentTicket?.price || 0})
              </span>
              <span className="font-semibold">₹{ticketCount * (currentTicket?.price || 0)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Booking Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-3 border-t border-purple-200">
              <span className="text-gray-900">Total</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                ₹{ticketCount * (currentTicket?.price || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handlePreviousStep}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
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

 // Replace renderUserDetails function:
const renderUserDetails = () => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
    <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <FaUser className="text-white" />
        </div>
        Contact Information
      </h2>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingData.name}
            placeholder={user?.name || "Enter full name"}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingData.email}
            placeholder={user?.email || "Enter email"}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            required
          />
          <p className="text-xs text-gray-600 mt-2">Your tickets will be sent to this email</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaTicketAlt className="text-purple-600" />
            <span className="font-semibold text-gray-900">
              {ticketCount} tickets for {event.title}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl">
            <span className="text-gray-700">Total</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              ₹{totalPrice}
            </span>
          </div>
          {/* Offer / Promo Code Section */}
<div className="mt-4 bg-gray-800/40 p-4 rounded-xl">
  <h3 className="text-lg font-semibold mb-2 text-purple-300">Have an Offer Code?</h3>
  <div className="flex items-center gap-2">
    <input
      type="text"
      placeholder="Enter offer code"
      value={offerCode}
      onChange={(e)=>setOfferCode(e.target.value)}
      
      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
     onClick={handleOfferApply}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
    >
      Apply
    </button>
  </div>

  {offerMessage && (
    <p className={`mt-2 text-sm ${isOfferApplied ? "text-green-400" : "text-red-400"}`}>
      {offerMessage}
    </p>
  )}
</div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
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

  // Replace renderPayment function:
const renderPayment = () => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
    <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <FaCreditCard className="text-white" />
        </div>
        Payment Information
      </h2>

      <div className="mb-6">
        <div className="flex items-center justify-center mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <img src={razorpayLogo} alt="Razorpay" className="h-16" />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl mb-6">
          <p className="text-sm text-blue-700 mb-3 font-semibold">Secure Payment Gateway</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            You will be redirected to Razorpay's secure payment gateway. We accept Credit/Debit Cards, UPI, Netbanking, and Wallets.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FaUser className="text-purple-600" size={14} />
            <div>
              <div className="text-gray-900 font-semibold">{bookingData.name}</div>
              <div className="text-sm text-gray-600">{bookingData.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-purple-200">
            <FaTicketAlt className="text-blue-600" size={14} />
            <span className="text-gray-700">
              {ticketCount} × {event?.title}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-3 border-t border-purple-200">
            <span className="text-gray-900">Total Payment</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              ₹{finalAmount}
            </span>
          </div>
        </div>
      </div>
    

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
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
              <FaCreditCard /> Pay ₹{finalAmount} Securely
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
        <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-300">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
            Payment Failed
          </h2>
          <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
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
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
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
        <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-300">
            <FaTicketAlt className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-gray-600 mb-2 font-semibold">Free Event</p>
          <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
            Your tickets have been sent to{" "}
            <span className="text-green-600 font-semibold">{bookingData.email}</span>
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
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
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
      <div className="relative bg-white backdrop-blur-2xl rounded-3xl border border-gray-200 p-12 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-300">
            <FaTicketAlt className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            Booking Confirmed!
          </h2>
          <p className="text-gray-700 max-w-md mx-auto leading-relaxed">
            Your tickets have been sent to{" "}
            <span className="text-green-600 font-semibold">{bookingData.email}</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Booking Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{event?.title}</div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendar className="text-purple-600" size={12} />
                  {event?.date ? new Date(event.date).toLocaleDateString() : ""} at {event?.time}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" size={12} />
                  {event?.venue}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-purple-200">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tickets</span>
                <span>
                  {ticketCount} × ₹{event.ticketPrice || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Payment ID</span>
                <span className="text-blue-600 font-mono">
                  RP_{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-purple-200">
                <span className="text-gray-900">Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  ₹{finalAmount}
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
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      
      <UserNavbar />
     <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
  Book Tickets
</h1>
<p className="text-gray-600">Complete your booking in 4 simple steps</p>
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