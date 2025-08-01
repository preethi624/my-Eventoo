import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css'
import LoginPage from './assets/pages/Login'
//import Home from './assets/pages/Home';
import SignupPage from './assets/pages/Signup';

import VerifyOtpOrg from './assets/pages/VerifyOtpOrg';
import HomePage from './assets/pages/Home';
import Dashboard from './assets/pages/Dashboard';
import ForgotPassword from './assets/pages/ForgotPassword';
import ResetPassword from './assets/pages/PasswordReset';
import VerifyOtpUser from './assets/pages/VerifyOtpUser';
import OTPVerification from './assets/pages/VerifyOtp';
import ShowsAndEvents from './assets/pages/ShowsAndEvents';
import EventDetail from './assets/pages/EventDetail';
import OrganiserEvents from './assets/pages/OrganiserEvents';
import AdminLogin from './assets/pages/AdminLogin';
import AdminDashboard from './assets/pages/AdminDashboard';
import AdminOrganiser from './assets/pages/AdminOrganiser';
import AdminUser from './assets/pages/AdminUser';
import EventPage from './assets/pages/AdminEvent';

import EventBooking from './assets/pages/EventBooking';
import MyOrdersPage from './assets/pages/MyOrders';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/stroe';
import type { CustomJwtPayload } from './interfaces/IUser';
import {io} from 'socket.io-client'
import { useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlices';
import OrderDetailsPage from './assets/pages/OrderDetails';
import UserProfile from './assets/pages/userProfile';
import OrganiserProfile from './assets/pages/organiserProfile';
import OrganiserBookings from './assets/pages/OrgaiserBooking';
import OrgOrderDetailsPage from './assets/pages/OrganiserOrderDetails';
import ProtectedRoute from './assets/components/ProtectedRoute';
import AdminBookings from './assets/pages/AdminBookings';
import VenueManagement from './assets/pages/AdminVenue';
import VenuePage from './assets/pages/OrganiserVenue';
import VenueDetailsPage from './assets/pages/OrganiserVenueDetails';
import EventDashboard from './assets/pages/OrganiserEventDashboard';
import AttendeesPage from './assets/pages/OrganiserAttendees';
import TicketsPage from './assets/pages/UserTickets';
import CheckInPage from './assets/pages/OrganiserCheckin';


function App() {
  const dispatch=useDispatch()
 const user = useSelector((state: RootState) => state.auth.user as CustomJwtPayload  );
 const organiser=useSelector((state:RootState)=>state.auth.organiser);
const userId=user?.id ?? '';
 const organiserId = organiser?.id ?? ''

useEffect(() => {
    if (!userId) return; // not logged in yet—skip

    const socket = io('http://localhost:3000', { withCredentials: true });

    // 1) Register this socket under the user’s ID
    socket.emit('register-user', userId);

    // 2) Listen for forced-logout events
    socket.on('logout', () => {
      // Clear any tokens or Redux state, then redirect
  dispatch(logout())
      // If you store userId in Redux, dispatch a logout action there as well
      window.location.href = '/login';
    });

    // 3) Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

useEffect(() => {
    if (!organiserId) return // skip if no organiser is logged in

    const socket = io('http://localhost:3000', { withCredentials: true })

    // Tell the server: “this socket belongs to organiserId”
    socket.emit('register-organiser', organiserId)

    socket.on('logout', () => {
      // Force‐logout for an organiser
      dispatch(logout())
      window.location.href = '/login'
    })

    return () => {
      socket.disconnect()
    }
  }, [organiserId, dispatch])
  

  return (
   
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      
      <Route path='/register' element={<SignupPage/>}/>
      <Route path='/verifyOtpUser' element={<VerifyOtpUser/>}/>
      <Route path='/verifyOtpOrg' element={<VerifyOtpOrg/>}/>
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/" element={ <HomePage/> } />
      


      <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />}/>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path='/verifyOtp' element={<OTPVerification/>}/>
      <Route path='/resetPassword' element={<ResetPassword/>}/>
    <Route path="/shows" element={<ProtectedRoute element={<ShowsAndEvents />} />} />
      <Route path='/events/:id' element={<ProtectedRoute element={<EventDetail />} />}/>
      <Route path='/orgEvents' element={<ProtectedRoute element={<OrganiserEvents/>} />}/>
      <Route path='/adminLogin' element={<AdminLogin/>}/>
      <Route path='/adminDashboard' element={<AdminDashboard/>}/>
      <Route path='/adminOrganiser' element={<AdminOrganiser/>}/>
      <Route path='/adminUser' element={<AdminUser/>}/>
      <Route path='/admin/events' element={<EventPage/>}/>
      <Route path='/admin/bookings' element={<AdminBookings/>}/>
      <Route path='/admin/venues' element={<VenueManagement/>}/>
      
      <Route path='/eventBooking/:eventId' element={<ProtectedRoute element={<EventBooking/>} />}/>
      <Route path='/my-bookings' element={<ProtectedRoute element={<MyOrdersPage />} />}/>
      <Route path='/order/:orderId' element={<ProtectedRoute element={<OrderDetailsPage/>} />}/>
      <Route path='/userProfile' element={<ProtectedRoute element={<UserProfile />} />}/>
      <Route path='/userTickets' element={<ProtectedRoute element={<TicketsPage/>} />}/>
      <Route path='/organiserProfile' element={<ProtectedRoute element={<OrganiserProfile />} />}/>
      <Route path='/organiserBookings' element={<ProtectedRoute element={<OrganiserBookings />} />}/>
      <Route path='/orgOrderDetails/:orderId' element={<ProtectedRoute element={<OrgOrderDetailsPage />} />}/>
       <Route path='/orgVenues' element={<ProtectedRoute element={<VenuePage/>} />}/>
        <Route path='/venue/:venueId' element={<ProtectedRoute element={<VenueDetailsPage/>} />}/>
        <Route path='/organiserEvent/:id' element={<ProtectedRoute element={<EventDashboard/>} />}/>
        <Route path='/organiserAttendees' element={<ProtectedRoute element={<AttendeesPage/>} />}/>
         <Route path='/checkin' element={<ProtectedRoute element={<CheckInPage/>} />}/>




      
    
      
      
      
 

    </Routes>

   
  )
}

export default App
