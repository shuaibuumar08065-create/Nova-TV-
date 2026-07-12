import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/api/videos/${id}`)
      .then(res => setVideo(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login');
    try {
      await api.post(`/api/videos/${id}/like`);
      setVideo(prev => ({ ...prev, likes: prev.likes + 1 }));
    } catch (err) {
      alert(err.response?.data?.detail || 'Error');
    }
  };

  const handleFavorite = async () => {
    if (!user) return alert('Please login');
    try {
      await api.post(`/api/videos/${id}/favorite`);
      alert('Added to favorites');
    } catch (err) {
      alert(err.response?.data?.detail || 'Error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <video controls className="w-full rounded shadow" src={`/uploads/${video.filename}`} />
        <h2 className="text-2xl font-bold mt-4">{video.title}</h2>
        <p className="text-gray-600">{video.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <span>Views: {video.views}</span>
          <span>Likes: {video.likes}</span>
          <button onClick={handleLike} className="bg-blue-500 text-white px-3 py-1 rounded">Like</button>
          <button onClick={handleFavorite} className="bg-green-500 text-white px-3 py-1 rounded">Favorite</button>
        </div>
        <p className="text-sm text-gray-400">Duration: {Math.floor(video.duration/60)}m {video.duration%60}s</p>
        <p className="text-sm text-gray-400">Resolution: {video.resolution}</p>
        <Link to="/" className="inline-block mt-4 text-blue-500">← Back</Link>
      </div>
    </div>
  );
}

export default VideoPlayer;
