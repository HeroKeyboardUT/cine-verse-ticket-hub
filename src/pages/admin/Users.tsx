
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Users className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage system users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the user management functionality. In a real application, this would include a list of users with options to create, edit, and delete users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
