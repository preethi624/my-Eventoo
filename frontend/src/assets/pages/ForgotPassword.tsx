import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authRepository } from "../../repositories/authRepositories";
import { useLocation } from "react-router-dom";
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("userType") || undefined;
  console.log("type", userType);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await authRepository.forgotPassword({ email, userType });

      if (result.success) {
        setMessage("Password reset link sent");
        setError("");
        localStorage.setItem("tempEmail", email);
        navigate(`/verifyOtp?userType=${userType}`);
      } else {
        setError(result.message || "Failed to send reset link");
        setMessage("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setMessage("");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
            >
              Send OTP
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
