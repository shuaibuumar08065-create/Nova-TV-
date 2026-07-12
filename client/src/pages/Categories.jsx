import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchCategories = () => {
    api.get('/api/categories').then(res => setCategories(res.data));
  };

  useEffect(fetchCategories, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editing) {
        await api.put(`/api/categories/${editing}`, { name });
      } else {
        await api.post('/api/categories', { name });
      }
      setName('');
      setEditing(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.detail || 'Delete failed');
    }
  };

  const startEdit = (cat) => {
    setEditing(cat.id);
    setName(cat.name);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="flex-1 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(''); }} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </form>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <span>{cat.name}</span>
            <div>
              <button onClick={() => startEdit(cat)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
