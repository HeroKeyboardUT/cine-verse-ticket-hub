
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const adminUser = user === 'admin';
    if (!adminUser) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need to sign in to access the admin area.",
      });
      navigate('/admin/login');
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default AdminAuthGuard;
