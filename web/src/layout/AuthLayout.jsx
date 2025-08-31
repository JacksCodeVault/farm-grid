// AuthLayout.jsx - Consistent full-viewport layout for all auth pages
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="fixed inset-0 w-screen h-screen min-h-screen bg-background flex items-center justify-center overflow-auto">
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
