import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/api/videos/${id}`);
        setVideo(response.data);
        setError(null);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div>Loading video...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!video) return <div>Video not found.</div>;

  return (
    <div className="video-player">
      <video src={video.video_url} controls autoPlay />
      <h2>{video.title}</h2>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;
