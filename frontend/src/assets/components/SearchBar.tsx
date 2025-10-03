import  type { FC } from 'react';

import { FaSearch } from 'react-icons/fa';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: FC<Props> = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <div className="relative w-full max-w-2xl group">
        <input
          type="text"
          placeholder="Search for events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
          className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:bg-white"
        />
        <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      </div>
      <button
        onClick={onSearch}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all duration-300 whitespace-nowrap"
      >
        Explore Events
      </button>
    </div>
  );
};

export default SearchBar;
