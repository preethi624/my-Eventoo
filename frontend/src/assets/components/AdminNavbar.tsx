
interface AdminNavbarProps {
  email: string;
  onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ email, onLogout }) => {
  return (
    <nav className="bg-[#2c3e50] text-white h-14 flex items-center px-4 shadow-md justify-between">
      <div className="text-lg font-semibold">Admin Panel</div>
      <div className="relative group">
        <button className="text-white font-medium focus:outline-none">
          {email}
        </button>
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
