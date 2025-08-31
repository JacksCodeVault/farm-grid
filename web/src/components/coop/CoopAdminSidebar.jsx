import { Home, LogOut, UsersRound, Boxes, ShoppingCart, DollarSign } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const coopAdminTabs = [
  { label: "Dashboard", icon: <Home size={20} />, to: "/coop/dashboard" },
  { label: "Collections", icon: <Boxes size={20} />, to: "/coop/collections" },
  { label: "Orders", icon: <ShoppingCart size={20} />, to: "/coop/orders" },
  { label: "Deliveries", icon: <Boxes size={20} />, to: "/coop/deliveries" },
  { label: "Field Operators", icon: <UsersRound size={20} />, to: "/coop/staff" },
  { label: "Farmers", icon: <UsersRound size={20} />, to: "/coop/farmers" },
  { label: "Villages", icon: <Boxes size={20} />, to: "/coop/villages" },
  { label: "Payouts", icon: <DollarSign size={20} />, to: "/coop/payouts" },
];

export function CoopAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col shadow-sm">
      <div className="px-6 py-4 text-xl font-bold border-b">FarmGrid Coop Admin</div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {coopAdminTabs.map((tab) => (
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
