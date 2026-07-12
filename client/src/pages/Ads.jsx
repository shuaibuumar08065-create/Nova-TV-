import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Ads() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', link_url: '', active: true, position: 'sidebar' });
  const [editing, setEditing] = useState(null);

  const fetchAds = () => {
    api.get('/api/ads').then(res => setAds(res.data));
  };

  useEffect(fetchAds, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/ads/${editing}`, form);
      } else {
        await api.post('/api/ads', form);
      }
      setForm({ title: '', description: '', image_url: '', link_url: '', active: true, position: 'sidebar' });
      setEditing(null);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete ad?')) return;
    try {
      await api.delete(`/api/ads/${id}`);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.detail || 'Delete failed');
    }
  };

  const startEdit = (ad) => {
    setEditing(ad.id);
    setForm(ad);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Ads</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Link URL</label>
          <input name="link_url" value={form.link_url} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          <label>Active</label>
        </div>
        <div>
          <label className="block text-sm font-medium">Position</label>
          <select name="position" value={form.position} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="sidebar">Sidebar</option>
            <option value="banner">Banner</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {editing ? 'Update' : 'Create'} Ad
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', image_url: '', link_url: '', active: true, position: 'sidebar' }); }} className="w-full bg-gray-500 text-white py-2 rounded">
            Cancel
          </button>
        )}
      </form>
      <ul className="space-y-2">
        {ads.map(ad => (
          <li key={ad.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{ad.title}</p>
              <p className="text-sm text-gray-600">{ad.position} - {ad.active ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <button onClick={() => startEdit(ad)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(ad.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ads;
