import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  async function loadVideo() {
    try {
      const res = await api.get(`/api/videos/${id}`);
      const video = res.data;

      setTitle(video.title || "");
      setDescription(video.description || "");
      setPublished(video.published ?? true);

      setVideoPreview(video.video_url || "");
      setThumbnailPreview(video.thumbnail_url || "");
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to load video");
      navigate("/admin/videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideo();
  }, [id]);

  function handleVideoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  function handleThumbnailChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("published", published);

    if (videoFile) {
      formData.append("file", videoFile);
    }

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      setSaving(true);

      await api.put(`/api/videos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Video updated successfully");

      navigate("/admin/videos");
    } catch (err) {
      alert(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (<div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >

        <div>
          <label className="block font-semibold mb-2">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>

          <label className="block font-semibold mb-2">
            Thumbnail
          </label>

          {thumbnailPreview && (

            <img
              src={thumbnailPreview}
              alt="Thumbnail"
              className="w-72 rounded-lg border mb-3"
            />

          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Video File
          </label>

          {videoPreview && (

            <video
              src={videoPreview}
              controls
              className="w-full rounded-lg border mb-3"
            />

          )}

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />

        </div>

        <div className="flex items-center gap-3">

          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />

          <label htmlFor="published">
            Published
          </label>

        </div>

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/videos")}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>

  );

}
