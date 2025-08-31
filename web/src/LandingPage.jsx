import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">FarmGrid</h1>
        <p className="text-xl text-blue-900 max-w-xl mx-auto">
          The digital backbone for a transparent, efficient, and trusted agricultural supply chain. Connecting farmers, coops, and buyers from field to payment.
        </p>
      </header>
      <main className="flex flex-col items-center gap-6">
        <a href="/login" className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Login</a>
        <a href="/register" className="px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold border border-blue-600 shadow hover:bg-blue-50 transition">Register</a>
      </main>
      <footer className="mt-12 text-blue-500 text-sm">
        &copy; {new Date().getFullYear()} FarmGrid. All rights reserved.
      </footer>
    </div>
  );
}
