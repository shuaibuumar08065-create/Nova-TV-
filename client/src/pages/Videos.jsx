import React from 'react';
import { useVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';

const Videos = () => {
  const { videos, loading, error, refetch } = useVideos();

  if (loading) return <div>Loading videos...</div>;
  if (error) {
    return (
      <div className="error-container">
        <p>Error loading videos: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="videos-grid">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default Videos;
