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
      console.log("respoo", response);

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
          console.log("lat&long", longitude);
          if (latitude && longitude) {
            fetchLocationName(latitude, longitude).then((loc) => {
              setLocation(`${loc.city}, ${loc.state}`);
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
  
  console.log("location", location);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl">
                  <img src={targetLogo} alt="Logo" className="h-6 w-6 brightness-0 invert" />
                </div>
              </div>
              <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                EVENTOO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/about"
                className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
              >
                About Us
              </Link>

              {isLoggedin && (
                <>
                  <Link
                    to="/home"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shows"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    Shows & Events
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/userTickets"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    Tickets
                  </Link>
                  <Link
                    to="/userChat"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    Chat
                  </Link>
                  <Link
                    to="/userNotifications"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all relative"
                  >
                    Notifications
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>
                  <Link
                    to="/userOffer"
                    className="px-4 py-2 text-gray-700 hover:text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all relative"
                  >
                    Offers
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
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-gray-900 block">
                        {username}
                      </span>
                      {loadingLocation ? (
                        <span className="text-xs text-gray-500">Loading...</span>
                      ) : (
                        <span className="text-xs text-gray-500">{location}</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-500 to-pink-500">
              <span className="text-xl font-black text-white">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-all"
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
                className="flex items-center gap-3 p-4 mx-4 mt-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 hover:border-red-300 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-gray-900 font-bold">
                    {username}
                  </div>
                  <div className="text-xs text-gray-600">
                    {loadingLocation ? "Loading..." : location}
                  </div>
                </div>
              </Link>
            )}

            {/* Mobile Navigation Links */}
            <div className="flex-1 p-4 space-y-2">
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                  ℹ️
                </span>
                About Us
              </Link>

              {isLoggedin && (
                <>
                  <Link
                    to="/home"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      🏠
                    </span>
                    Home
                  </Link>
                  <Link
                    to="/shows"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      🎭
                    </span>
                    Shows & Events
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      📋
                    </span>
                    My Orders
                  </Link>
                  <Link
                    to="/userTickets"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      🎫
                    </span>
                    Tickets
                  </Link>
                  <Link
                    to="/userChat"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      💬
                    </span>
                    Chat
                  </Link>
                  <Link
                    to="/userNotifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all relative"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      🔔
                    </span>
                    Notifications
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></span>
                  </Link>
                  <Link
                    to="/userOffer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all relative"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-lg">
                      🎁
                    </span>
                    Offers
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {isLoggedin ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg transition-all"
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