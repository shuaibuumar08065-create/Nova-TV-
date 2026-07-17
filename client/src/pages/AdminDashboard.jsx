import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalVideos: 0, totalCategories: 0 });
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [videosRes, categoriesRes] = await Promise.all([
          api.get('/api/videos/'),
          api.get('/api/categories/'),
        ]);
        setStats({
          totalVideos: videosRes.data.length,
          totalCategories: categoriesRes.data.length,
        });
        setRecentVideos(videosRes.data.slice(0, 5));
        setError(null);
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Videos</h3>
          <p>{stats.totalVideos}</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p>{stats.totalCategories}</p>
        </div>
      </div>

      <section className="recent-videos">
        <h2>Recent Uploads</h2>
        {recentVideos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <ul>
            {recentVideos.map((video) => (
              <li key={video.id}>
                <Link to={`/video/${video.id}`}>{video.title}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to="/videos">View all videos</Link>
      </section>
    </div>
  );
};

export default AdminDashboard;
