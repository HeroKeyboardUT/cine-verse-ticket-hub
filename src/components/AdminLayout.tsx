
import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Film, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AdminAuthGuard from './AdminAuthGuard';
import { toast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem('adminUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/admin/login');
  };

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-secondary transition-all duration-300 fixed h-full z-10`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-primary" />
              {isSidebarOpen && <span className="ml-2 text-xl font-bold text-white">Admin</span>}
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
            <Link to="/admin/movies" className="flex items-center p-4 hover:bg-gray-800 transition-colors">
              <Film size={20} className="text-gray-300" />
              {isSidebarOpen && <span className="ml-4 text-gray-300">Movies</span>}
            </Link>
            <Link to="/admin/users" className="flex items-center p-4 hover:bg-gray-800 transition-colors">
              <Users size={20} className="text-gray-300" />
              {isSidebarOpen && <span className="ml-4 text-gray-300">Users</span>}
            </Link>
            <Link to="/admin/reports" className="flex items-center p-4 hover:bg-gray-800 transition-colors">
              <BarChart3 size={20} className="text-gray-300" />
              {isSidebarOpen && <span className="ml-4 text-gray-300">Reports</span>}
            </Link>
            <Button 
              variant="ghost" 
              className="flex items-center w-full p-4 text-left hover:bg-gray-800 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-gray-300" />
              {isSidebarOpen && <span className="ml-4 text-gray-300">Logout</span>}
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
