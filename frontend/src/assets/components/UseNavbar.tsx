import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlices';
import type { AppDispatch, RootState } from '../../redux/stroe';

export interface CustomJwtPayload {
    name?: string;
    email?: string;
    
  }



const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current=null
    }
    dispatch(logout());
    navigate('/login');
  };

  const user = useSelector((state: RootState) => state.auth.user as CustomJwtPayload );
  const username = user?.name || user?.email;
  const isLoggedin = !!user;
  const intervalRef = useRef<ReturnType<typeof setInterval>| null>(null);
   

  
 
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          🧭 EVENTOO
        </Link>
        <div className="flex items-center gap-4">
          
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
            About Us
          </Link>
           <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
            Login
          </Link>

          
          
          

          {isLoggedin && (
            <>
            <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium">
            MyOrders
          </Link>
          <Link to="/shows" className="text-gray-700 hover:text-blue-600 font-medium">
            Shows & Events
          </Link>
          <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/userTickets" className="text-gray-700 hover:text-blue-600 font-medium">
            Tickets
          </Link>

            <Link to={`/userProfile`}>
              <span className="text-sm font-semibold text-gray-800">👤 {username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
