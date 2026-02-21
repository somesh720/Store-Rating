import React from 'react';
import { FaSort, FaSortUp, FaSortDown, FaStar } from 'react-icons/fa';

const StoreTable = ({ stores, onSort, sortBy, sortOrder }) => {
  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="text-gray-400" />;
    return sortOrder === 'ASC' ? 
      <FaSortUp className="text-blue-600" /> : 
      <FaSortDown className="text-blue-600" />;
  };

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(column, newOrder);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => handleSort('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                Name {getSortIcon('name')}
              </div>
            </th>
            <th 
              onClick={() => handleSort('email')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                Email {getSortIcon('email')}
              </div>
            </th>
            <th 
              onClick={() => handleSort('address')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                Address {getSortIcon('address')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Ratings
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stores.map((store) => (
            <tr key={store.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{store.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{store.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{store.address}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-900">{store.average_rating}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{store.total_ratings}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;