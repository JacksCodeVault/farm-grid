import { Home, Building, FileText, LogOut, UsersRound, Package, Globe, ShoppingCart, Boxes } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const adminTabs = [
  { label: "Dashboard", icon: <Home size={20} />, to: "/admin/dashboard" },
  { label: "Organizations", icon: <Building size={20} />, to: "/admin/organizations" },
  { label: "Users", icon: <UsersRound size={20} />, to: "/admin/users" },
  { label: "Commodities", icon: <Package size={20} />, to: "/admin/commodities" },
  { label: "Geography", icon: <Globe size={20} />, to: "/admin/geography" },
  { label: "Orders", icon: <ShoppingCart size={20} />, to: "/admin/orders" },
  { label: "Collections", icon: <Boxes size={20} />, to: "/admin/collections" },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col shadow-sm">
      <div className="px-6 py-4 text-xl font-bold border-b">FarmGrid Admin</div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {adminTabs.map((tab) => (
            <li key={tab.label}>
              <Link
                to={tab.to}
                className={`flex items-center gap-3 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 ${location.pathname.startsWith(tab.to) ? "bg-gray-100" : ""}`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 px-6 py-2 justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
