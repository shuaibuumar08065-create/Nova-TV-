import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';

const VideoCard = ({ video, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setDeleting(true);
    try {
      await api.delete(`/api/videos/${video.id}`);
      toast.success('Video deleted.');
      if (onDelete) onDelete(video.id);
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="video-card">
      <Link to={`/video/${video.id}`}>
        <img src={video.thumbnail_url} alt={video.title} />
        <h3>{video.title}</h3>
      </Link>
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default VideoCard;
