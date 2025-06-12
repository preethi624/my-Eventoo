import React, { useState, useEffect} from 'react';
import type { FormEvent } from 'react';
import { FaEdit } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { adminRepository } from '../../repositories/adminRepositories';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';
import type { IUser } from '../../interfaces/IUser';

export interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked?: boolean;
}

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser| null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminRepository.getAllUsers();
      console.log("response",response);
      
      if (response.success&&response.result) {
        setUsers(response.result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const id = selectedUser?._id;
      if (!id) {
        toast.error("Invalid user ID");
        return;
      }
      
        const response =await adminRepository.updateUser( id, formData )

      
         
        

      if (response.success) {
        setShowModal(false);
        fetchUsers();
        resetForm();
        toast.success( "User updated" );
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    if(!user.name){
      throw new Error("name not exist")
    }
    
    setFormData({ name: user.name, email: user.email });
    setShowModal(true);
  };

  

  const handleToggleBlock = async (user: IUser) => {

    
     if (!user) return;
        
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
              const response = await adminRepository.blockUser(user);
             
              
              if (response.success) {
                fetchUsers();
                if(user.isBlocked){
                  toast.success('Unblocked user successfully!');
                  
                
    
                }else{
    
               
                toast.success('Blocked user successfully!');
                }
                
               
              } else {
                toast.error( 'Failed to block.');
              }
            } catch (error) {
              console.log(error);
              
              toast.error('Error blocking.');
            }
          }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '' });
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">Status</th>
              <th className="text-left p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleToggleBlock(user)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.isBlocked ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <FaEdit />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedUser ? 'Edit User' : ''}</h3>
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
                  {selectedUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUser;
