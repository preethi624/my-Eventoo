import React, { useEffect, useState } from "react";
import { 
  FaTag, 
  FaClock, 
  FaCheck, 
  FaCopy, 
  FaGift,
  FaTicketAlt,
  FaRupeeSign,
  FaFilter,
  FaStar,
  FaFire
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import UserNavbar from "../components/UseNavbar";
import Footer from "../components/Footer";
import { offerRepository } from "../../repositories/offerRepositories";
import { useNavigate } from "react-router-dom";

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
  images?: OfferImage[]
}

const UserOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('');
  
  const [selectedMinAmount, setSelectedMinAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    
    const limit=5

  const navigate = useNavigate()

  useEffect(() => {
    fetchOffers();
  }, [currentPage,limit,selectedType,selectedMinAmount]);
  

const clearFilters = () => {
  setSelectedType('');
 
  setSelectedMinAmount('');
  fetchOffers();
};


  const fetchOffers = async (filters = {}) => {
    try {
      setLoading(true);
      
       const params = new URLSearchParams(filters);
       if(selectedType) params.append("selectedType",selectedType)
        if(selectedMinAmount) params.append("selectedMinAmount",selectedMinAmount)
         params.append("page", currentPage.toString());
    params.append("limit", limit.toString());
      const response = await offerRepository.fetchOffers(params.toString())
      console.log("offers", response);
      
      if (response.success) {
        setOffers(response.offers || []);
        setTotalPages(response.totalPages)
        
      } else {
        toast.error("Failed to load offers");
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error("Error loading offers");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferClick = async (offerId: string) => {
    navigate(`/offer-details/${offerId}`);
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code ${code} copied!`, {
      icon: '✂️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => setCopiedCode(null), 2000);
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

  const getOfferSubtitle = (offer: Offer) => {
    const parts = [];
    
    if (offer.maxDiscount && offer.discountType === 'percentage') {
      parts.push(`Max ₹${offer.maxDiscount}`);
    }
    if (offer.minPurchase) {
      parts.push(`Min ₹${offer.minPurchase}`);
    }
    
    return parts.join(' • ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-purple-50/20">
      <UserNavbar />

      {/* Enhanced Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 opacity-20 animate-float">
            <FaGift className="text-8xl" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 animate-float-delayed">
            <FaTicketAlt className="text-7xl rotate-12" />
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-10 animate-float">
            <FaTag className="text-6xl -rotate-12" />
          </div>
          <div className="absolute top-1/4 right-1/3 opacity-15 animate-float-delayed">
            <FaStar className="text-5xl" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-lg rounded-full px-8 py-3 border border-white/20">
              <FaFire className="text-3xl animate-bounce" />
              <span className="text-xl font-bold">Hot Deals Alert!</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-200">
                Exclusive Offers
              </span>
              <br />
              <span className="text-white">Just For You</span>
            </h1>
            
            <p className="text-white/90 text-2xl mb-10 max-w-3xl mx-auto font-light">
              Unlock incredible savings on your next event booking with our handpicked deals
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="group bg-white/15 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:border-white/50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl group-hover:rotate-12 transition-transform">
                    <FaGift className="text-white text-2xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black">{offers.length}</p>
                    <p className="text-sm font-semibold text-white/80">Active Offers</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/15 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:border-white/50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl group-hover:rotate-12 transition-transform">
                    <FaTag className="text-white text-2xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black">50%</p>
                    <p className="text-sm font-semibold text-white/80">Max Savings</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/15 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:border-white/50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-400 to-pink-500 p-3 rounded-xl group-hover:rotate-12 transition-transform">
                    <FaFire className="text-white text-2xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black">24h</p>
                    <p className="text-sm font-semibold text-white/80">Limited Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl">
                <FaFilter className="text-white text-lg" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">Filter Offers</h3>
                <p className="text-sm text-gray-500">Find your perfect deal</p>
              </div>
            </div>
            <div className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {showFilters && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaTag className="text-red-500" />
                    Discount Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="flat">Flat Discount</option>
                    <option value="percentage">Percentage Discount</option>
                  </select>
                </div>

               

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaRupeeSign className="text-blue-500" />
                    Minimum Order
                  </label>
                  <select
                    value={selectedMinAmount}
                    onChange={(e) => setSelectedMinAmount(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  >
                    <option value="">Any Amount</option>
                    <option value="100">Below ₹100</option>
                    <option value="500">Below ₹500</option>
                    <option value="1000">Below ₹1000</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 opacity-0">Actions</label>
                  <div className="flex gap-2">
                    
                    <button onClick={clearFilters}
                      className="flex-1 text-gray-600 border-2 border-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                    >
                    Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-500"></div>
                <FaGift className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl" />
              </div>
              <p className="text-gray-600 text-lg mt-6 font-semibold">Loading amazing offers...</p>
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md mx-auto border-2 border-gray-100">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTicketAlt className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-3">No Offers Available</h3>
              <p className="text-gray-500 mb-8">Check back soon for exciting deals and promotions!</p>
              <button 
                onClick={fetchOffers}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Refresh Offers
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">
                  Available Offers
                </h2>
                <p className="text-gray-600">Discover exclusive deals tailored for you</p>
              </div>
              <button 
                onClick={fetchOffers}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold px-6 py-3 border-2 border-red-500 rounded-xl hover:bg-red-50 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map(offer => (
                <OfferCard 
                  key={offer._id} 
                  offer={offer} 
                  onCopy={copyCode}
                  onClick={() => handleOfferClick(offer._id)} 
                  isCopied={copiedCode === offer.code}
                  discountBadge={getDiscountBadge(offer)}
                  subtitle={getOfferSubtitle(offer)}
                />
              ))}
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
          </>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

interface OfferCardProps {
  offer: Offer;
  onCopy: (code: string) => void;
  isCopied: boolean;
  discountBadge: string;
  subtitle: string;
  onClick: () => void; 
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onCopy, onClick, isCopied, discountBadge, subtitle }) => {
  const daysLeft = Math.ceil((new Date(offer.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  return (
    <div 
      onClick={onClick} 
      className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-red-300 transition-all duration-500 cursor-pointer relative hover:-translate-y-2"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none z-10"></div>
      
      {/* Expired Overlay */}
      {isExpired && (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-2xl font-black mb-2">EXPIRED</p>
            <p className="text-sm font-semibold">This offer has ended</p>
          </div>
        </div>
      )}

      {/* Image Banner */}
      {offer.images ? (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={offer.images[0].url} 
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Discount Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-2xl font-black text-base shadow-2xl group-hover:scale-110 transition-transform">
            {discountBadge}
          </div>

          {/* Expiring Soon Badge */}
          {isExpiringSoon && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-xl">
              <FaFire /> Only {daysLeft} days left
            </div>
          )}

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-6 left-6 text-white text-7xl opacity-10 animate-float">🎁</div>
            <div className="absolute bottom-6 right-6 text-white text-6xl opacity-10 rotate-12 animate-float-delayed">🎟️</div>
          </div>
          <FaGift className="text-7xl text-white/30 relative z-10" />
          <div className="absolute top-4 right-4 bg-white/95 text-red-600 px-5 py-2.5 rounded-2xl font-black text-base shadow-2xl">
            {discountBadge}
          </div>
          {isExpiringSoon && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <FaFire /> {daysLeft} days left
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 relative z-20">
        {/* Title & Description */}
        <div className="mb-5">
          <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors leading-tight">
            {offer.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
            {offer.description}
          </p>
          {subtitle && (
            <p className="text-xs text-red-600 font-bold flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {offer.firstTimeOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
              <FaCheck className="text-xs" /> First Timer
            </span>
          )}
          {offer.applicableFor === 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
              <FaTag className="text-xs" /> All Events
            </span>
          )}
          {offer.categories && offer.categories.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
              {offer.categories[0]}
            </span>
          )}
          {offer.discountType === 'cashback' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">
              <FaRupeeSign className="text-xs" /> Cashback
            </span>
          )}
        </div>
        
        {/* Promo Code Box */}
        <div className="relative mb-5">
          <div className="bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 border-2 border-dashed border-red-300 rounded-2xl p-4 flex items-center justify-between group-hover:border-red-400 group-hover:shadow-lg transition-all">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wider flex items-center gap-1">
                <FaTicketAlt className="text-red-500" /> USE CODE
              </p>
              <p className="font-mono font-black text-red-600 text-xl tracking-wider">
                {offer.code}
              </p>
            </div>
            <button
              onClick={(e) => { onCopy(offer.code); e.stopPropagation(); }}
              disabled={isExpired}
              className={`p-3.5 rounded-xl transition-all duration-300 ${
                isExpired 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isCopied 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 shadow-lg' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-110 shadow-lg'
              }`}
            >
              {isCopied ? <FaCheck className="text-xl" /> : <FaCopy className="text-xl" />}
            </button>
          </div>
        </div>
        
        {/* Valid Until */}
        <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className={`p-2 rounded-lg ${isExpiringSoon ? "bg-orange-100" : "bg-gray-200"}`}>
            <FaClock className={isExpiringSoon ? "text-orange-500" : "text-gray-500"} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-semibold">Valid Until</p>
            <p className={`font-bold ${isExpiringSoon ? "text-orange-600" : "text-gray-900"}`}>
              {new Date(offer.endDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
      
    </div>
    
  );
};

export default UserOffersPage;