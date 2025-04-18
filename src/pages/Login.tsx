
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Film } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a mock login. In a real app, you would connect to your backend/Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification - in a real app, this would be server-side
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('adminUser', JSON.stringify({
          id: 'admin-1',
          email,
          name: 'Admin User',
          isAdmin: true
        }));
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard!",
        });
        
        navigate('/admin/movies');
        return;
      }
      
      // For demo purposes, any other combination works as normal user
      localStorage.setItem('user', JSON.stringify({
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: 'Demo User',
        isAdmin: false
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Film className="h-12 w-12 text-primary" />
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm space-y-2">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary underline underline-offset-4 hover:text-primary-focus">
                    Sign up
                  </Link>
                </p>
                <p className="text-muted-foreground">
                  <Link to="/admin/login" className="text-primary underline underline-offset-4 hover:text-primary-focus">
                    Admin Login
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
