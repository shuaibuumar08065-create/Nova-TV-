import React, { useEffect, useState } from "react";
import api from "../services/api";

function Card({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow-lg p-5 text-white ${color}`}>
      <h3 className="text-sm opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/dashboard")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        NOVA TV Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <Card
          title="Total Videos"
          value={stats.total_videos || 0}
          color="bg-blue-600"
        />

        <Card
          title="Total Users"
          value={stats.total_users || 0}
          color="bg-green-600"
        />

        <Card
          title="Categories"
          value={stats.total_categories || 0}
          color="bg-purple-600"
        />

        <Card
          title="Video Views"
          value={stats.total_views || 0}
          color="bg-red-600"
        />

        <Card
          title="Advertisements"
          value={stats.total_ads || 0}
          color="bg-orange-600"
        />

        <Card
          title="Ad Views"
          value={stats.total_ad_views || 0}
          color="bg-pink-600"
        />

        <Card
          title="Ad Clicks"
          value={stats.total_ad_clicks || 0}
          color="bg-indigo-600"
        />

      </div>

    </div>
  );
}
