import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Film,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Ticket,
  Calendar,
  Settings,
  Building2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AdminAuthGuard from "./AdminAuthGuard";
import { toast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem("adminUser");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/admin/login");
  };

  // Menu items for admin sidebar
  const menuItems = [
    { path: "/admin/movies", icon: Film, label: "Movies" },
    { path: "/admin/cinemas", icon: Building2, label: "Cinemas" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/showtimes", icon: Calendar, label: "Showtimes" },
    { path: "/admin/reports", icon: BarChart3, label: "Reports" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-secondary transition-all duration-300 fixed h-full z-10`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-primary" />
              {isSidebarOpen && (
                <span className="ml-2 text-xl font-bold text-white">
                  Cinema DB
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-4 hover:bg-gray-800 transition-colors ${
                  location.pathname === item.path ? "bg-gray-800" : ""
                }`}
              >
                <item.icon
                  size={20}
                  className={`text-gray-300 ${
                    location.pathname === item.path ? "text-primary" : ""
                  }`}
                />
                {isSidebarOpen && (
                  <span
                    className={`ml-4 text-gray-300 ${
                      location.pathname === item.path
                        ? "text-white font-medium"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="flex items-center w-full p-4 text-left hover:bg-gray-800 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-gray-300" />
              {isSidebarOpen && (
                <span className="ml-4 text-gray-300">Logout</span>
              )}
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div
          className={`flex-1 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          } transition-all duration-300`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
