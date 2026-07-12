import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Settings() {
  const [settings, setSettings] = useState({ site_name: '', site_description: '', maintenance_mode: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/settings')
      .then(res => setSettings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/settings', settings);
      alert('Settings updated');
    } catch (err) {
      alert(err.response?.data?.detail || 'Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Site Name</label>
          <input name="site_name" value={settings.site_name} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Site Description</label>
          <textarea name="site_description" value={settings.site_description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} />
          <label>Maintenance Mode</label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;
