import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaTag, 
  
  FaCheck, 
  FaCopy, 
  FaGift,
  FaTicketAlt,
 
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaInfoCircle,
  FaShoppingCart
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import UserNavbar from "../components/UseNavbar";
import Footer from "../components/Footer";
import { offerRepository } from "../../repositories/offerRepositories";

interface OfferImage {
  url: string;
  public_id: string;
}

interface Offer {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
  applicableFor: 'all' | 'specific';
  categories?: string[];
  usageLimit: number;
  usedCount: number;
  userLimit: number;
  firstTimeOnly: boolean;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  images?: OfferImage[];
}

const OfferDetailsPage: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await offerRepository.fetchOfferById(offerId!);
      console.log("offer",response);
      
      
      if (response.success) {
        setOffer(response.offers);
      } else {
        toast.error("Failed to load offer details");
        navigate('/offers');
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
      toast.error("Error loading offer details");
      navigate('/offers');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success(`Code ${code} copied!`, {
      icon: '✂️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getDiscountBadge = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'flat') {
      return `₹${offer.discountValue} OFF`;
    } else {
      return `₹${offer.discountValue} CASHBACK`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading offer details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Offer Not Found</h3>
            <button 
              onClick={() => navigate('/offers')}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Back to Offers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(offer.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;
  const usagePercentage = Math.min((offer.usedCount / offer.usageLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate('/offers')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors font-semibold"
        >
          <FaArrowLeft />
          Back to Offers
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Image Gallery Section */}
          <div className="relative">
            {offer.images && offer.images.length > 0 ? (
              <div className="relative h-96 bg-gray-900">
                <img 
                  src={offer.images[currentImageIndex].url} 
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Image Navigation */}
                {offer.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {offer.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl shadow-2xl">
                  {getDiscountBadge(offer)}
                </div>

                {/* Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {isExpired && (
                    <div className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      ❌ EXPIRED
                    </div>
                  )}
                  {isExpiringSoon && !isExpired && (
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold animate-pulse">
                      🔥 Only {daysLeft} days left
                    </div>
                  )}
                  {offer.firstTimeOnly && (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      ⭐ First Time Users Only
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-red-400 via-pink-400 to-purple-400 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <FaGift className="text-9xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
                <div className="absolute top-6 right-6 bg-white/90 text-red-600 px-6 py-3 rounded-2xl font-bold text-2xl shadow-2xl">
                  {getDiscountBadge(offer)}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12">
            
            {/* Title & Description */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {offer.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Promo Code Section - Highlighted */}
            <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 border-3 border-dashed border-red-400 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wider">
                    🎫 Promotional Code
                  </p>
                  <p className="font-mono font-bold text-red-600 text-4xl tracking-wider mb-2">
                    {offer.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to copy and use at checkout
                  </p>
                </div>
                <button
                  onClick={() => copyCode(offer.code)}
                  disabled={isExpired}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                    isExpired 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : copiedCode 
                      ? 'bg-green-500 text-white scale-105' 
                      : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <FaCheck className="text-xl" /> Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-xl" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Discount Type */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <FaTag className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Discount Type</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{offer.discountType}</p>
                  </div>
                </div>
              </div>

              {/* Valid Period */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Valid Till</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(offer.endDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Limit */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Usage Limit</p>
                    <p className="text-lg font-bold text-gray-900">{offer.userLimit} per user</p>
                  </div>
                </div>
              </div>

              {/* Applicable For */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <FaShoppingCart className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Applicable For</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{offer.applicableFor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Left Column - Offer Conditions */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-red-500" />
                  Offer Conditions
                </h3>
                <div className="space-y-4">
                  {offer.minPurchase && (
                    <div className="flex items-start gap-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Minimum Purchase</p>
                        <p className="text-gray-600">₹{offer.minPurchase}</p>
                      </div>
                    </div>
                  )}
                  {offer.maxDiscount && offer.discountType === 'percentage' && (
                    <div className="flex items-start gap-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Maximum Discount</p>
                        <p className="text-gray-600">₹{offer.maxDiscount}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Discount Value</p>
                      <p className="text-gray-600">
                        {offer.discountType === 'percentage' 
                          ? `${offer.discountValue}%` 
                          : `₹${offer.discountValue}`
                        }
                      </p>
                    </div>
                  </div>
                  {offer.categories && offer.categories.length > 0 && (
                    <div className="flex items-start gap-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Applicable Categories</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {offer.categories.map((category, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Usage Statistics */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-red-500" />
                  Usage Statistics
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Times Used</span>
                      <span className="font-bold text-gray-900">{offer.usedCount} / {offer.usageLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${usagePercentage}%` }}
                      >
                        <span className="text-white text-xs font-bold">
                          {usagePercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                      <p className="text-3xl font-bold text-red-500">{offer.usedCount}</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Times Used</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                      <p className="text-3xl font-bold text-green-500">{offer.usageLimit - offer.usedCount}</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Remaining</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Valid From</span>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(offer.startDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-700">Valid Until</span>
                      <span className={`text-sm font-bold ${isExpiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                        {new Date(offer.endDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t-2 border-gray-200">
              <button
                onClick={() => navigate(`/shows/?code=${offer.code}`)}
                disabled={isExpired}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isExpired
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {isExpired ? 'Offer Expired' : 'Browse Events & Book Now'}
              </button>
              <button
                onClick={() => copyCode(offer.code)}
                disabled={isExpired}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${
                  isExpired
                    ? 'border-gray-300 text-gray-500 cursor-not-allowed'
                    : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                }`}
              >
                Copy Code Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OfferDetailsPage;