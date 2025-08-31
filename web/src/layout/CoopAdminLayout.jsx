
import { CoopAdminSidebar } from "@/components/coop/CoopAdminSidebar";
import { Outlet } from "react-router-dom";

export default function CoopAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoopAdminSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
