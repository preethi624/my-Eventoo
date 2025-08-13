import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

import { authRepository } from "../../repositories/authRepositories";
import "react-toastify/dist/ReactToastify.css";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(600);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("userType");

  const navigate = useNavigate();
  const email = localStorage.getItem("tempEmail") || "";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer, email, navigate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      const result = await authRepository.verifyOTP({ email, otp, userType });
      if (result.success) {
        toast.success("OTP verified successfully");
        localStorage.setItem("tempEmail", email);

        navigate(`/resetPassword?userType=${userType}`);
      } else {
        toast.error(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    try {
      const response = await authRepository.resendOTP({ email, userType });
      if (response.success) {
        toast.success("New OTP sent successfully");
        setTimer(600);
        setIsResendDisabled(true);
        setOtp("");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong while resending OTP.");
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  return (
    <>
      <h1>forgot</h1>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Enter OTP sent to your email
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div className="text-center text-sm text-gray-600 mb-4">
              Time remaining: {formatTime(timer)}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-300 mb-3"
            >
              Verify OTP
            </button>

            <p
              onClick={handleResendOtp}
              className={`text-center text-sm mt-3 cursor-pointer transition-colors duration-300 ${
                isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {isResendDisabled
                ? `Wait ${formatTime(timer)} to resend`
                : "Resend OTP"}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
