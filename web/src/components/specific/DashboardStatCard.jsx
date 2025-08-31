import React from 'react';

export default function DashboardStatCard({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
