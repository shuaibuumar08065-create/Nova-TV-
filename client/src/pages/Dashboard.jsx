import React, { useEffect, useState } from "react";
import api from "../services/api";

function StatCard({ title, value, color }) {
  return (
    <div
      className={`rounded-2xl shadow-lg ${color} text-white p-5 min-h-[120px] flex flex-col justify-between`}
    >
      <h2 className="text-sm font-semibold tracking-wide">
        {title}
      </h2>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_videos: 0,
    total_users: 0,
    total_views: 0,
    total_ads: 0,
    total_ad_views: 0,
    total_ad_clicks: 0,

    today_users: 0,
    today_views: 0,
    today_ad_views: 0,
    today_ad_clicks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.get("/api/admin/dashboard");

      setStats({
        total_videos: res.data.total_videos || 0,
        total_users: res.data.total_users || 0,
        total_views: res.data.total_views || 0,
        total_ads: res.data.total_ads || 0,
        total_ad_views: res.data.total_ad_views || 0,
        total_ad_clicks: res.data.total_ad_clicks || 0,

        today_users: res.data.today_users || 0,
        today_views: res.data.today_views || 0,
        today_ad_views: res.data.today_ad_views || 0,
        today_ad_clicks: res.data.today_ad_clicks || 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="w-full p-5">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          NOVA TV Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome Admin
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
     <StatCard
          title="Total Videos"
          value={stats.total_videos}
          color="bg-blue-600"
        />

        <StatCard
          title="Total Users"
          value={stats.total_users}
          color="bg-green-600"
        />

        <StatCard
          title="Total Views"
          value={stats.total_views}
          color="bg-red-600"
        />

        <StatCard
          title="Advertisements"
          value={stats.total_ads}
          color="bg-orange-600"
        />

        <StatCard
          title="Total Ad Views"
          value={stats.total_ad_views}
          color="bg-pink-600"
        />

        <StatCard
          title="Total Ad Clicks"
          value={stats.total_ad_clicks}
          color="bg-indigo-600"
        />

        <StatCard
          title="Today Users"
          value={stats.today_users}
          color="bg-emerald-600"
        />

        <StatCard
          title="Today Views"
          value={stats.today_views}
          color="bg-cyan-600"
        />

        <StatCard
          title="Today Ad Views"
          value={stats.today_ad_views}
          color="bg-violet-600"
        />

        <StatCard
          title="Today Ad Clicks"
          value={stats.today_ad_clicks}
          color="bg-amber-600"
        />
      </div>
    </div>
  );
}
