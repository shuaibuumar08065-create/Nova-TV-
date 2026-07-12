import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  const thumb = video.thumbnail_path ? video.thumbnail_path.split('/').pop() : 'default.jpg';
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <Link to={`/video/${video.id}`}>
        <img
          src={`/uploads/${thumb}`}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold truncate">{video.title}</h3>
          <p className="text-sm text-gray-500">{video.views} views</p>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
