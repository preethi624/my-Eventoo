import React, { useState, useEffect} from 'react';
import type { FormEvent } from 'react';
import { FaEdit} from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { adminRepository } from '../../repositories/adminRepositories';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';


export interface Organiser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isBlocked:boolean
 
}

const AdminOrganiser: React.FC = () => {
  const [organisers, setOrganisers] = useState<Organiser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrganiser, setSelectedOrganiser] = useState<Organiser | null>(null);
  const [formData, setFormData] = useState<Omit<Organiser, '_id'>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    status: 'pending',
    isBlocked:false
   
  });

  useEffect(() => {
    fetchOrganisers();
  }, []);

  const fetchOrganisers = async () => {
    try {
      const response = await adminRepository.getAllOrganisers();
    
      
      if (response.success&&response.result) {
        setOrganisers(response.result);
      }
    } catch (error: any) {
      console.error('Error fetching organisers:', error);
      toast.error('Failed to load organisers');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (!selectedOrganiser?._id) {
            toast.error('Invalid organiser ID');
            return;
          }
      const organiserId= selectedOrganiser?._id;
      const response =  await adminRepository.updateOrganiser( organiserId, formData )
     

      if (response.success) {
        toast.success('Organiser updated successfully and Email sent');
        setShowModal(false);
        fetchOrganisers();
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error saving organiser');
    }
  };

  const handleEdit = (organiser: Organiser) => {
    setSelectedOrganiser(organiser);
    setFormData({
      name: organiser.name,
      email: organiser.email,
      password: '',
      phone: organiser.phone || '',
      status: organiser.status || 'pending',
      isBlocked:organiser.isBlocked||false,
    });
    setShowModal(true);
  };

  
  const handleBlock = async (organiser:Organiser) => {
      if (!organiser) return;
    
      const result = await Swal.fire({
        title: 'Are you sure?',
       
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, block/unblock it!',
      });
    
      if (result.isConfirmed) {
        try {
          const response = await adminRepository.organiserBlock(organiser);
          if (response.success) {
            fetchOrganisers();
            if(organiser.isBlocked){
              toast.success('Unblocked organiser successfully!');
              
            

            }else{

           
            toast.success('Blocked organiser successfully!');
            }
            
           
          } else {
            toast.error('Failed to block.');
          }
        } catch (error) {
          console.log(error);
          
          toast.error('Error blocking.');
        }
      }
    };

  const resetForm = () => {
    setSelectedOrganiser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      status: 'pending',
      isBlocked:false
    });
  };

  const getStatusBadge = (status: string = 'pending') => {
    const base = 'px-2 py-1 rounded text-sm font-medium';
    switch (status) {
      case 'approved':
        return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
      case 'rejected':
        return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Organisers</h2>
        
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organisers.map((organiser) => (
              <tr key={organiser._id} className="border-t">
                <td className="p-3">{organiser.name}</td>
                <td className="p-3">{organiser.email}</td>
                <td className="p-3">{getStatusBadge(organiser.status)}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    onClick={() => handleEdit(organiser)}
                  >
                    <FaEdit />
                  </button>
                  <button
                 className={`${
                 organiser.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                  } text-white p-2 rounded`}
                 onClick={() => handleBlock(organiser)}
>
  {organiser.isBlocked ? 'Unblock' : 'Block'}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Edit Organiser
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Organiser['status'] })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {selectedOrganiser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrganiser;
