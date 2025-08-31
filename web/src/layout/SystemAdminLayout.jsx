import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function SystemAdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
