import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createStore } from '../../services/admin.service';
import { getAllUsers } from '../../services/admin.service';

const AddStoreForm = ({ onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const fetchStoreOwners = async () => {
    try {
      const users = await getAllUsers({ role: 'store_owner' });
      setStoreOwners(users);
    } catch (error) {
      toast.error('Failed to fetch store owners');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createStore(data);
      toast.success('Store created successfully');
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create store';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
          Store Name *
        </label>
        <input
          id="storeName"
          type="text"
          {...register('name', { required: 'Store name is required' })}
          autoComplete="organization"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="storeEmail"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format'
            }
          })}
          autoComplete="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          id="storeAddress"
          {...register('address', { required: 'Address is required' })}
          rows="3"
          autoComplete="street-address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
          Store Owner
        </label>
        <select
          id="ownerId"
          {...register('owner_id')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Store Owner (Optional)</option>
          {storeOwners.map(owner => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </div>
    </form>
  );
};

export default AddStoreForm;