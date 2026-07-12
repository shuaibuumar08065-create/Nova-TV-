import React, { useEffect, useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';

function Home() {
  const { videos, loading, fetchVideos } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Link to="/search" className="bg-blue-500 text-white px-4 py-2 rounded">
          Advanced
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
