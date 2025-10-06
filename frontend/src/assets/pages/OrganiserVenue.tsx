import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { organiserRepository } from "../../repositories/organiserRepositories";
import type { IVenue } from "../../interfaces/IVenue";
import OrganiserLayout from "../components/OrganiserLayout";
import OrganiserFooter from "../components/OrganiserFooter";

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  facilities: string[];
  pricePerHour: number;
  images: string[];
  availability: boolean;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
  };
}

const VenuePage: React.FC = () => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 6;

  const navigate = useNavigate();

  const fetchVenues = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());

    const response = await organiserRepository.getVenues(params.toString());
    console.log("responsevemnues", response);
    setVenues(response.result.venues);
    setTotalPages(response.result.totalPages);
  };

  useEffect(() => {
    fetchVenues();
  }, [currentPage, searchTerm]);

  const handleVenueDetail = async (venueId: string) => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Venue Management
              </h1>
              <p className="text-gray-400 mt-1">Browse and explore available venues</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all duration-300 group"
            >
              {/* Venue Image */}
              <div className="h-52 bg-gray-800/50 relative overflow-hidden">
                {venue.images[0] && (
                  <img
                    src={`http://localhost:3000/${venue.images[0].replace("\\", "/")}`}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Venue Details */}
              <div className="p-5 space-y-4 bg-gray-900/40">
                {/* Venue Name */}
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  {venue.name}
                </h3>

                {/* Location */}
                <div className="flex items-start text-gray-300 space-x-2">
                  <svg
                    className="mt-1 flex-shrink-0 w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">
                    {venue.address}, {venue.city}
                  </span>
                </div>

                {/* Capacity */}
                <div className="flex items-center text-gray-300 space-x-2">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">Capacity: {venue.capacity} people</span>
                </div>

                {/* Facilities */}
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.slice(0, 3).map((facility, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/40"
                    >
                      {facility}
                    </span>
                  ))}
                  {venue.facilities.length > 3 && (
                    <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                      +{venue.facilities.length - 3} more
                    </span>
                  )}
                </div>

                {/* View Details Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleVenueDetail(venue._id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg hover:shadow-purple-500/50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {venues.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Venues Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                Showing page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg"
                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default VenuePage;