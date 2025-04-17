
import React, { useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

const ReportsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [hasData, setHasData] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchMonthlyRevenue = () => {
    setIsLoading(true);
    
    // Simulate calling a stored procedure with mock data
    // In a real app, this would be an API call
    setTimeout(() => {
      // Create mock data for the specified year
      const mockData: RevenueData[] = months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 100000) + 50000
      }));
      
      setRevenueData(mockData);
      setHasData(true);
      setIsLoading(false);
    }, 1500);
  };

  const calculateTotalRevenue = () => {
    return revenueData.reduce((total, item) => total + item.revenue, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Revenue Reports</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Report</CardTitle>
          <CardDescription>
            View monthly revenue data and trends for a specific year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2020"
                max="2030"
              />
            </div>
            <Button 
              onClick={fetchMonthlyRevenue} 
              disabled={isLoading}
              className="sm:mb-1 flex items-center"
            >
              {isLoading ? 'Loading...' : 'Run Report'}
              <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {hasData && (
            <div className="mt-8 space-y-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="revenue" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        ${calculateTotalRevenue().toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
