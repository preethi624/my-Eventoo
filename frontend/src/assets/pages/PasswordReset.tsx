import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { authRepository } from '../../repositories/authRepositories';
import { toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

   const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
    const userType = queryParams.get('userType')||'';
 
  const navigate = useNavigate();
  const email = localStorage.getItem("tempEmail")||''

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character');
      setMessage('');
      return;
    }

    try {
      const result = await authRepository.resetPassword({ email, password,userType });

      if (result.success) {
        setMessage('Password reset successful');
        toast.success(result.message)
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message || 'Failed to reset password');
        toast.error(result.message)
        setMessage('');
      }
    } catch (error) {
      console.log(error);
      
      setError('Something went wrong. Please try again.');
      setMessage('');
    }
  };

  return (
    <>
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
