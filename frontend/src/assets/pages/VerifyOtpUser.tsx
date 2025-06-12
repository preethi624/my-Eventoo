import React, { useState, useEffect } from 'react';
import type {  FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';






import { authRepository } from '../../repositories/authRepositories';

export interface VerifyOtpUser{
    name:string,
    email:string,
    password:string,
    otp:string
}
export interface ResendPayload{
    email:string;
    userType?:string|null
    
}


const VerifyOtpUser: React.FC = () => {
  
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(600);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
     
      return;
    }

    try {
      const email = localStorage.getItem('tempEmail');
      const name = localStorage.getItem('tempName');
      const password = localStorage.getItem('tempPassword');

      if (!email || !name || !password) {
       
        return;
      }

      const response = await authRepository.verifyOtpUser({ name, email, password, otp });

      if (response.success) {
        toast.success('Verification successful!');
        navigate('/login');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    try {
      const email = localStorage.getItem('tempEmail');
      if (!email) {
        toast.error('Email not found');
        return;
      }

      const response = await authRepository.resendOtp({ email });

      if (response.success) {
        setTimer(600);
        setIsResendDisabled(true);
        setOtp('');
        toast.success('OTP sent successfully');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log(error);
      
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 p-4">
      
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
       

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter the verification code we sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            required
            className="text-center text-2xl tracking-widest p-4 border border-gray-300 rounded-lg w-full max-w-xs mx-auto bg-white mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="text-gray-600 text-sm mb-4">
            Time remaining: {formatTime(timer)}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg w-11/12 mx-auto transition duration-300"
          >
            Verify Now
          </button>

          <p
            onClick={handleResendOtp}
            className={`mt-4 text-sm ${
              isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 cursor-pointer'
            } transition duration-300`}
          >
            {isResendDisabled
              ? `Wait ${formatTime(timer)} to resend`
              : 'Resend'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpUser;
