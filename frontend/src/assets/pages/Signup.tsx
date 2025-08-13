import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { authRepository } from "../../repositories/authRepositories";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backgroundImages: string[] = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
];

export interface SignupCred {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userType, setUserType] = useState<"user" | "organizer">("user");
  const [formData, setFormData] = useState<SignupCred>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    let isValid = true;
    const newErrors: FormErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter valid email";
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!password) {
      newErrors.password = "Password required";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      const credentials = { name, email, password, confirmPassword, userType };

      let result;
      if (userType === "user") {
        result = await authRepository.registerUser(credentials);
      } else {
        result = await authRepository.registerOrganiser(credentials);
      }

      if (result.success) {
        localStorage.setItem("tempEmail", email);
        localStorage.setItem("tempPassword", password);
        localStorage.setItem("tempName", name);

        navigate(userType === "user" ? "/verifyOtpUser" : "/verifyOtpOrg");
      } else {
        toast(result.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">🧭 EVENTOO</h2>

          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg ${
                userType === "user" ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => setUserType("user")}
            >
              User
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${
                userType === "organizer" ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => setUserType("organizer")}
            >
              Organizer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                className={`w-full p-2 border rounded ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className={`w-full p-2 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                className={`w-full p-2 border rounded ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`w-full p-2 border rounded ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-2"
            >
              Sign Up as {userType === "user" ? "User" : "Organizer"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
