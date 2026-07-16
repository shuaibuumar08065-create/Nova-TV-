import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Videos() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchVideos() {

    try {

      const res = await api.get("/api/videos");

      setVideos(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchVideos();

  }, []);

  async function deleteVideo(id) {

    if (!window.confirm("Delete this video?")) return;

    try {

      await api.delete(`/api/videos/${id}`);

      fetchVideos();

    } catch (err) {

      alert(err.response?.data?.detail || "Delete failed");

    }

  }

  async function togglePublish(video) {

    try {

      await api.put(`/api/videos/${video.id}`, {
        published: !video.published,
      });

      fetchVideos();

    } catch (err) {

      alert(err.response?.data?.detail || "Update failed");

    }

  }

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {

    return (
      <div className="p-8 text-center text-xl">
        Loading videos...
      </div>
    );

  }if (loading) {

  return (
    <div className="p-8 text-center text-xl">
      Loading videos...
    </div>
  );

}const totalVideos = videos.length;

const publishedVideos = videos.filter(
  (video) => video.published
).length;

const hiddenVideos = videos.filter(
  (video) => !video.published
).length;

return (

  <div className="p-6">

    <div className="flex items-center justify-between mb-8">

      <div>

        <h1 className="text-3xl font-bold">
          Video Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage uploaded videos
        </p>

      </div>

      <a
        href="/admin/upload"
        className="bg-red-600 text-white px-5 py-3 rounded-lg"
      >
        Upload Video
      </a>

    </div>

    <div className="grid md:grid-cols-3 gap-5 mb-8">

      <div className="bg-white rounded-xl shadow p-5">

        <p className="text-gray-500">
          Total Videos
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalVideos}
        </h2>

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <p className="text-gray-500">
          Published
        </p>

        <h2 className="text-3xl font-bold text-green-600 mt-2">
          {publishedVideos}
        </h2>

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <p className="text-gray-500">
          Hidden
        </p>

        <h2 className="text-3xl font-bold text-red-600 mt-2">
          {hiddenVideos}
        </h2>

      </div>

    </div>

    <div className="bg-white rounded-xl shadow p-4 mb-6">

      <input
        type="text"
        placeholder="Search video..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

    </div>
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left p-4">
              Thumbnail
            </th>

            <th className="text-left p-4">
              Title
            </th>

            <th className="text-center p-4">
              Views
            </th>

            <th className="text-center p-4">
              Likes
            </th>

            <th className="text-center p-4">
              Status
            </th>

            <th className="text-center p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredVideos.length === 0 && (

            <tr>

              <td
                colSpan="6"
                className="text-center p-10 text-gray-500"
              >

                No videos found.

              </td>

            </tr>

          )}

          {filteredVideos.map((video) => (

            <tr
              key={video.id}
              className="border-t"
            >

              <td className="p-4">

                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-28 h-16 object-cover rounded"
                />

              </td>

              <td className="p-4 font-semibold">

                {video.title}

              </td>

              <td className="text-center">

                {video.views || 0}

              </td>

              <td className="text-center">

                {video.likes || 0}

              </td>

              <td className="text-center">

                {video.published ? (

                  <span className="text-green-600 font-semibold">
                    Published
                  </span>

                ) : (

                  <span className="text-red-600 font-semibold">
                    Hidden
                  </span>

                )}

              </td>

              <td className="p-4">

                <div className="flex gap-2 justify-center">

                  <a
                    href={`/admin/edit/${video.id}`}
                    className="px-3 py-2 rounded bg-blue-600 text-white"
                  >
                    Edit
                  </a>

                  <button
                    onClick={() => togglePublish(video)}
                    className="px-3 py-2 rounded bg-yellow-500 text-white"
                  >
                    {video.published ? "Hide" : "Publish"}
                  </button>

                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="px-3 py-2 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
     </div>

);

}
    </div>
