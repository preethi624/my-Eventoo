import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, Mail, Phone, MapPin, Edit2, Check, X, Key, Lock } from "lucide-react";
import type { RootState } from "../../redux/stroe";
import { userRepository } from "../../repositories/userRepositories";
import { paymentRepository } from "../../repositories/paymentRepositories";
import UserNavbar from "../components/UseNavbar";
import type { UserPro } from "../../interfaces/IPayment";
import Footer from "../components/Footer";

export const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    location: "",
    email: "",
    phone: 0,
    aboutMe: "",
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [userStats, setUserStats] = useState<UserPro>({
    eventsBooked: 0,
    totalSpent: 0,
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.aboutMe || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    fetchEventBooked();
  }, []);

  const fetchEventBooked = async () => {
    if (!user?.id) {
      throw new Error("userId not get");
    }
    const response = await paymentRepository.getEventBooked();
    setUserStats(response);
  };

  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    location: userData?.location || "",
    bio: userData?.aboutMe || "",
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      if (!user?.id) {
        throw new Error("not any user found");
      }
      const response = await userRepository.getUserById();

      setUserData(response.user.user);
      setProfileImage(response.user.user.profileImage);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        throw new Error("userId not present");
      }
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone.toString());
      formDataToSend.append("location", formData.location);
      formDataToSend.append("aboutMe", formData.bio);

      if (selectedImageFile) {
        formDataToSend.append("image", selectedImageFile);
      }

      const response = await userRepository.updateUser(formDataToSend);

      if (response) {
        setIsEditing(false);
        fetchUserStats();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ New passwords do not match");
      return;
    }
    
    try {
      const response = await userRepository.changePassword(
        currentPassword,
        newPassword,
      );
      console.log("respo", response);

      if (response.success) {
        setPasswordMessage("✅ Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage("❌ Failed to change password ");
      }
    } catch (error) {
      console.log(error);
      setPasswordMessage("❌ Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />

      {/* Hero Section with animated background */}
      <div className="pt-32 pb-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 relative z-10">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl">
                  <img
                    src={
                      profileImage
                        ?`import.meta.env.VITE_REACT_APP_SOCKET_URL/uploads/${profileImage}`
                        : "https://dummyimage.com/128x128/cccccc/ffffff&text=User"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </label>
                  )}
                </div>
              </div>
              <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="text-2xl font-bold text-white bg-black/50 border border-white/10 rounded-xl px-3 py-2"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-white">
                        {userData.name}
                      </h1>
                    )}
                    <p className="text-gray-400 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="bg-black/50 border border-white/10 rounded-xl px-3 py-1 text-white"
                        />
                      ) : (
                        userData.location
                      )}
                    </p>
                  </div>
                  <div>
                    {isEditing ? (
                      <div className="space-x-2">
                        <button
                          onClick={handleSubmit}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-lg"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-white transition-all hover:bg-white/10 rounded-full"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-lg">
                <div className="text-purple-400 text-sm font-semibold mb-1">
                  Events Booked
                </div>
                <div className="text-3xl font-bold text-white">
                  {userStats.eventsBooked}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-lg">
                <div className="text-green-400 text-sm font-semibold mb-1">
                  Total Spent
                </div>
                <div className="text-3xl font-bold text-white">
                  ₹{userStats.totalSpent}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-purple-400 mr-3" />
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              ) : (
                <span className="text-gray-300">{formData.email}</span>
              )}
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-blue-400 mr-3" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              ) : (
                <span className="text-gray-300">{formData.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-300">
              {formData.bio || "No bio added yet."}
            </p>
          )}
        </div>

        {/* Change Password */}
        <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-2 text-purple-400" />
            Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>

            {passwordMessage && (
              <p
                className={`text-sm font-semibold ${
                  passwordMessage.startsWith("✅")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {passwordMessage}
              </p>
            )}

            <button
              onClick={handleChangePassword}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-blue-500 transition-all border border-purple-500/20"
            >
              <Key className="w-5 h-5 mr-2" />
              Update Password
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default UserProfile;