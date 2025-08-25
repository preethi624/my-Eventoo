import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import { reviewRepository } from "../../repositories/reviewRepositories";

interface IReview {
  _id: string;
  userId: { name: string }; // adjust if User model is different
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
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <UserNavbar />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section with Statistics */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Event Reviews
            </h1>
            
            {/* Rating Summary */}
            <div className="flex items-center justify-center gap-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-yellow-500 text-xl mb-1">
                  {"★".repeat(Math.round(averageRating))}
                  <span className="text-gray-300">
                    {"☆".repeat(5 - Math.round(averageRating))}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-600">
                  {reviews.length === 1 ? 'Review' : 'Reviews'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            Share Your Experience
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section with Stars */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
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
                      className="text-3xl transition-all duration-200 hover:scale-110 focus:outline-none"
                    >
                      <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                
                <span className="text-lg font-medium text-gray-600 ml-2">
                  ({rating}/5)
                </span>
              </div>
              
              {/* Rating Description */}
              <div className="mt-2 text-sm text-gray-600">
                {rating === 1 && "😞 Poor - Didn't meet expectations"}
                {rating === 2 && "😕 Fair - Below average experience"}
                {rating === 3 && "😐 Good - Average experience"}
                {rating === 4 && "😊 Very Good - Exceeded expectations"}
                {rating === 5 && "🤩 Excellent - Outstanding experience!"}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Tell us more about your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                rows={4}
                placeholder="What did you love about this event? Any suggestions for improvement?"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            All Reviews ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-xl text-gray-500 mb-2">No reviews yet</p>
              <p className="text-gray-400">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div
                  key={review._id}
                  className="relative p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-200 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-gray-50 to-white"
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {(review.userId?.name || "A").charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <span className="font-bold text-gray-800 text-lg">
                          {review.userId || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500 text-lg">
                            {"★".repeat(review.rating)}
                            <span className="text-gray-300">
                              {"☆".repeat(5 - review.rating)}
                            </span>
                          </span>
                          <span className="text-sm text-gray-500">
                            ({review.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Number Badge */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                      #{reviews.length - index}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="bg-white p-4 rounded-lg border border-gray-100 mb-3">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {review.comment}
                    </p>
                  </div>

                  {/* Review Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      📅 {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {new Date(review.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="absolute top-14 right-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              review.sentiment === "positive"
                ? "bg-green-100 text-green-700"
                : review.sentiment === "negative"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
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
    </div>
  );
};

export default ReviewPage;