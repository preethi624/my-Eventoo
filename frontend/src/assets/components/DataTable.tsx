// components/DataTable.tsx
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/30 shadow-2xl">
      {/* Glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50">
        <table className="min-w-full table-auto">
          {/* Modern Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-5 text-left text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></span>
                    {col.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Modern Table Body */}
          <tbody className="divide-y divide-gray-800/30">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="group hover:bg-gradient-to-r hover:from-purple-500/10 hover:via-pink-500/5 hover:to-blue-500/10 transition-all duration-300 backdrop-blur-sm"
                >
                  {columns.map((col, cidx) => (
                    <td 
                      key={cidx} 
                      className="px-6 py-5 text-gray-300 text-sm group-hover:text-white transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        {col.render ? col.render(row) : (row as any)[col.accessor]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-gray-700/50 shadow-xl">
                        <svg 
                          className="w-10 h-10 text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-300 font-semibold text-lg">No data available</p>
                      <p className="text-gray-500 text-sm">There are no records to display at the moment</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom gradient fade */}
      {data.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
      )}

      <style >{`
        /* Custom Scrollbar Styles */
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.5));
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8));
        }
      `}</style>
    </div>
  );
};

export default DataTable;