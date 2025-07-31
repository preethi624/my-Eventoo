import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Camera, Mail, Phone, MapPin,  Edit2, Check, X,  } from 'lucide-react';
import type { RootState } from '../../redux/stroe';

import { userRepository } from '../../repositories/userRepositories';

import { paymentRepository } from '../../repositories/paymentRepositories';
import type { UserProfile } from '../../interfaces/IPayment';
import UserNavbar from '../components/UseNavbar';



const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  
  const [isEditing, setIsEditing] = useState(false);
  const[userData,setUserData]=useState({
    name:"",
    location:"",
    email:"",
    phone:0,
    aboutMe:""


  })
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [userStats, setUserStats] = useState<UserProfile>({
  
    eventsBooked: 0,
    totalSpent: 0,
 
  });

const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);



useEffect(() => {
  if(userData){
     setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.aboutMe || ''
    });
  }
}, [userData]);
useEffect(()=>{
  fetchEventBooked()

},[]);
const fetchEventBooked=async()=>{
  if(!user?.id){
    throw new Error("userId not get")
  }
  const response=await paymentRepository.getEventBooked();
  setUserStats(response)
 
  
}

  

  const [formData, setFormData] = useState({
  
    
    name: userData.name|| '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    bio: userData?.aboutMe|| ''
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      if(!user?.id){
        throw new Error("not any user found")
      }
      const response = await userRepository.getUserById();
      console.log("responseee",response);
      
    
      
    setUserData(response.user.user);
   setProfileImage(response.user.user.profileImage)

      
     
      
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file)
    setProfileImage(URL.createObjectURL(file))

    
  };

  const handleSubmit = async () => {
    try {
     
      if(!user?.id){
        throw new Error("userId not present")
      }
      const formDataToSend=new FormData();
      formDataToSend.append('name',formData.name);
      formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone.toString());
    formDataToSend.append('location', formData.location);
    formDataToSend.append('aboutMe', formData.bio);

    if (selectedImageFile) {
      formDataToSend.append('image', selectedImageFile); 
    }
      
      const response = await userRepository.updateUser(formDataToSend)
     
      if (response) {
        setIsEditing(false);
        
       fetchUserStats()
       
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <UserNavbar/>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-black"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img src={profileImage?`http://localhost:3000/uploads/${profileImage}`: 'https://dummyimage.com/128x128/cccccc/ffffff&text=User'} />

                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group">
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-2xl font-bold text-gray-900 bg-gray-100 rounded px-2 py-1"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                    )}
                    <p className="text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="bg-gray-100 rounded px-2 py-1"
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
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
             
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-purple-600 text-sm font-medium">Events Booked</div>
                <div className="text-2xl font-bold text-purple-900">{userStats.eventsBooked}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-green-600 text-sm font-medium">Total Spent</div>
                <div className="text-2xl font-bold text-green-900">
                  ₹{userStats.totalSpent}
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 bg-gray-100 rounded px-3 py-2"
                />
              ) : (
                <span className="text-gray-600">{formData.email}</span>
              )}
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 bg-gray-100 rounded px-3 py-2"
                />
              ) : (
                <span className="text-gray-600">{formData.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full h-32 bg-gray-100 rounded px-3 py-2 text-gray-600"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-600">{formData.bio || 'No bio added yet.'}</p>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default UserProfile;