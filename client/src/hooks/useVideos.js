import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/videos/');
      setVideos(response.data);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      // Toast is already shown by interceptor; we just set state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, refetch: fetchVideos };
};
