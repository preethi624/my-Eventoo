import { useEffect, useState, type ChangeEvent } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout";
import { 
  FaGift, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaTimes,
  FaPercent,
  FaRupeeSign,
  FaCalendarAlt,
  FaTag,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
 
  FaFilter
} from "react-icons/fa";
import { adminRepository } from "../../repositories/adminRepositories";


export interface FormDataType {
  title: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  images: FileList | []; 
}

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    images:[]
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  
  const limit=5

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, statusFilter]);

  const fetchOffers = async () => {
    try {
      const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());
      const res = await adminRepository.fetchOffers(params.toString());
      console.log("offers",res);
      
      setOffers(res.offers || []);
      setTotalPages(res.totalPages);
    setCurrentPage(res.currentPage);
   
    } catch (error) {
      console.error(error);
      toast.error("Failed to load offers");
    }
  };

  const filterOffers = () => {
    let filtered = offers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(offer => {
        const status = getOfferStatusType(offer.startDate, offer.endDate);
        return status === statusFilter;
      });
    }

    setFilteredOffers(filtered);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        
        const response=await adminRepository.editOffer(formData,editingOffer._id);
        console.log("repoon",response);
        
        toast.success("✅ Offer updated successfully!");
      } else {
       
       
        await adminRepository.createOffer(formData)
        toast.success("🎉 Offer created successfully!");
      }
      setFormData({
        title: "",
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscountAmount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        images:[]
      });
      setEditingOffer(null);
      setShowForm(false);
      fetchOffers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save offer");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
      try {
        const response = await adminRepository.deleteOffer(id);
        

        if (response) {
          toast.success("Event deleted successfully!");
          fetchOffers();
        } else {
          toast.error("Failed to delete event.");
        }
      } catch (error) {
        console.log(error);

        toast.error("Error deleting event.");
      }
    }

    
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setShowForm(true);
    setFormData({
      title: offer.title,
      code: offer.code,
      description: offer.description || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderAmount: offer.minOrderAmount || "",
      maxDiscountAmount: offer.maxDiscountAmount || "",
      startDate: offer.startDate.split("T")[0],
      endDate: offer.endDate.split("T")[0],
      usageLimit: offer.usageLimit || "",
      images:offer.images
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOffer(null);
    setFormData({
      title: "",
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      images:[]
    });
  };

  const isOfferActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getOfferStatusType = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
  };

  const getOfferStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { text: "Upcoming", color: "text-blue-400 bg-blue-900/30 border-blue-500/30" };
    if (now > end) return { text: "Expired", color: "text-red-400 bg-red-900/30 border-red-500/30" };
    return { text: "Active", color: "text-green-400 bg-green-900/30 border-green-500/30" };
  };

  const stats = {
    total: offers.length,
    active: offers.filter(o => isOfferActive(o.startDate, o.endDate)).length,
    expired: offers.filter(o => new Date(o.endDate) < new Date()).length,
    upcoming: offers.filter(o => new Date(o.startDate) > new Date()).length
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 text-white p-6">
        <ToastContainer position="top-right" theme="dark" />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <FaGift className="text-4xl text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Offers Management</h1>
                <p className="text-gray-400 mt-1">Create and manage promotional offers</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaPlus /> Create New Offer
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-5 hover:border-purple-500 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Offers</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <FaTag className="text-2xl text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-5 hover:border-green-500 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <FaCheckCircle className="text-2xl text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-5 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.upcoming}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <FaClock className="text-2xl text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-5 hover:border-red-500 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Expired</p>
                  <p className="text-3xl font-bold text-red-400">{stats.expired}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <FaTimesCircle className="text-2xl text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
           
          <input
  type="text"
  placeholder="Search by name..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  className="w-full pl-4 pr-4 py-2 border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl my-8">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                  <FaGift /> {editingOffer ? "Edit Offer" : "Create New Offer"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaTimes className="text-xl text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title & Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., Flat 50% Off"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Offer Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      placeholder="e.g., FLAT50"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the offer details..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Type *
                    </label>
                    <div className="relative">
                      <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="discountValue"
                        placeholder="e.g., 50"
                        value={formData.discountValue}
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Min & Max Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      placeholder="e.g., 500"
                      value={formData.minOrderAmount}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Discount Amount
                    </label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      placeholder="e.g., 200"
                      value={formData.maxDiscountAmount}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usage Limit
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="usageLimit"
                      placeholder="e.g., 1000 (leave empty for unlimited)"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              <div>
                              <label className="block mb-2 text-gray-300 font-medium">
                                Offer Images
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  setFormData({
                                    ...formData,
                                    images: e.target.files||[],
                                  })
                                }
                                className="w-full bg-gray-800 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                              />
                            </div>


                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {editingOffer ? "Update Offer" : "Create Offer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Offers List */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-100">
              {statusFilter === "all" ? "All Offers" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Offers`}
              <span className="text-gray-400 text-lg ml-2">({filteredOffers.length})</span>
            </h3>
          </div>
          
          {filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => {
                const status = getOfferStatus(offer.startDate, offer.endDate);
                return (
                  <div
                    key={offer._id}
                    className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                            {offer.title}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{offer.description || "No description provided"}</p>
                      </div>
                    </div>

                    {/* Code Badge */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Promo Code</p>
                      <p className="font-mono font-bold text-purple-400 text-lg tracking-wider">
                        {offer.code}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-white font-semibold">
                          {offer.discountType === "percentage" 
                            ? `${offer.discountValue}%` 
                            : `₹${offer.discountValue}`}
                        </span>
                      </div>
                      {offer.minOrderAmount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Min Order:</span>
                          <span className="text-white font-semibold">₹{offer.minOrderAmount}</span>
                        </div>
                      )}
                      {offer.maxDiscountAmount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Max Discount:</span>
                          <span className="text-white font-semibold">₹{offer.maxDiscountAmount}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Valid Period:</span>
                        <span className="text-white font-semibold text-xs">
                          {new Date(offer.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(offer.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {offer.usageLimit && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Usage Limit:</span>
                          <span className="text-white font-semibold">{offer.usageLimit}</span>
                        </div>
                      )}
                      
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">UsedCount:</span>
                          <span className="text-white font-semibold">{offer.usedCount}</span>
                        </div>
                      
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-12 text-center">
              <FaGift className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchTerm || statusFilter !== "all" ? "No Offers Found" : "No Offers Yet"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Create your first offer to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <FaPlus /> Create Offer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded border ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
    </AdminLayout>
  );
}