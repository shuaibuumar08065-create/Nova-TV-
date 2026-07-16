import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Videos() {
  const navigate = useNavigate();

  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/videos");
      setAllVideos(response.data);
      setFilteredVideos(response.data);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...allVideos];

    if (searchTerm.trim() !== "") {
      result = result.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Published") {
      result = result.filter((video) => video.status === "published");
    } else if (filter === "Hidden") {
      result = result.filter((video) => video.status === "hidden");
    } else if (filter === "Newest") {
      result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } else if (filter === "Oldest") {
      result.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    } else if (filter === "Most Viewed") {
      result.sort((a, b) => b.views - a.views);
    }

    setFilteredVideos(result);
    setCurrentPage(1);
  }, [searchTerm, filter, allVideos]);

  const totalVideos = allVideos.length;
  const publishedVideos = allVideos.filter((v) => v.status === "published").length;
  const hiddenVideos = allVideos.filter((v) => v.status === "hidden").length;
  const totalViews = allVideos.reduce((sum, v) => sum + (v.views || 0), 0);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/videos/${id}`);
      await fetchVideos();
      setShowDeleteModal(false);
      setVideoToDelete(null);
    } catch (err) {
      alert("Failed to delete video. Please try again.");
    }
  };

  const openDeleteModal = (video) => {
    setVideoToDelete(video);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "published") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Published
        </span>
      );
    } else if (status === "hidden") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Hidden
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        Draft
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Videos Management</h1>
        <p className="text-gray-600">Manage all uploaded videos.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Videos</h3>
          <p className="text-2xl font-bold">{totalVideos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Published Videos</h3>
          <p className="text-2xl font-bold">{publishedVideos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Hidden Videos</h3>
          <p className="text-2xl font-bold">{hiddenVideos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search videos by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Hidden">Hidden</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Videos Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {filteredVideos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No videos uploaded yet.
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img
                        src={video.thumbnail || "https://via.placeholder.com/80x45"}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {video.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {video.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(video.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(video.uploadDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/video/${video.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/admin/edit/${video.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(video)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(startIndex + itemsPerPage, filteredVideos.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredVideos.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                            page === currentPage
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && videoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete the video "{videoToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVideoToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(videoToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
