<<<<<<< HEAD
import  { useEffect, useState } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { Check, Plus } from "lucide-react";
import { adminRepository } from "../../repositories/adminRepositories";
import type { IVenue } from "../../interfaces/IVenue";

import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout";
<<<<<<< HEAD
import DataTable from "../components/DataTable";
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

const defaultForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contactPerson: "",
  phone: "",
  email: "",
  website: "",
  capacity: "",
  description: "",
  facilities: [],
  status: "active",
  images: [],
};

const VenueManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);
  const limit = 6;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setFormData({ ...formData, images: files });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file: File) => {
          data.append("images", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    const response = await adminRepository.createVenue(data);
    if (response.success) {
      fetchVenues();
    }

    setShowCreateModal(false);
    setFormData(defaultForm);
    setPreviewImages([]);
  };
  const handleDeleteVenue = async (venueId: string) => {
    if (!venueId) return;

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
        const response = await adminRepository.venueDelete(venueId);
        console.log("ressooo", response);

        if (response) {
          toast.success("Event deleted successfully!");
          fetchVenues();
        } else {
          toast.error("Failed to delete event.");
        }
      } catch (error) {
        console.log(error);

        toast.error("Error deleting event.");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...formData };
    delete updatedData.images;
    console.log("update", updatedData);

    const response = await adminRepository.editVenue(updatedData);

    setShowEditModal(false);
    setSelectedVenue(null);
    setFormData(defaultForm);
    toast(response.message);
    fetchVenues();
  };
  const fetchVenues = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());

    const response = await adminRepository.fetchVenues(params.toString());

    setVenues(response.venues);
    setTotalPages(response.totalPages);
    setCurrentPage(response.currentPage);
    setTotalVenues(response.totalPages);
  };
  useEffect(() => {
    fetchVenues();
  }, [currentPage, searchTerm]);
<<<<<<< HEAD
  const columns = [
    { header: "Name", accessor: "name" },
    {
      header: "Location",
      accessor: "city",
      render: (venue: IVenue) => `${venue.city}, ${venue.state}`,
    },
    { header: "Capacity", accessor: "capacity" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Status",
      accessor: "status",
      render: (venue: IVenue) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            venue.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (venue: IVenue) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedVenue(venue);
              setFormData(venue);
              setShowEditModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteVenue(venue._id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  console.log(selectedVenue);
  console.log(totalVenues);
  
  
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  return (
    <>
      <AdminLayout>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, city or state..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // reset to page 1 on search
                    }}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                Venue Management
              </h1>
              <button
                onClick={() => setShowCreateModal(true)} // This does nothing now
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Venue
              </button>
            </div>

<<<<<<< HEAD
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <DataTable data={venues} columns={columns} />
=======
            {/*
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search venues by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>*/}

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {venues.map((venue) => (
                    <tr key={venue._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {venue.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {venue.city}, {venue.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {venue.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {venue.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            venue.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {venue.status.charAt(0).toUpperCase() +
                            venue.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedVenue(venue);
                            setFormData(venue); // Prefill form
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVenue(venue._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            </div>
          </div>
        </div>

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Add New Venue</h2>

                <input
                  name="name"
                  required
                  placeholder="Venue Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="address"
                  required
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="state"
                  required
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="pincode"
                  required
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="contactPerson"
                  required
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="website"
                  type="url"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="capacity"
                  required
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previewImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        className="h-24 w-full object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
                  >
                    <Check className="w-5 h-5 mr-1" /> Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Edit Venue</h2>

                {/* same fields without image */}
<<<<<<< HEAD
                <div className="mb-2">
                  <label>Venue Name</label>
                  <input
                    name="name"
                    required
                    placeholder="Venue Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Address</label>
                  <textarea
                    name="address"
                    required
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label>City</label>
                  <input
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">State</label>
                  <input
                    name="state"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Pincode</label>
                  <input
                    name="pincode"
                    required
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Contact Person</label>
                  <input
                    name="contactPerson"
                    required
                    placeholder="Contact Person"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Phone</label>
                  <input
                    name="phone"
                    required
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Email</label>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Website</label>
                  <input
                    name="website"
                    type="url"
                    placeholder="Website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Capacity</label>
                  <input
                    name="capacity"
                    required
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="">Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
=======
                <input
                  name="name"
                  required
                  placeholder="Venue Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="address"
                  required
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="state"
                  required
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="pincode"
                  required
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="contactPerson"
                  required
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="website"
                  type="url"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  name="capacity"
                  required
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
                  >
                    <Check className="w-5 h-5 mr-1" /> Update
                  </button>
                </div>
              </form>
            </div>
            <div className="flex justify-between items-center mt-4"></div>
          </div>
        )}
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
      </AdminLayout>
    </>
  );
};

export default VenueManagement;
