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
    
    fetch(API_AUTH.ADMIN_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username: username, Password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      }
      )
      .then((responseData) => {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', 'admin');
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
          duration: 2000,
        });
        navigate('/admin/movies');
      }
      )
      .catch((error) => {
        setError(error.message);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
          duration: 2000,
        });
      }
      )
      .finally(() => {
        setIsLoading(false);
      }
      );
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
