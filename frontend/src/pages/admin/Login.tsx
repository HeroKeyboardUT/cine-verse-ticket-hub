import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import API_AUTH from '@/lib/API_lib/API_AUTH';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Make API call to backend login endpoint
      const response = await fetch(API_AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: username, // Using Email as the key expected by backend
          password
        }),
      });
      
      // Parse response data
      const data = await response.json();
      
      // Handle non-2xx responses
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Extract token and user data
      const { token, user } = data;
      
      if (!token) {
        throw new Error('Authentication failed: No token received');
      }
      
      // Store auth data in localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: user.id,
        username: user.FullName,
        email: user.Email,
        role: 'admin' // Explicitly mark as admin
      }));
      
      // Show success notification
      toast({
        title: "Login successful",
        description: "Welcome to admin dashboard",
      });
      
      // Redirect to admin dashboard
      navigate('/admin/movies');
    } catch (err) {
      console.error('Login error:', err);
      
      // Set appropriate error message based on the error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      
      // Show error notification
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error || 'Authentication failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Film className="h-12 w-12 text-primary" />
            <span className="ml-2 text-3xl font-bold">CineVerse Admin</span>
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username"
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
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
            Back to Website
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
