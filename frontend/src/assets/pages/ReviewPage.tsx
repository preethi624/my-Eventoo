import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import { reviewRepository } from "../../repositories/reviewRepositories";
import Footer from "../components/Footer";

interface IReview {
  _id: string;
  userId: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
  sentiment?:string
}

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
 
  
  useEffect(() => {
    if (!id) return;
    loadReviews();
  }, []);
  
  const loadReviews = async () => {
    if (!id) return;
    const response = await reviewRepository.fetchReviews(id);
    console.log("respo",response);
    
    setReviews(response.reviews);
  };
  console.log("reviees",reviews);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const response = await reviewRepository.createReview({ rating, comment }, id);
      console.log(response);
      loadReviews();
      setComment("");
      setRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Event Reviews
            </h1>
            
            {/* Rating Summary */}
            <div className="inline-flex items-center gap-8 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-yellow-400 text-2xl mb-2">
                  {"★".repeat(Math.round(averageRating))}
                  <span className="text-gray-700">
                    {"★".repeat(5 - Math.round(averageRating))}
                  </span>
                </div>
                <div className="text-sm text-gray-400 font-semibold">Average Rating</div>
              </div>
              <div className="h-16 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-400 font-semibold">
                  {reviews.length === 1 ? 'Review' : 'Reviews'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Add Review Form */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">✍️</span>
            Share Your Experience
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section with Stars */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-3">
                How would you rate this event?
              </label>
              <div className="flex items-center gap-4">
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="hidden"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                
                {/* Interactive Star Display */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-4xl transition-all duration-200 hover:scale-125 focus:outline-none"
                    >
                      <span className={star <= rating ? "text-yellow-400" : "text-gray-700"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                
                <span className="text-lg font-bold text-gray-300 ml-2">
                  ({rating}/5)
                </span>
              </div>
              
              {/* Rating Description */}
              <div className="mt-3 text-sm text-gray-400 font-medium">
                {rating === 1 && "😞 Poor - Didn't meet expectations"}
                {rating === 2 && "😕 Fair - Below average experience"}
                {rating === 3 && "😐 Good - Average experience"}
                {rating === 4 && "😊 Very Good - Exceeded expectations"}
                {rating === 5 && "🤩 Excellent - Outstanding experience!"}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-3">
                Tell us more about your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none placeholder-gray-500"
                rows={4}
                placeholder="What did you love about this event? Any suggestions for improvement?"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-2 font-medium">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-bold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-purple-500/20"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  Submit Review
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">💬</span>
            All Reviews ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-2xl text-gray-400 mb-2 font-bold">No reviews yet</p>
              <p className="text-gray-500">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div
                  key={review._id}
                  className="relative p-6 border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg bg-white/5 backdrop-blur-xl"
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {(review.userId?.name || "A").charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <span className="font-bold text-white text-lg">
                          {review.userId?.name || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400 text-lg">
                            {"★".repeat(review.rating)}
                            <span className="text-gray-700">
                              {"★".repeat(5 - review.rating)}
                            </span>
                          </span>
                          <span className="text-sm text-gray-400 font-semibold">
                            ({review.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Number Badge */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                      #{reviews.length - index}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10 mb-3">
                    <p className="text-gray-300 leading-relaxed text-base">
                      {review.comment}
                    </p>
                  </div>

                  {/* Review Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span className="flex items-center gap-1 font-medium">
                      📅 {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 font-medium">
                      {new Date(review.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold
                        ${
                          review.sentiment === "positive"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : review.sentiment === "negative"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                    >
                      {review.sentiment&&review.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default ReviewPage;