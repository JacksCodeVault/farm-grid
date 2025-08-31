import { Home, LogOut, ShoppingCart, Truck, DollarSign } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const buyerAdminTabs = [
  { label: "Dashboard", icon: <Home size={20} />, to: "/buyer/dashboard" },
  { label: "Place Order", icon: <ShoppingCart size={20} />, to: "/buyer/place-order" },
  { label: "My Orders", icon: <ShoppingCart size={20} />, to: "/buyer/my-orders" },
  { label: "Verify Delivery", icon: <Truck size={20} />, to: "/buyer/verify-delivery" },
  { label: "Record Payment", icon: <DollarSign size={20} />, to: "/buyer/record-payment" },
];

export function BuyerAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-gray-50 border-r flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">FarmGrid</h1>
        <span className="text-sm text-gray-500">Buyer Admin</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {buyerAdminTabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              location.pathname.startsWith(tab.to)
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 px-4 py-2 justify-start text-gray-600 hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}