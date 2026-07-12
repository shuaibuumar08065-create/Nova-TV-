import { useState } from 'react';
import api from '../services/api';

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/videos', { params });
      setVideos(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, fetchVideos };
};
