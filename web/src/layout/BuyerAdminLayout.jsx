import { BuyerAdminSidebar } from "@/components/buyerAdmin/BuyerAdminSidebar";
import { Outlet } from "react-router-dom";

export default function BuyerAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <BuyerAdminSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
