import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function VideoUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleVideo = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setVideoPreview(URL.createObjectURL(selected));
  };

  const handleThumbnail = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setThumbnail(selected);
    setThumbnailPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return alert("Video title is required.");
    }

    if (!file) {
      return alert("Please select a video.");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    setLoading(true);

    try {
      await api.post("/api/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Video uploaded successfully.");

      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Upload Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-5"
      >

        <div>
          <label className="font-semibold block mb-2">
            Video Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="border rounded-lg w-full p-3"
            required
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Description
          </label>

          <textarea
            rows="5"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="border rounded-lg w-full p-3"
          />
        </div>

        <div>

          <label className="font-semibold block mb-2">
            Video File
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideo}
            required
          />

        </div>

        {videoPreview && (

          <video
            controls
            className="rounded-xl w-full"
            src={videoPreview}
          />

        )}

        <div>

          <label className="font-semibold block mb-2">
            Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnail}
          />

        </div>

        {thumbnailPreview && (

          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="rounded-xl w-60 border"
          />

        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white rounded-lg w-full p-3 font-bold"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>

      </form>

    </div>
  );
}

export default VideoUpload;
