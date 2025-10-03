import  { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { FaEdit } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { adminRepository } from "../../repositories/adminRepositories";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import type { IUser } from "../../interfaces/IUser";
import { Search, Filter, SortAsc, Sparkles } from "lucide-react";
import DataTable from "../components/DataTable";

export interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked?: boolean;
}

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [debounceSearch, setDebounceSearch] = useState(searchTerm);
  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debounceSearch, filterStatus, sortBy, limit]);

  const fetchUsers = async () => {
    try {
      const response = await adminRepository.getAllUsers(
        limit,
        currentPage,
        searchTerm,
        filterStatus,
        sortBy
      );
      console.log("response", response);

      if (response.success && response.result) {
        setUsers(response.result);
        setTotalPage(response.total);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

      const response = await adminRepository.updateUser(id, formData);

      if (response.success) {
        setShowModal(false);
        fetchUsers();
        resetForm();
        toast.success("User updated");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    if (!user.name) {
      throw new Error("name not exist");
    }

    setFormData({ name: user.name, email: user.email });
    setShowModal(true);
  };

  const handleToggleBlock = async (user: IUser) => {
    if (!user) return;

    const result = await Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, block/unblock it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await adminRepository.blockUser(user);

        if (response.success) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
            )
          );

          if (user.isBlocked) {
            toast.success("Unblocked user successfully!");
          } else {
            toast.success("Blocked user successfully!");
          }
        } else {
          toast.error("Failed to block.");
        }
      } catch (error) {
        console.log(error);

        toast.error("Error blocking.");
      }
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ name: "", email: "" });
  };
  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Status",
      accessor: "isBlocked",
      render: (user: IUser) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            user.isBlocked
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      render: (user: IUser) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleToggleBlock(user)}
            className="text-red-600 hover:text-red-800"
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-sm mb-6">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Search & Filter
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="✨ Search by name or email..."
                  className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white/90 transition-all duration-300 text-slate-800 placeholder-slate-500 shadow-lg hover:shadow-xl font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Filter className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                  </div>
                  <select
                    className="appearance-none pl-11 pr-10 py-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 focus:bg-white/90 transition-all duration-300 text-slate-700 font-semibold cursor-pointer min-w-[150px] shadow-lg hover:shadow-xl"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">🌟 All Status</option>
                    <option value="blocked">🚫 Blocked</option>
                    <option value="unblocked">✅ unblocked</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <svg
                      className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <SortAsc className="h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300" />
                  </div>
                  <select
                    className="appearance-none pl-11 pr-10 py-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 focus:bg-white/90 transition-all duration-300 text-slate-700 font-semibold cursor-pointer min-w-[170px] shadow-lg hover:shadow-xl"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">🕒 Newest First</option>
                    <option value="oldest">⏳ Oldest First</option>
                    <option value="nameAsc">🔤 Name (A-Z)</option>
                    <option value="nameDesc">🔡 Name (Z-A)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <svg
                      className="h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none opacity-0 hover:opacity-100"></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div>
          <label className="mr-2 text-gray-600">Rows per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <DataTable<IUser> data={users} columns={columns} />
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {selectedUser ? "Edit User" : ""}
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                  {selectedUser ? "Update" : "Create"}
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
