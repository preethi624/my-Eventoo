<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import razorpayLogo from "../../assets/razorpayLogo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import razorpayLogo from '../../assets/razorpayLogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

import {
  FaCalendar,
  FaMapMarkerAlt,
<<<<<<< HEAD
=======
 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  FaTicketAlt,
  FaArrowLeft,
  FaCreditCard,
  FaUser,
<<<<<<< HEAD
  FaExclamationTriangle,
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import { type IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { paymentRepository } from "../../repositories/paymentRepositories";
import type { RazorpayPaymentResponse } from "../../interfaces/IPayment";

const EventBooking: React.FC = () => {
   
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [selectedType, setSelectedType] = useState<string>(
     ""
  );
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const[selectedTicket,setSelectedTicket]=useState<{type:string,capacity:number,price:number,sold?:number}|null>(null)
 
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
    
    const selectedTicket = event.ticketTypes.find(
      (t) => t.type === selectedType
    );
    if (selectedTicket) {
      setSelectedTicket(selectedTicket)
      setTotalPrice(selectedTicket.price * ticketCount);
    }
  } else {
   
    setTotalPrice(ticketCount * (event.ticketPrice || 0));
  }
}, [event, selectedType, ticketCount]);
console.log("selected tickets",selectedTicket);



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
=======
  FaExclamationTriangle
} from 'react-icons/fa';

import UserNavbar from '../components/UseNavbar';
import type { IEventDTO } from '../../interfaces/IEvent';
import { eventRepository } from '../../repositories/eventRepositories';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/stroe';
import { paymentRepository } from '../../repositories/paymentRepositories';
import type { RazorpayPaymentResponse } from '../../interfaces/IPayment';

const EventBooking: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus,setPaymentStatus]=useState('')
  const [bookingStep, setBookingStep] = useState(1); 
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  let imageSrc = "https://via.placeholder.com/300x200";
    if (event&&event.images && event.images.length > 0) {
    const img = event.images[0];
    if (img.startsWith("http")) {
      
      imageSrc = img;
    } else {
    
      imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
    }
  }

 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [orderData, setOrderData] = useState({
    id: '',
    currency: '',
    amount: 0,
    _id:''
    
  });
  console.log(orderData);
  

  
  const user=useSelector((state:RootState)=>state.auth.user);
  const  userId=user?.id
  if(userId){
   localStorage.setItem('userId',userId) 

  }else{
    localStorage.getItem('userId')
  }
  


>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId]);

<<<<<<< HEAD
 /* useEffect(() => {
    if (event) {
      setTotalPrice(ticketCount * (event.ticketPrice || 0));
    }
  }, [ticketCount, event])*/
  useEffect(() => {
    if (user) {
      console.log("user", user);

      setBookingData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);
=======
  useEffect(() => {
    if (event) {
      setTotalPrice(ticketCount * (event.ticketPrice || 0));
    }
  }, [ticketCount, event]);
  useEffect(()=>{
    if(user){
      console.log("user",user);
      
      setBookingData({
        name:user.name||"",
        email:user.email||"",
        phone:user.phone||""

      })
    }

  },[user])
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
<<<<<<< HEAD
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
=======
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
<<<<<<< HEAD
          setError(
            "Razorpay SDK failed to load. Please check your connection."
          );
=======
          setError('Razorpay SDK failed to load. Please check your connection.');
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
      console.error("Error fetching event:", error);
      setError("Failed to load event details. Please try again.");
=======
      console.error('Error fetching event:', error);
      setError('Failed to load event details. Please try again.');
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
<<<<<<< HEAD
    if (
      event &&
      count > 0 &&
      count <= event.capacity - (event.ticketsSold || 0)
    ) {
=======
    if (event && count > 0 && count <= (event.capacity - (event.ticketsSold || 0))) {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      setTicketCount(count);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };
  const validateForm = () => {
<<<<<<< HEAD
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
      if (!eventId || !userId || !event) {
        throw new Error("all args required");
      }
      const response = await paymentRepository.createFreeBooking({
        totalPrice: totalPrice,
        ticketCount: ticketCount,
        eventId,
        userId,
        eventTitle: event?.title,
      });
      if (response && response.success) {
        console.log("freeRes", response);
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
    if (totalPrice === 0&&!event?.ticketTypes) {
      await handleFreebooking();
      setBookingStep(4);
      return;
    }

=======
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
const handleFreebooking=async()=>{
  try {
    setIsLoading(true)
    if(!eventId||!userId||!event){
      throw new Error("all args required")
    }
    const response=await paymentRepository.createFreeBooking({
    totalPrice:totalPrice,ticketCount:ticketCount,eventId,userId,eventTitle:event?.title
    })
    if(response&&response.success){
      console.log("freeRes",response)
      setPaymentStatus("Not required")
     
    }
  } catch (error) {
    console.log(error)
    
  }

}


  const handleNextStep =async () => {
 if(bookingStep===2){
  const isValid=validateForm();
  if(!isValid)return
 }
 if(totalPrice===0){
  await handleFreebooking();
  setBookingStep(4)
  return 
 }
    
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    try {
<<<<<<< HEAD
      const eventTitle = event?.title;
      setIsLoading(true);
      console.log("user", user);

      const userId = user?.id;
      if (!eventTitle) {
        throw new Error("event title not present");
      }

      if (!eventId) {
        throw new Error("eventId is not present");
      }
      if (!userId) {
        throw new Error("UserId not present");
      }
      const orderData = await paymentRepository.createOrder({
        totalPrice: totalPrice,
        ticketCount: ticketCount,
        selectedTicket:selectedTicket,
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
=======
      const eventTitle=event?.title
      setIsLoading(true);
      console.log("user",user);
      
      const userId=user?.id
      if(!eventTitle){
        throw new Error("event title not present")
      }
      
      
      if(!eventId){
        throw new Error("eventId is not present")
      }
      if(!userId){
        throw new Error("UserId not present")
      }
      const orderData=await paymentRepository.createOrder({totalPrice:totalPrice,ticketCount:ticketCount,eventId,userId,eventTitle,email:user.email});
      setOrderData(orderData);
      
      return orderData
      
      
     
      
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      setError('Failed to create order. Please try again.');
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    const order = await createRazorpayOrder();
<<<<<<< HEAD

    if (!order) return;
    if (!order.success) {
      toast.error(order.message);
    }
    console.log("order", order);

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
=======
  
    
    
    
    if (!order) return;
    if(!order.success){
     toast.error(order.message)
    }
    console.log("order",order);
    
    
   
    
    
    const options = {
      key: 'rzp_test_4MBYamMKeUifHI',
      amount: order.order.amount, 
      currency: order.order.currency,
      name: 'Event Ticketing',
      description: `Booking for ${event?.title}`,
      order_id: order.order.razorpayOrderId,
      handler: function(response: any) {
      
        handlePaymentSuccess(response);
        
      },
      modal: {
    ondismiss: () => {
  
      handlePaymentFailure('failed',order.order._id);
    },
  },
      prefill: {
        name: bookingData.name,
        email: bookingData.email,
        contact: bookingData.phone
      },
      notes: {
        eventId: eventId,
        ticketCount: ticketCount
      },
      theme: {
        color: 'black'
      }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    };

    // Open Razorpay payment form
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  // Handle successful payment
<<<<<<< HEAD
  const handlePaymentSuccess = async (
    paymentResponse: RazorpayPaymentResponse
  ) => {
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
=======
  const handlePaymentSuccess = async (paymentResponse: RazorpayPaymentResponse) => {
    
    
    setIsLoading(true);
    try {
      const response=await paymentRepository.verifyPayment(paymentResponse);

      
      if(response.success){
        setPaymentStatus('paid')
       
        
       setBookingStep(4); 

      }else {
      
      toast (response.message||"payment not verified")
    }
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Payment verification failed. Please contact support.');
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const handlePaymentFailure = async (payStatus: string, orderId: string) => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error("userId not present");
      }

      const response = await paymentRepository.failurePayment(
        payStatus,
        orderId,
        userId
      );

      if (response.success) {
        setPaymentStatus("failed");

        setBookingStep(4);
      } else {
        toast(response.message || "payment not verified");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Payment verification failed. Please contact support.");
=======

  
  const handlePaymentFailure = async (payStatus:string,orderId:string) => {
    
    
    setIsLoading(true);
    try {
     
      
      if(!userId){
        throw new Error("userId not present")
      }
  
     
      
      const response=await paymentRepository.failurePayment(payStatus,orderId,userId);

      
      if(response.success){
        setPaymentStatus('failed')
       
        
       setBookingStep(4); 

      }else {
      
      toast (response.message||"payment not verified")
    }
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Payment verification failed. Please contact support.');
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  if (isLoading && !event)
    return <div className="text-center mt-20">Loading...</div>;
  if (error && !event)
    return <div className="text-center mt-20 text-red-500">{error}</div>;
=======
  if (isLoading && !event) return <div className="text-center mt-20">Loading...</div>;
  if (error && !event) return <div className="text-center mt-20 text-red-500">{error}</div>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  if (!event) return <div className="text-center mt-20">Event not found</div>;

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
<<<<<<< HEAD
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center ${
                bookingStep >= step
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-700"
=======
            <div 
              className={`rounded-full h-12 w-12 flex items-center justify-center ${
                bookingStep >= step ? 'bg-black text-white' : 'bg-gray-300 text-gray-700'
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
              }`}
            >
              {step}
            </div>
            {step < 4 && (
<<<<<<< HEAD
              <div
                className={`w-16 h-1 ${
                  bookingStep > step ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
=======
              <div className={`w-16 h-1 ${bookingStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

<<<<<<< HEAD
  /*const renderTicketSelection = () => (
    <div className="bg-white rounded-lg shadow p-12">
      <h2 className="text-xl font-bold mb-4">Select Tickets</h2>

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={imageSrc}
=======
  const renderTicketSelection = () => (
    <div className="bg-white rounded-lg shadow p-12">
      <h2 className="text-xl font-bold mb-4">Select Tickets</h2>
      
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
       <div className="flex items-center">
          <img
            src={
              imageSrc
            }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            alt={event.title}
            className="w-20 h-16 object-cover rounded mr-4"
          />
          <div>
<<<<<<< HEAD
=======

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            <h3 className="font-semibold">{event.title}</h3>
            <div className="text-sm text-gray-600 flex items-center">
              <FaCalendar className="mr-1" size={12} />
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </div>
          </div>
        </div>
        <div className="text-right">
<<<<<<< HEAD
          <div className="text-lg font-semibold">
            ₹{event?.ticketPrice || 0}
          </div>
          <div className="text-sm text-gray-600">per ticket</div>
        </div>
      </div>

=======
          <div className="text-lg font-semibold">₹{event?.ticketPrice || 0}</div>
          <div className="text-sm text-gray-600">per ticket</div>
        </div>
      </div>
      
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Tickets
        </label>
        <div className="flex items-center">
<<<<<<< HEAD
          <button
=======
          <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            className="px-3 py-1 border border-gray-300 rounded-l bg-gray-100"
            onClick={() => ticketCount > 1 && setTicketCount(ticketCount - 1)}
          >
            -
          </button>
          <input
            type="number"
            min="1"
<<<<<<< HEAD
            max={
              event?.capacity ? event.capacity - (event.ticketsSold || 0) : 1
            }
=======
            max={event?.capacity ? event.capacity - (event.ticketsSold || 0) : 1}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            value={ticketCount}
            onChange={handleTicketChange}
            className="w-16 text-center border-t border-b border-gray-300 py-1"
          />
<<<<<<< HEAD
          <button
            className="px-3 py-1 border border-gray-300 rounded-r bg-gray-100"
            onClick={() => {
              if (
                event?.capacity &&
                ticketCount < event.capacity - (event.ticketsSold || 0)
              ) {
=======
          <button 
            className="px-3 py-1 border border-gray-300 rounded-r bg-gray-100"
            onClick={() => {
              if (event?.capacity && ticketCount < (event.capacity - (event.ticketsSold || 0))) {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                setTicketCount(ticketCount + 1);
              }
            }}
          >
            +
          </button>
          <span className="ml-4 text-sm text-gray-600">
<<<<<<< HEAD
            {event?.capacity ? event.capacity - (event.ticketsSold || 0) : 0}{" "}
            tickets available
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="flex justify-between mb-2">
          <span>
            Price ({ticketCount} × ₹{event?.ticketPrice || 0})
          </span>
=======
            {event?.capacity ? event.capacity - (event.ticketsSold || 0) : 0} tickets available
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="flex justify-between mb-2">
          <span>Price ({ticketCount} × ₹{event?.ticketPrice || 0})</span>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          <span>₹{ticketCount * (event?.ticketPrice || 0)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Booking Fee</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
<<<<<<< HEAD

      <div className="flex justify-between">
        <button
=======
      
      <div className="flex justify-between">
        <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          onClick={handlePreviousStep}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Event
        </button>
<<<<<<< HEAD
        <button
          onClick={handleNextStep}
          className="bg-black hover:bg-[#006666] text-white px-6 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );*/
  const renderTicketSelection = () => {
 
 const currentTicket = event.ticketTypes.find(
    (t) => t.type === selectedType
  );

 

  const availableTickets =
    currentTicket?.capacity && currentTicket?.sold !== undefined
      ? currentTicket.capacity - currentTicket.sold
      : 0;

  return (
    <div className="bg-white rounded-lg shadow p-12">
      <h2 className="text-xl font-bold mb-4">Select Tickets</h2>

      {/* Event Info */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={imageSrc}
            alt={event.title}
            className="w-20 h-16 object-cover rounded mr-4"
          />
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <div className="text-sm text-gray-600 flex items-center">
              <FaCalendar className="mr-1" size={12} />
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            ₹{currentTicket?.price || 0}
          </div>
          <div className="text-sm text-gray-600">{selectedType} ticket</div>
        </div>
      </div>

      {/* Ticket Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ticket Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setTicketCount(1); // reset count when changing type
          }}
          className="border rounded p-2 w-full"
        >
          {event.ticketTypes.map((t) => (
            <option key={t.type} value={t.type}>
              {t.type} - ₹{t.price} ({t.capacity - (t.sold ?? 0)} left)
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Counter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Tickets
        </label>
        <div className="flex items-center">
          <button
            className="px-3 py-1 border border-gray-300 rounded-l bg-gray-100"
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
            className="w-16 text-center border-t border-b border-gray-300 py-1"
          />
          <button
            className="px-3 py-1 border border-gray-300 rounded-r bg-gray-100"
            onClick={() => {
              if (ticketCount < availableTickets) {
                setTicketCount(ticketCount + 1);
              }
            }}
          >
            +
          </button>
          <span className="ml-4 text-sm text-gray-600">
            {availableTickets} tickets available
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="flex justify-between mb-2">
          <span>
            Price ({ticketCount} × ₹{currentTicket?.price || 0})
          </span>
          <span>₹{ticketCount * (currentTicket?.price || 0)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Booking Fee</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₹{ticketCount * (currentTicket?.price || 0)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={handlePreviousStep}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Event
        </button>
        <button
=======
        <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          onClick={handleNextStep}
          className="bg-black hover:bg-[#006666] text-white px-6 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
<<<<<<< HEAD
};


  const renderUserDetails = () => (
    
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>

      <form>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
=======

  const renderUserDetails = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>
      
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingData.name}
<<<<<<< HEAD
            placeholder={user?.name || "Enter full name"}
=======
            placeholder={user?.name||"Enter full name"}

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
<<<<<<< HEAD

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
=======
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingData.email}
<<<<<<< HEAD
            placeholder={user?.email || "Enter email"}
=======
            placeholder={user?.email||"Enter email"}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
<<<<<<< HEAD
          <p className="text-xs text-gray-500 mt-1">
            Your tickets will be sent to this email
          </p>
        </div>
=======
          <p className="text-xs text-gray-500 mt-1">Your tickets will be sent to this email</p>
        </div>
        
        
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="flex items-center mb-2">
            <FaTicketAlt className="text-blue-600 mr-2" />
<<<<<<< HEAD
            <span className="font-semibold">
              {ticketCount} tickets for {event.title}
            </span>
=======
            <span className="font-semibold">{ticketCount} tickets for {event.title}</span>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
<<<<<<< HEAD

        <div className="flex justify-between">
          <button
=======
        
        <div className="flex justify-between">
          <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            type="button"
            onClick={handlePreviousStep}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
<<<<<<< HEAD
          <button
            type="button"
            onClick={handleNextStep}
            className="bg-black hover:bg-blue-700 text-white px-6 py-2 rounded"
            disabled={!bookingData.name || !bookingData.email}
=======
          <button 
            type="button"
            onClick={handleNextStep}
            className="bg-black hover:bg-blue-700 text-white px-6 py-2 rounded"
            disabled={!bookingData.name || !bookingData.email }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );

  const renderPayment = () => (
<<<<<<< HEAD
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>

      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <img src={razorpayLogo} alt="Razorpay" className="h-20" />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <p className="text-sm text-blue-700 mb-2">
            <strong>Secure Payment:</strong> You will be redirected to
            Razorpay&apos;s secure payment gateway to complete your transaction.
=======
   
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={razorpayLogo}
              
            alt="Razorpay" 
            className="h-20"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <p className="text-sm text-blue-700 mb-2">
            <strong>Secure Payment:</strong> You will be redirected to Razorpay&apos;s secure payment gateway to complete your transaction.
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          </p>
          <p className="text-sm text-blue-700">
            We accept Credit/Debit Cards, UPI, Netbanking, and Wallets.
          </p>
        </div>
      </div>
<<<<<<< HEAD

=======
      
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <FaUser className="text-gray-600 mr-2" size={12} />
            <span className="text-gray-700">{bookingData.name}</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">{bookingData.email}</div>
        </div>
        <div className="flex items-center mb-2">
          <FaTicketAlt className="text-blue-600 mr-2" size={12} />
<<<<<<< HEAD
          <span>
            {ticketCount} × {event?.title}
          </span>
=======
          <span>{ticketCount} × {event?.title}</span>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        </div>
        <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
          <span>Total Payment</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
<<<<<<< HEAD

      <div className="flex justify-between">
        <button
=======
      
      <div className="flex justify-between">
        <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          type="button"
          onClick={handlePreviousStep}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
<<<<<<< HEAD
        <button
=======
        <button 
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          onClick={handleRazorpayPayment}
          className="bg-black hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center"
          disabled={isLoading}
        >
<<<<<<< HEAD
          {isLoading ? (
            "Processing..."
          ) : (
=======
          {isLoading ? 'Processing...' : (
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            <>
              <FaCreditCard className="mr-2" /> Pay ₹{totalPrice} Securely
            </>
          )}
        </button>
      </div>
    </div>
<<<<<<< HEAD
  );

  const renderConfirmation = () => {
    if (paymentStatus === "failed") {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your payment was not successful. Please try again.
          </p>
          <button
            onClick={() => setBookingStep(3)}
            className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            Back to Events
          </button>
        </div>
      );
    }
    if (paymentStatus === "Not required") {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTicketAlt className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Booking Confirmed (Free Event)!
          </h2>
          <p className="text-gray-600 mb-6">
            Your tickets have been sent to {bookingData.email}
          </p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            Back to Events
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTicketAlt className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your tickets have been sent to {bookingData.email}
        </p>

        <div className="bg-gray-50 p-4 rounded mb-6 text-left">
          <h3 className="font-semibold mb-3">Booking Details</h3>
          <div className="mb-4">
            <div className="text-lg font-medium">{event?.title}</div>
            <div className="text-sm text-gray-600 flex items-center">
              <FaCalendar className="mr-1" size={12} />
              {event?.date
                ? new Date(event.date).toLocaleDateString()
                : ""} at {event?.time}
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <FaMapMarkerAlt className="mr-1" size={12} />
              {event?.venue}
            </div>
          </div>
          <div className="flex justify-between text-sm pb-2">
            <span>Tickets</span>
            <span>
              {ticketCount} × ₹{event?.ticketPrice || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm pb-2">
            <span>Payment ID</span>
            <span className="text-blue-600">
              RP_{Math.random().toString(36).substring(2, 10)}
            </span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-bookings")}
          className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate("/")}
=======
    
  );

 const renderConfirmation = () => {
  if (paymentStatus === 'failed') {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment was not successful. Please try again.
        </p>
        <button
          onClick={() => setBookingStep(3)} // Back to payment
          className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
        >
          Try Payment Again
        </button>
        <button
          onClick={() => navigate('/')}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Back to Events
        </button>
      </div>
    );
<<<<<<< HEAD
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <UserNavbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Book Tickets</h1>

        {renderStepIndicator()}

=======
  }
  if (paymentStatus === 'Not required') {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaTicketAlt className="text-green-600 text-xl" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Booking Confirmed (Free Event)!</h2>
      <p className="text-gray-600 mb-6">
        Your tickets have been sent to {bookingData.email}
      </p>
      <button
        onClick={() => navigate('/my-bookings')}
        className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
      >
        View My Bookings
      </button>
      <button
        onClick={() => navigate('/')}
        className="ml-4 text-blue-600 hover:text-blue-800"
      >
        Back to Events
      </button>
    </div>
  );
}


  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaTicketAlt className="text-green-600 text-xl" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Your tickets have been sent to {bookingData.email}
      </p>

      <div className="bg-gray-50 p-4 rounded mb-6 text-left">
        <h3 className="font-semibold mb-3">Booking Details</h3>
        <div className="mb-4">
          <div className="text-lg font-medium">{event?.title}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <FaCalendar className="mr-1" size={12} />
            {event?.date ? new Date(event.date).toLocaleDateString() : ''} at {event?.time}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <FaMapMarkerAlt className="mr-1" size={12} />
            {event?.venue}
          </div>
        </div>
        <div className="flex justify-between text-sm pb-2">
          <span>Tickets</span>
          <span>{ticketCount} × ₹{event?.ticketPrice || 0}</span>
        </div>
        <div className="flex justify-between text-sm pb-2">
          <span>Payment ID</span>
          <span className="text-blue-600">RP_{Math.random().toString(36).substring(2, 10)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/my-bookings')}
        className="bg-black hover:bg-blue text-white px-6 py-2 rounded"
      >
        View My Bookings
      </button>
      <button
        onClick={() => navigate('/')}
        className="ml-4 text-blue-600 hover:text-blue-800"
      >
        Back to Events
      </button>
    </div>
  );
};

  return (
   
    <div className="min-h-screen bg-gray-100 pb-10">
      <UserNavbar/>
       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Book Tickets</h1>
        
        {renderStepIndicator()}
        
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        {bookingStep === 1 && renderTicketSelection()}
        {bookingStep === 2 && renderUserDetails()}
        {bookingStep === 3 && renderPayment()}
        {bookingStep === 4 && renderConfirmation()}
      </div>
    </div>
<<<<<<< HEAD
  );
};

export default EventBooking;
=======
 
  );
};

export default EventBooking;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
