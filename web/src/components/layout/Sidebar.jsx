import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col p-4">
      <div className="font-bold text-xl mb-6">FarmGrid</div>
      {/* Add navigation links here */}
      <nav className="flex flex-col gap-2">
        <a href="/admin/dashboard" className="hover:underline">Admin Dashboard</a>
        <a href="/coop/dashboard" className="hover:underline">Coop Dashboard</a>
        <a href="/buyer/dashboard" className="hover:underline">Buyer Dashboard</a>
        <a href="/orders" className="hover:underline">Orders</a>
        <a href="/farmers" className="hover:underline">Farmers</a>
      </nav>
    </aside>
  );
}
