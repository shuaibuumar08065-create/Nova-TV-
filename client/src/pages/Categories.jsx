import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';
import CategoryForm from '../components/CategoryForm';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories/');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success('Category deleted');
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleFormSuccess = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="categories-page">
      <h1>Manage Categories</h1>
      <CategoryForm
        category={editingCategory}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditingCategory(null)}
      />

      <div className="category-list">
        {categories.length === 0 ? (
          <p>No categories yet. Add one above.</p>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <span>{cat.name}</span>
                <div>
                  <button onClick={() => handleEdit(cat)}>Edit</button>
                  <button onClick={() => handleDelete(cat.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
