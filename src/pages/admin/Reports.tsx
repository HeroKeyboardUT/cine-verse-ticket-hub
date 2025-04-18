import React, { useState } from 'react';
import { BarChart3, Calendar, PieChart, TrendingUp, ArrowUpDown, Database, Layers, Film, Ticket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface RevenueData {
  month: string;
  revenue: number;
}

interface MovieRevenue {
  name: string;
  revenue: number;
  tickets: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  tickets: number;
}

interface TopCustomer {
  id: string;
  name: string;
  totalSpent: number;
  ticketsPurchased: number;
  lastPurchase: string;
}

const ReportsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [cinema, setCinema] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [movieRevenueData, setMovieRevenueData] = useState<MovieRevenue[]>([]);
  const [dailyRevenueData, setDailyRevenueData] = useState<DailyRevenue[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [hasData, setHasData] = useState(false);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const cinemas = [
    { id: "all", name: "All Cinemas" },
    { id: "1", name: "Cinema City Downtown" },
    { id: "2", name: "Riverside Multiplex" },
    { id: "3", name: "West Mall Cinema" },
    { id: "4", name: "East End Pictures" },
    { id: "5", name: "North Star Cineplex" },
  ];

  const dateRanges = [
    { id: "7days", name: "Last 7 Days" },
    { id: "30days", name: "Last 30 Days" },
    { id: "90days", name: "Last 90 Days" },
    { id: "year", name: "This Year" },
  ];

  const fetchMonthlyRevenue = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData: RevenueData[] = months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 100000) + 50000
      }));
      
      setRevenueData(mockData);
      setHasData(true);
      setIsLoading(false);
    }, 800);
  };

  const fetchMovieRevenue = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData: MovieRevenue[] = [
        { name: "Avengers: Endgame", revenue: 125000, tickets: 8334 },
        { name: "Spider-Man: No Way Home", revenue: 98000, tickets: 6534 },
        { name: "The Batman", revenue: 87500, tickets: 5834 },
        { name: "Black Panther", revenue: 76000, tickets: 5067 },
        { name: "Doctor Strange", revenue: 65000, tickets: 4334 }
      ];
      
      setMovieRevenueData(mockData);
      setHasData(true);
      setIsLoading(false);
    }, 800);
  };

  const fetchDailyRevenue = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const today = new Date();
      const mockData: DailyRevenue[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        mockData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Math.floor(Math.random() * 15000) + 5000,
          tickets: Math.floor(Math.random() * 1000) + 300
        });
      }
      
      setDailyRevenueData(mockData);
      setHasData(true);
      setIsLoading(false);
    }, 800);
  };

  const fetchTopCustomers = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData: TopCustomer[] = [
        { id: "C1001", name: "John Smith", totalSpent: 1250, ticketsPurchased: 25, lastPurchase: "2025-04-15" },
        { id: "C1002", name: "Mary Johnson", totalSpent: 980, ticketsPurchased: 18, lastPurchase: "2025-04-12" },
        { id: "C1003", name: "Robert Brown", totalSpent: 875, ticketsPurchased: 16, lastPurchase: "2025-04-10" },
        { id: "C1004", name: "Patricia Davis", totalSpent: 760, ticketsPurchased: 14, lastPurchase: "2025-04-08" },
        { id: "C1005", name: "Michael Wilson", totalSpent: 650, ticketsPurchased: 12, lastPurchase: "2025-04-05" }
      ];
      
      setTopCustomers(mockData);
      setHasData(true);
      setIsLoading(false);
    }, 800);
  };

  const calculateTotalRevenue = () => {
    return revenueData.reduce((total, item) => total + item.revenue, 0);
  };

  const handleRunReport = (reportType: string) => {
    if (reportType === 'monthly') {
      fetchMonthlyRevenue();
    } else if (reportType === 'movies') {
      fetchMovieRevenue();
    } else if (reportType === 'daily') {
      fetchDailyRevenue();
    } else if (reportType === 'customers') {
      fetchTopCustomers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,958,320</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">330,552</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <Film className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">426</div>
            <p className="text-xs text-muted-foreground">
              +24 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
          <TabsTrigger value="movies">Movie Revenue</TabsTrigger>
          <TabsTrigger value="daily">Daily Revenue</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
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
                <div>
                  <Label htmlFor="cinema">Cinema</Label>
                  <Select value={cinema} onValueChange={setCinema}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select cinema" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleRunReport('monthly')} 
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? 'Loading...' : 'Run Report'}
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {hasData && revenueData.length > 0 && (
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
        </TabsContent>
        
        <TabsContent value="movies">
          <Card>
            <CardHeader>
              <CardTitle>Movie Revenue Report</CardTitle>
              <CardDescription>
                Compare revenue by movie title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map(range => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cinema">Cinema</Label>
                  <Select value={cinema} onValueChange={setCinema}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select cinema" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleRunReport('movies')} 
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? 'Loading...' : 'Run Report'}
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {hasData && movieRevenueData.length > 0 && (
                <div className="mt-8 space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Revenue Distribution by Movie</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={movieRevenueData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="revenue"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {movieRevenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Movie Revenue Details</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Movie Title</TableHead>
                            <TableHead className="text-right">Tickets Sold</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {movieRevenueData.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {item.tickets.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${item.revenue.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">
                              {movieRevenueData.reduce((total, item) => total + item.tickets, 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              ${movieRevenueData.reduce((total, item) => total + item.revenue, 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Report</CardTitle>
              <CardDescription>
                Track revenue trends on a daily basis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map(range => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cinema">Cinema</Label>
                  <Select value={cinema} onValueChange={setCinema}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select cinema" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleRunReport('daily')} 
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? 'Loading...' : 'Run Report'}
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {hasData && dailyRevenueData.length > 0 && (
                <div className="mt-8 space-y-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyRevenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          `$${value}`, 
                          name === 'revenue' ? 'Revenue' : 'Tickets'
                        ]} />
                        <Bar name="Revenue" dataKey="revenue" fill="#9b87f5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Tickets Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyRevenueData.map((item) => (
                          <TableRow key={item.date}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="text-right">
                              {item.tickets}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${item.revenue.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {dailyRevenueData.reduce((total, item) => total + item.tickets, 0)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ${dailyRevenueData.reduce((total, item) => total + item.revenue, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers Report</CardTitle>
              <CardDescription>
                View your most valuable customers by spend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map(range => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cinema">Cinema</Label>
                  <Select value={cinema} onValueChange={setCinema}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select cinema" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleRunReport('customers')} 
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? 'Loading...' : 'Run Report'}
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {hasData && topCustomers.length > 0 && (
                <div className="mt-8">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Tickets Purchased</TableHead>
                          <TableHead className="text-right">Total Spent</TableHead>
                          <TableHead className="hidden md:table-cell">Last Purchase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.id}</TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell className="text-right">{customer.ticketsPurchased}</TableCell>
                            <TableCell className="text-right font-medium">${customer.totalSpent}</TableCell>
                            <TableCell className="hidden md:table-cell">{customer.lastPurchase}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
