import React, { useState, useEffect } from 'react';
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
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  


  const mockVenues: Venue[] = [
    {
      id: '1',
      name: 'Grand Ballroom',
      address: '123 Event Street, City',
      capacity: 300,
      facilities: ['Parking', 'WiFi', 'Sound System', 'Stage'],
      pricePerHour: 500,
      images: ['ballroom1.jpg'],
      availability: true,
      description: 'Elegant ballroom perfect for weddings and corporate events',
      contactInfo: {
        phone: '123-456-7890',
        email: 'grand@venue.com'
      }
    },
    // Add more mock venues as needed
  ];

  useEffect(() => {
    setVenues(mockVenues);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Venue Management</h1>
        <button
          onClick={() => {
            setSelectedVenue(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Venue
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {venue.images[0] && (
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  venue.availability 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {venue.availability ? 'Available' : 'Booked'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{venue.name}</h2>
                <p className="text-indigo-600 font-semibold">
                  ${venue.pricePerHour}/hr
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{venue.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm">{venue.address}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Capacity: {venue.capacity} people</span>
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
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedVenue(venue);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // Add delete functionality
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => {
                    // Add view details functionality
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

      {/* Add/Edit Modal placeholder - implement as needed */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Add your modal content here */}
        </div>
      )}
    </div>
  );
};

export default VenuePage;