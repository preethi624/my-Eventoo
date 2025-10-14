import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../redux/slices/authSlices";
import type { AppDispatch, RootState } from "../../redux/stroe";
import targetLogo from "../images/target_3484438 (2).png";
import { useEffect } from "react"
import axios from "axios";

export interface CustomJwtPayload {
  name?: string;
  email?: string;
}

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState<string>(""); 
const [loadingLocation, setLoadingLocation] = useState<boolean>(true);


  const handleLogout = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(logout());
    navigate("/login");
  };

  const user = useSelector(
    (state: RootState) => state.auth.user as CustomJwtPayload
  );
  const username = user?.name || user?.email;
  const isLoggedin = !!user;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  


const fetchLocationName = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: `${latitude},${longitude}`,
          key: `${import.meta.env.VITE_REACT_APP_OPENCAGE_API_KEY}`,
          pretty: 1,
          no_annotations: 1,
        },
      }
    );
    console.log("respoo",response);
    

    if (response.data && response.data.results.length > 0) {
      const components = response.data.results[0].components;
     const city =
  components.city ||
  components.town ||
  components.village ||
  components.county ||
  components.state_district ||
  "Unknown place";
      const state = components.state || "";
      const country = components.country || "";

      console.log("Location:", city, state, country);
      return { city, state, country };
    } else {
      return { city: "", state: "", country: "" };
    }
  } catch (error) {
    console.error("Error fetching location from OpenCage", error);
    return { city: "", state: "", country: "" };
  }
};

useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        
            const { latitude, longitude } = position.coords;
        console.log("lat&long",longitude);
         if (latitude && longitude) {
    fetchLocationName(latitude, longitude).then((loc) => {
      setLocation(`${loc.city}, ${loc.state}, ${loc.country}`);
    })
    .catch(() => {
      setLocation("Unknown location");
    })
    .finally(() => {
      setLoadingLocation(false);
    });
  }
        
          
        
      
        

        
       
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocation("Location denied");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    setLocation("Geolocation not supported");
    setLoadingLocation(false);
  }

}, []);
console.log("location",location);




  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                  <img src={targetLogo} alt="Logo" className="h-6 w-6 brightness-0 invert" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                EVENTOO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/about"
                className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
              >
                About Us
              </Link>

              {isLoggedin && (
                <>
                  <Link
                    to="/home"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shows"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    Shows & Events
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/userTickets"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    Tickets
                  </Link>
                  <Link
                    to="/userChat"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all"
                  >
                    Chat
                  </Link>
                  <Link
                    to="/userNotifications"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all relative"
                  >
                    Notifications
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>
                </>
              )}
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedin ? (
                <>
                  <Link 
                    to="/userProfile"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {username}
                      {loadingLocation ? (
    <span className="text-xs text-gray-300">Loading...</span>
  ) : (
    <span className="text-xs text-gray-400 ml-1">({location})</span>
  )}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Menu Panel s*/}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-950 via-black to-slate-950 border-l border-white/10 shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Profile Card (Mobile) */}
            {isLoggedin && (
              <Link
                to="/userProfile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-bold group-hover:text-purple-400 transition-colors">
                    {username}
                  </div>
                  <div className="text-xs text-gray-400">View Profile</div>
                </div>
              </Link>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                 
                </span>
                About Us
              </Link>

              {isLoggedin && (
                <>
                  <Link
                    to="/home"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      🏠
                    </span>
                    Home
                  </Link>
                  <Link
                    to="/shows"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      🎭
                    </span>
                    Shows & Events
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      📋
                    </span>
                    My Orders
                  </Link>
                  <Link
                    to="/userTickets"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      🎫
                    </span>
                    Tickets
                  </Link>
                  <Link
                    to="/userChat"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      💬
                    </span>
                    Chat
                  </Link>
                  <Link
                    to="/userNotifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group relative"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-all">
                      🔔
                    </span>
                    Notifications
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="pt-6 border-t border-white/10">
              {isLoggedin ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserNavbar;