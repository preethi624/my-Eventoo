import  { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { adminRepository } from "../../repositories/adminRepositories";
import type { IVenue } from "../../interfaces/IVenue";

import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout";
import DataTable from "../components/DataTable";
import LocationPicker from "../components/LocationPicker";

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
  seatTypes:[{type:"",seatCount:""}]
};
interface VenueForm {
  address: string;
  city: string;
  state: string;
  pincode: string;
}
type SeatType = {
  type: string;
  seatCount: string;
};


const VenueManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(defaultForm);
  const [seatTypes, setSeatTypes] = useState([{ type: "", seatCount: "" }]);

 

  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);
  const limit = 6;
 const handleSeatTypeChange = (
  index: number,
  field: keyof SeatType, 
  value: string
) => {
  const updated = [...seatTypes];
  updated[index][field] = value;
  setSeatTypes(updated);
};
const addSeatType = () => {
  setSeatTypes([...seatTypes, { type: "", seatCount: "" }]);
};

const removeSeatType = (index: number) => {
  const updated = [...seatTypes];
  updated.splice(index, 1);
  setSeatTypes(updated);
};
useEffect(() => {
  if (selectedVenue) {
    setFormData(selectedVenue);
    setSeatTypes(
      selectedVenue.seatTypes?.length
        ? selectedVenue.seatTypes.map((s: any) => ({
            type: s.type,
            seatCount: String(s.seatCount),
          }))
        : [{ type: "", seatCount: "" }]
    );
  }
}, [selectedVenue]);
console.log("venues",venues);





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
   if (!formData.name.trim()) return toast.error("Venue name is required");
  if (!formData.address.trim()) return toast.error("Address is required");
  if (!formData.city.trim()) return toast.error("City is required");
  if (!formData.state.trim()) return toast.error("State is required");

  if (!formData.pincode.trim())
    return toast.error("Pincode is required");
  if (!/^\d{5,6}$/.test(formData.pincode))
    return toast.error("Pincode must be 5-6 digits");

  if (!formData.contactPerson.trim())
    return toast.error("Contact person is required");

  if (!formData.phone.trim())
    return toast.error("Phone number is required");
  if (!/^\d{10}$/.test(formData.phone))
    return toast.error("Phone number must be 10 digits");

  if (!formData.email.trim())
    return toast.error("Email is required");
  // HTML input type="email" does basic validation

  if (formData.website && !/^https?:\/\/\S+\.\S+$/.test(formData.website))
    return toast.error("Website must be a valid URL");

  // 2️⃣ Seat Types Validations
  if (seatTypes.length === 0)
    return toast.error("Add at least one seat type");

  for (let i = 0; i < seatTypes.length; i++) {
    const seat = seatTypes[i];
    if (!seat.type.trim())
      return toast.error(`Seat type at position ${i + 1} is required`);
    if (!seat.seatCount || Number(seat.seatCount) <= 0)
      return toast.error(`Seat count at position ${i + 1} must be greater than 0`);
  }

  // 3️⃣ Total Cost Validation
  if (!formData.totalCost || Number(formData.totalCost) <= 0)
    return toast.error("Total cost must be greater than zero");

  // 4️⃣ Optional: Images
  if (formData.images && formData.images.length > 10)
    return toast.error("Maximum 10 images allowed");

  // 5️⃣ Optional: Description length check
  if (formData.description && formData.description.length > 500)
    return toast.error("Description cannot exceed 500 characters");


  const totalCapacity = seatTypes.reduce(
    (sum, seat) => sum + Number(seat.seatCount || 0),
    0
  );

  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    if(key==="seatTypes"||key==="totalCapacity") return
    if (key === "images") {
      formData.images.forEach((file: File) => {
        data.append("images", file);
      });
    } else {
      data.append(key, formData[key]);
    }
  });

  data.append("seatTypes", JSON.stringify(seatTypes));
  data.append("totalCapacity", String(totalCapacity));

  const response = await adminRepository.createVenue(data);
  if (response.success) {
    fetchVenues();
    toast.success("Venue created successfully!");
  }
  setShowCreateModal(false);
  setFormData(defaultForm);
  setSeatTypes([{ type: "", seatCount: "" }]);
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
  console.log("formdata",formData);
  

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Venue name is required");
  if (!formData.address.trim()) return toast.error("Address is required");
  if (!formData.city.trim()) return toast.error("City is required");
  if (!formData.state.trim()) return toast.error("State is required");

  if (!/^\d{5,6}$/.test(formData.pincode))
    return toast.error("Pincode must be 5–6 digits");

  if (!/^\d{10}$/.test(formData.phone))
    return toast.error("Phone number must be 10 digits");

  if (!formData.email.trim())
    return toast.error("Email is required");

  if (formData.website && !/^https?:\/\/\S+\.\S+$/.test(formData.website))
    return toast.error("Website must be a valid URL");

  // 2️⃣ Seat Types
  if (seatTypes.length === 0)
    return toast.error("Add at least one seat type");

  for (let i = 0; i < seatTypes.length; i++) {
    const seat = seatTypes[i];
    if (!seat.type.trim())
      return toast.error(`Seat type at position ${i + 1} is required`);
    if (Number(seat.seatCount) <= 0)
      return toast.error(`Seat count at position ${i + 1} must be greater than 0`);
  }

  // 3️⃣ Total Cost Validation
  if (Number(formData.totalCost) <= 0)
    return toast.error("Total cost must be greater than zero");

    const updatedData = { ...formData ,seatTypes};
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
  const columns = [
    { header: "Name", accessor: "name" },
    {
      header: "Location",
      accessor: "city",
      render: (venue: IVenue) => `${venue.city}, ${venue.state}`,
    },
    { header: "Capacity", accessor: "capacity",  render: (venue: IVenue) => venue.capacity ?? venue.totalCapacity ?? "N/A", },
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
              setSeatTypes(venue.seatTypes && venue.seatTypes.length > 0 
    ? venue.seatTypes.map((s: any) => ({
        type: s.type,
        seatCount: String(s.seatCount),
      }))
    : [{ type: "", seatCount: "" }]
  );
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
  
  

  return (
    <>
      <AdminLayout>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
           
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
  {/* Title */}
  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
    Venue Management
  </h1>

  {/* Search Input */}
  <div className="w-full sm:w-1/3">
    <div className="relative">
      <input
        type="text"
        placeholder="Search by name, city or state..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  </div>

  {/* Add Button */}
  <div className="flex justify-center sm:justify-end">
    <button
      onClick={() => setShowCreateModal(true)}
      className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
    >
      <Plus className="w-5 h-5 mr-2" />
      Add New Venue
    </button>
  </div>
</div>


            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <DataTable data={venues} columns={columns} />
            </div>
          </div>
        </div>

       
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
                
                <h3 className="text-lg font-semibold">Seat Types</h3>
{seatTypes.map((seat, index) => (
  <div key={index} className="flex gap-2 mb-2">
    <input
      type="text"
      placeholder="Seat Type (e.g. VIP)"
      value={seat.type}
      onChange={(e) => handleSeatTypeChange(index, "type", e.target.value)}
      className="border p-2 rounded w-1/2"
    />
    <input
      type="number"
      placeholder="Seat Count"
      value={seat.seatCount}
      onChange={(e) => handleSeatTypeChange(index, "seatCount", e.target.value)}
      className="border p-2 rounded w-1/2"
    />
    {seatTypes.length > 1 && (
      <button
        type="button"
        onClick={() => removeSeatType(index)}
        className="bg-red-500 text-white px-3 rounded"
      >
        X
      </button>
    )}
  </div>
))}
<button
  type="button"
  onClick={addSeatType}
  className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
>
  + Add Seat Type
</button>

{/* totalCost input */}
<input
  name="totalCost"
  type="number"
  required
  placeholder="Total Cost of Venue"
  value={formData.totalCost}
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
              <p>Click on the map to autofill the address 👇</p>
      <LocationPicker
        onAddressSelect={(addressData) => {
          setFormData((prev:VenueForm) => ({
            ...prev,
            ...addressData,
          }));
        }}
      />
            </div>
          </div>
        )}

        
        
        {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-y-auto max-h-[90vh]">
      <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Edit Venue</h2>

        {/* Venue Details */}
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Venue Name</label>
        <input
          name="name"
          required
          placeholder="Venue Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border p-2 rounded "
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Address</label>
        <textarea
          name="address"
          required
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">City</label>

        <input
        
          name="city"
          required
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">State</label>
        <input
          name="state"
          required
          placeholder="State"
          value={formData.state}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Pincode</label>
        <input
          name="pincode"
          required
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">ContactPerson</label>
        <input
          name="contactPerson"
          required
          placeholder="Contact Person"
          value={formData.contactPerson}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Phone</label>
        <input
          name="phone"
          required
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Email</label>
        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Website</label>
        <input
          name="website"
          type="url"
          placeholder="Website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />

        {/* Seat Types */}
        <h3 className="text-lg font-semibold">Seat Types</h3>
        {seatTypes.map((seat, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Seat Type (e.g. VIP)"
              value={seat.type}
              onChange={(e) => handleSeatTypeChange(index, "type", e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="Seat Count"
              value={seat.seatCount}
              onChange={(e) => handleSeatTypeChange(index, "seatCount", e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            {seatTypes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSeatType(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSeatType}
          value={formData.seatTypes}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
        >
          + Add Seat Type
        </button>

        {/* Total Cost */}
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Price</label>
        <input
          name="totalCost"
          type="number"
          required
          placeholder="Total Cost of Venue"
          value={formData.totalCost}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Description</label>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />


        {/* Status */}
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Buttons */}
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

      {/* Map Picker */}
      <p>Click on the map to autofill the address 👇</p>
      <LocationPicker
        onAddressSelect={(addressData) => {
          setFormData((prev: VenueForm) => ({
            ...prev,
            ...addressData,
          }));
        }}
      />
    </div>
  </div>
)}

        
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
