import React, {  useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlices';




const OrganiserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const organiserName = localStorage.getItem('organiserName');

 
   const intervalRef = useRef<ReturnType<typeof setInterval>| null>(null);
     

  const handleLogout = () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current=null

    }
    dispatch(logout());
    navigate('/login');

  
  };
  

  

  return (
    <nav className="fixed top-0 right-0 w-[calc(100%-250px)] bg-white shadow-md px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">🧭 EVENTOO</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{organiserName}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};


export default OrganiserNavbar;
