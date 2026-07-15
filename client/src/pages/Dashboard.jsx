import React, { useEffect, useState } from "react";
import api from "../services/api";

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {value ?? 0}
      </h2>
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
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        NOVA TV Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <Card
          title="Total Videos"
          value={stats.total_videos}
        />

        <Card
          title="Total Users"
          value={stats.total_users}
        />

        <Card
          title="Categories"
          value={stats.total_categories}
        />

        <Card
          title="Video Views"
          value={stats.total_views}
        />

        <Card
          title="Total Ads"
          value={stats.total_ads}
        />

        <Card
          title="Ad Views"
          value={stats.ad_views}
        />

        <Card
          title="Ad Clicks"
          value={stats.ad_clicks}
        />

      </div>

    </div>
  );
}
