// components/DataTable.tsx
<<<<<<< HEAD

=======
import React from 'react';
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

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
    <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col, idx) => (
              <th key={idx} className="p-2">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {columns.map((col, cidx) => (
                <td key={cidx} className="p-2">
                  {col.render ? col.render(row) : (row as any)[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
