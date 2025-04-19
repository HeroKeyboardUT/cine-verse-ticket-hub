
import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [theaterName, setTheaterName] = useState('CinePlex Theater');
  const [email, setEmail] = useState('admin@example.com');
  const [phone, setPhone] = useState('(123) 456-7890');
  const [address, setAddress] = useState('123 Movie Street, Hollywood, CA 90210');
  const [openingHours, setOpeningHours] = useState('10:00 AM - 11:00 PM');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Settings className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theater Information</CardTitle>
            <CardDescription>
              Update your theater details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theaterName">Theater Name</Label>
              <Input
                id="theaterName"
                value={theaterName}
                onChange={(e) => setTheaterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>
              Customize your system behavior and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about bookings and cancellations
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications about bookings and cancellations
                </p>
              </div>
              <Switch
                id="smsNotifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for admin dashboard
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">System Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Version:</span> 1.0.0</p>
                <p><span className="text-muted-foreground">Database:</span> MySQL</p>
                <p><span className="text-muted-foreground">Last Backup:</span> 2023-05-20 03:15</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Saving..." : "Save Settings"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
