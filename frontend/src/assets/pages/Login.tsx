import { useState, useEffect } from "react";

import type { FC, FormEvent } from "react";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import type { AppDispatch } from "../../redux/stroe";
import {
  loginOrganiser,
  loginOrganiserWithGoogle,
  loginUser,
  loginUserWithGoogle,
} from "../../redux/thunk/authThunk";

const backgroundImages: string[] = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1511578314322-379afb476865",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
];

export interface Credentials {
  email: string;
  password: string;
  token?: string;
}
interface ThunkResult {
  success: boolean;
  token?: string;
  error?: any;
  message?: string;
}

const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const slideUpAnimation = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const LoginPage: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userType, setUserType] = useState<"user" | "organiser">("user");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const role = decoded.role;

        if (role === "user") {
          navigate("/home");
        } else if (role === "organiser") {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Token parsing failed", err);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      if (userType === "user") {
       
        const result:ThunkResult = await dispatch(loginUser(formData));
        if (result.success) {
          navigate("/home");
        } else {
          toast.error(result.message);
        }
      } else {
      
        const result:ThunkResult = await dispatch(loginOrganiser(formData));
        if (result.success) {
          navigate("/dashboard");
        } else {
          console.log("result", result);
          toast.error(result.error.message);
        }
      }
    }
  };
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const result = await dispatch(
        userType === "user"
          ? loginUserWithGoogle(credentialResponse)
          : loginOrganiserWithGoogle(credentialResponse)
      );

      if (result.success) {
        localStorage.setItem("authToken", result.token);
        navigate(userType === "user" ? "/home" : "/Dashboard");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Google login error", error);
      toast.error("Login failded,Please try again");
    }
  };
  const handleGoogleError = () => {
    try {
      console.error("Google login error occurred.");
      toast.error("An error occurred during Google login.");
    } catch (error) {
      console.error("Error handling Google login error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          {...fadeInAnimation}
          className="min-h-screen bg-cover bg-center transition-all duration-500 flex items-center justify-center p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            {...slideUpAnimation}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <motion.div
              className="text-center space-y-2"
              {...slideUpAnimation}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-amber-900">
                Welcome Back
              </h2>

              <p className="text-gray-600">Sign in to manage your events</p>
            </motion.div>

            <div className="flex justify-center gap-4 p-1 bg-gray-100 rounded-full">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setUserType("user")}
                className={`flex-1 py-2.5 px-6 rounded-full transition-all duration-300 ${
                  userType === "user"
                    ? "bg-white text-amber-900 shadow-md font-medium"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Attendee
              </motion.button>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setUserType("organiser")}
                className={`flex-1 py-2.5 px-6 rounded-full transition-all duration-300 ${
                  userType === "organiser"
                    ? "bg-white text-amber-900 shadow-md font-medium"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Organizer
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to={`/forgotPassword?userType=${userType}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full py-4 px-6 rounded-xl text-white bg-gradient-to-r from-[#4B3621] to-[#4B3621] hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium"
              >
                Sign In
              </motion.button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.div
                className="mt-6"
                {...slideUpAnimation}
                transition={{ delay: 0.4 }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </motion.div>

              <p className="mt-6 text-center text-sm text-gray-600">
               Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
