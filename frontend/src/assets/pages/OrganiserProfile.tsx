import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, Mail, Phone, MapPin, Edit2, Check, X, Calendar, Award, TrendingUp, User } from "lucide-react";
import type { RootState } from "../../redux/stroe";

import { organiserRepository } from "../../repositories/organiserRepositories";

import { eventRepository } from "../../repositories/eventRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import type { OrganiserPro } from "../../interfaces/IOrganiser";
import OrganiserFooter from "../components/OrganiserFooter";

export const OrganiserProfile: React.FC = () => {
  const organiser = useSelector((state: RootState) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [organiserData, setOrganiserData] = useState({
    name: "",
    location: "",
    email: "",
    phone: 0,
    aboutMe: "",
  });
  const [profileImage, setProfileImage] = useState(
    organiser?.profileImage || ""
  );
  const [organiserStats, setOrganiserStats] = useState<OrganiserPro>({
    count: 0,
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (organiserData) {
      setFormData({
        name: organiserData.name || "",
        email: organiserData.email || "",
        phone: organiserData.phone || "",
        location: organiserData.location || "",
        bio: organiserData.aboutMe || "",
      });
    }
  }, [organiserData]);
  
  useEffect(() => {
    fetchEventCreated();
  }, []);
  
  const fetchEventCreated = async () => {
    if (!organiser?.id) {
      throw new Error("organiserId not get");
    }
    const response = await eventRepository.getEventsCreated();
    console.log("count", response);

    setOrganiserStats(response.result);
  };

  const [formData, setFormData] = useState({
    name: organiserData.name || "",
    email: organiserData?.email || "",
    phone: organiserData?.phone || "",
    location: organiserData?.location || "",
    bio: organiserData?.aboutMe || "",
  });

  useEffect(() => {
    fetchOrganiserStats();
  }, []);

  const fetchOrganiserStats = async () => {
    try {
      if (!organiser?.id) {
        throw new Error("not any user found");
      }
      const response = await organiserRepository.getOrganiserById(
        organiser?.id
      );
      console.log("responseee", response);

      setOrganiserData(response.result.result);
      setProfileImage(response.result.result.profileImage);
    } catch (error) {
      console.error("Failed to fetch organiser stats:", error);
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
      if (!organiser?.id) {
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

      const response = await organiserRepository.updateOrganiser(
        formDataToSend,
        organiser?.id
      );

      if (response) {
        setIsEditing(false);

        fetchOrganiserStats();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
            {/* Cover Background */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800/80"></div>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-36 h-36 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-700 shadow-2xl">
                    <img
                      src={
                        profileImage
                          ? `http://localhost:3000/uploads/${profileImage}`
                          : "https://dummyimage.com/144x144/475569/ffffff&text=Organiser"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/70 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Camera className="w-10 h-10 text-white" />
                      </label>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Name and Location */}
                <div className="flex-1 text-center sm:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="text-3xl font-bold text-white bg-slate-700/50 border-2 border-slate-600/50 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition-all w-full"
                    />
                  ) : (
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {organiserData.name}
                    </h1>
                  )}
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300 mt-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
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
                        className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      />
                    ) : (
                      <span className="text-lg">{organiserData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                      Event Organiser
                    </span>
                  </div>
                </div>

                {/* Edit Buttons */}
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-3 bg-slate-700/50 text-gray-300 rounded-xl hover:bg-slate-700 hover:text-white border border-slate-600/50 hover:border-blue-500/50 transition-all"
                    >
                      <Edit2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Events Created
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {organiserStats.count}
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Total Attendees
                  </div>
                  <div className="text-3xl font-bold text-white">
                    0
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Award className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Success Rate
                  </div>
                  <div className="text-3xl font-bold text-white">
                    100%
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-2xl p-5 hover:border-pink-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-8 h-8 text-pink-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Active Events
                  </div>
                  <div className="text-3xl font-bold text-white">
                    0
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Contact Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="group flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-slate-600/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">Email Address</div>
                    <div className="text-white font-medium">{formData.email}</div>
                  </div>
                )}
              </div>

              <div className="group flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 bg-slate-600/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">Phone Number</div>
                    <div className="text-white font-medium">{formData.phone}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">About Me</h2>
            </div>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full h-40 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30 transition-all resize-none"
                placeholder="Tell us about yourself and your experience as an event organiser..."
              />
            ) : (
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <p className="text-gray-300 leading-relaxed">
                  {formData.bio || "No bio added yet. Click edit to add information about yourself."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default OrganiserProfile;