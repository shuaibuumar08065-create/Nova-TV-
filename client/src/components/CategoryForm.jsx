import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';

const CategoryForm = ({ category = null, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!category;

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/api/categories/${category.id}`, { name });
        toast.success('Category updated');
      } else {
        await api.post('/api/categories/', { name });
        toast.success('Category created');
      }
      setName('');
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h2>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        disabled={loading}
        required
      />
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
