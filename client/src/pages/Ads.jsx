import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Ads() {
  const emptyForm = {
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    active: true,
    position: "sidebar",
  };

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function fetchAds() {
    try {
      const res = await api.get("/api/ads");
      setAds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/api/ads/${editing}`, form);
      } else {
        await api.post("/api/ads", form);
      }

      setEditing(null);
      setForm(emptyForm);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  }

  function editAd(ad) {
    setEditing(ad.id);

    setForm({
      title: ad.title || "",
      description: ad.description || "",
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      active: ad.active,
      position: ad.position || "sidebar",
    });
  }

  async function deleteAd(id) {
    if (!window.confirm("Delete this advertisement?")) return;

    try {
      await api.delete(`/api/ads/${id}`);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  const totalViews = ads.reduce(
    (sum, ad) => sum + (ad.views || 0),
    0
  );

  const totalClicks = ads.reduce(
    (sum, ad) => sum + (ad.clicks || 0),
    0
  );

  const totalAds = ads.length;

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading advertisements...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Advertisement Manager
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Total Ads
          </p>

          <h2 className="text-3xl font-bold">
            {totalAds}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Total Views
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {totalViews}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Total Clicks
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {totalClicks}
          </h2>
        </div>
      </div><div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            {editing ? "Update Advertisement" : "Create Advertisement"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Advertisement title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              name="link_url"
              placeholder="Destination URL"
              value={form.link_url}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="sidebar">Sidebar</option>
              <option value="banner">Banner</option>
            </select>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              Active Advertisement

            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-3"
            >
              {editing ? "Update Advertisement" : "Create Advertisement"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full bg-gray-600 text-white rounded-lg py-3"
              >
                Cancel Editing
              </button>
            )}

          </form>

        </div>

        <div className="space-y-4">

          <h2 className="text-xl font-bold">
            Advertisements
          </h2>{ads.length === 0 && (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No advertisements found.
            </div>
          )}

          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-xl shadow p-5"
            >

              <div className="flex items-center justify-between mb-3">

                <div>

                  <h3 className="font-bold text-lg">
                    {ad.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {ad.position}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    ad.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ad.active ? "Active" : "Inactive"}
                </span>

              </div>

              <p className="text-gray-600 mb-4">
                {ad.description || "No description"}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">

                <div className="bg-gray-100 rounded-lg p-3">

                  <p className="text-xs text-gray-500">
                    Views
                  </p>

                  <p className="text-xl font-bold text-blue-600">
                    {ad.views || 0}
                  </p>

                </div>

                <div className="bg-gray-100 rounded-lg p-3">

                  <p className="text-xs text-gray-500">
                    Clicks
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    {ad.clicks || 0}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => editAd(ad)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAd(ad.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
