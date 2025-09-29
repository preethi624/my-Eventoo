import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { organiserRepository } from "../../repositories/organiserRepositories";
import type { IVenue } from "../../interfaces/IVenue";
import OrganiserLayout from "../components/OrganiserLayout";
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
<<<<<<< HEAD
  //const [nameSearch, setNameSearch] = useState("");
  //const [locationSearch, setLocationSearch] = useState("");
  const [searchTerm,setSearchTerm]=useState("");
  const limit = 6;

  
=======
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const limit = 6;

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  const navigate = useNavigate();

  const fetchVenues = async () => {
    const params = new URLSearchParams();
<<<<<<< HEAD
    //if (nameSearch) params.append("nameSearch", nameSearch);
    //if (locationSearch) params.append("locationSearch", locationSearch);
    if(searchTerm) params.append("searchTerm",searchTerm)
=======
    if (nameSearch) params.append("nameSearch", nameSearch);
    if (locationSearch) params.append("locationSearch", locationSearch);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());

    const response = await organiserRepository.getVenues(params.toString());
    console.log("responsevemnues", response);
    setVenues(response.result.venues);
    setTotalPages(response.result.totalPages);
  };

  useEffect(() => {
    fetchVenues();
<<<<<<< HEAD
  }, [currentPage, searchTerm]);
=======
  }, [currentPage, nameSearch, locationSearch]);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  const handleVenueDetail = async (venueId: string) => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <OrganiserLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Venue Management</h1>
          <div className="relative">
            <input
              type="text"
<<<<<<< HEAD
              placeholder="Search by name or venue"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
=======
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => {
                setNameSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name location..."
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
<<<<<<< HEAD
         
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-200 relative">
                {venue.images[0] && (
                  <img
                    src={`http://localhost:3000/${venue.images[0].replace(
                      "\\",
                      "/"
                    )}`}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-black bold">
                    <span className="text-xl">{venue.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    </svg>
<<<<<<< HEAD
                    <span className="text-sm">{venue.address},</span>
                    <span>{venue.city}</span>
                  </div>


=======
                    <span className="text-sm">{venue.address}</span>
                  </div>

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    <span className="text-sm">
                      Capacity: {venue.capacity} people
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleVenueDetail(venue._id);
                    }}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination Controls */}
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
    </OrganiserLayout>
  );
};

export default VenuePage;
