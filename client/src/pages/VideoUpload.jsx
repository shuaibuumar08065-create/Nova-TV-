import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';

const VideoUpload = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  // UI state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Preview URLs
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories/');
        setCategories(response.data);
      } catch (err) {
        // Error is already shown by interceptor, but we can set a local error
        setError('Failed to load categories. Please refresh.');
      }
    };
    fetchCategories();
  }, []);

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [thumbnailPreview, videoPreview]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return false;
    }
    if (!video) {
      toast.error('Video file is required.');
      return false;
    }
    if (!category) {
      toast.error('Please select a category.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('category', category);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('video', video);

    try {
      const response = await api.post('/api/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      // Success
      toast.success('Video uploaded successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      // The interceptor already shows a toast, but we want to display the exact message
      // and also set a local error for the UI if needed.
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      // Reset progress after a short delay so user sees 100%
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Category options
  const categoryOptions = categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ));

  return (
    <div className="upload-container">
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="4"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading || categories.length === 0}
            required
          >
            <option value="">Select a category</option>
            {categoryOptions}
          </select>
          {categories.length === 0 && !loading && (
            <p className="error-text">No categories found. Please add one first.</p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="form-group">
          <label>Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={loading}
          />
          {thumbnailPreview && (
            <div className="preview">
              <img src={thumbnailPreview} alt="Thumbnail preview" />
            </div>
          )}
        </div>

        {/* Video */}
        <div className="form-group">
          <label>Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            disabled={loading}
            required
          />
          {videoPreview && (
            <div className="preview">
              <video src={videoPreview} controls width="300" />
            </div>
          )}
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="upload-btn">
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
