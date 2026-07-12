import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/stats')
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Videos</p>
          <p className="text-2xl font-bold">{data.total_videos}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{data.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">{data.total_views}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Likes</p>
          <p className="text-2xl font-bold">{data.total_likes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Favorites</p>
          <p className="text-2xl font-bold">{data.total_favorites}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">New Users (7d)</p>
          <p className="text-2xl font-bold">{data.new_users_week}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">New Videos (7d)</p>
          <p className="text-2xl font-bold">{data.new_videos_week}</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Top Videos</h3>
      <ul className="bg-white rounded shadow divide-y">
        {data.top_videos.map(v => (
          <li key={v.id} className="p-3 flex justify-between">
            <span>{v.title}</span>
            <span>{v.views} views</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Analytics;
