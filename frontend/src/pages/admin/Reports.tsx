import React, { useState, useEffect } from 'react';
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
import { format, parseISO } from "date-fns";
import {
  StatisticsData,
  MonthlyRevenueItem,
  DailyRevenueItem,
  MovieRevenueItem,
  TopCustomersItem,
  getStatistics,
  getMonthlyRevenue,
  getDailyRevenue,
  getMovieRevenue,
  getTopCustomers
} from "@/lib/data_report"
import { set } from 'date-fns';


const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState<StatisticsData>();
  const [MonthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenueItem[]>([]);
  const [movieRevenueData, setMovieRevenueData] = useState<MovieRevenueItem[]>([]);
  const [dailyRevenueData, setDailyRevenueData] = useState<DailyRevenueItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomersItem[]>([]);
  const [hasData, setHasData] = useState(false);
  const [customerLimit, setCustomerLimit] = useState(5);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statisticData, monthlyData, movieData, dailyData, customerData] = await Promise.all([
          getStatistics(),
          getMonthlyRevenue(),
          getMovieRevenue(),
          getDailyRevenue(),
          getTopCustomers(customerLimit)
        ]);
        setRevenueData(statisticData);
        setMonthlyRevenueData(monthlyData);
        setMovieRevenueData(movieData);
        setDailyRevenueData(dailyData);
        setTopCustomers(customerData);
        
        setHasData(statisticData != null ||monthlyData.length > 0 || movieData.length > 0 || dailyData.length > 0 || customerData.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleCustomerLimitChange = (value: string) => {
      const limit = parseInt(value, 10);
      if (!isNaN(limit)) {
        setCustomerLimit(limit);
      }
    };

    const fetchTopCustomers = async () => {
      try {
        const customerData = await getTopCustomers(customerLimit);
        setTopCustomers(customerData);
      } catch (error) {
        console.error("Error fetching top customers:", error);
      }
    };

    fetchTopCustomers();
  }
  , [customerLimit]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <div className="text-2xl font-bold">{revenueData? revenueData.TotalRevenue : 0} VND</div>
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
            <div className="text-2xl font-bold">{revenueData? revenueData.TotalTickets : 0}</div>
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
            <div className="text-2xl font-bold">{revenueData? revenueData.TotalMovies : 0}</div>
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
              {hasData && MonthlyRevenueData.length > 0 && (
                <div className="mt-8 space-y-8">
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MonthlyRevenueData.map((item) => (
                          <TableRow key={item.Month}>
                            <TableCell>{item.Month}</TableCell>
                            <TableCell className="text-right font-medium">
                              {item.Revenue.toLocaleString()} VND
                            </TableCell>
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
        
        <TabsContent value="movies">
          <Card>
            <CardHeader>
              <CardTitle>Movie Revenue Report</CardTitle>
              <CardDescription>
                Compare revenue by movie title
              </CardDescription>
            </CardHeader>
            <CardContent>

              {hasData && movieRevenueData.length > 0 && (
                <div className="mt-8 space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* <div>
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
                            dataKey="Revenue"
                            nameKey="MovieTitle"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {movieRevenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} VND`} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div> */}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Movie Revenue Details</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Movie Title</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {movieRevenueData.map((item) => (
                            <TableRow key={item.MovieTitle}>
                              <TableCell>{item.MovieTitle}</TableCell>
                              <TableCell className="text-right font-medium">
                                {item.Revenue.toLocaleString()} VND
                              </TableCell>
                            </TableRow>
                          ))}
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

              {hasData && dailyRevenueData.length > 0 && (
                <div className="mt-8 space-y-8">
                
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyRevenueData.map((item) => (
                          <TableRow key={format(parseISO(item.Date), "PP")}>
                            <TableCell>{format(parseISO(item.Date), "PP")}</TableCell>
                            <TableCell className="text-right font-medium">
                              {item.Revenue.toLocaleString()} VND
                            </TableCell>
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
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers Report</CardTitle>
              <CardDescription>
                View your most valuable customers by spend
              </CardDescription>
            </CardHeader>
            <CardContent>

              {hasData && topCustomers.length > 0 && (
                <div className="mt-8">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Total Orders</TableHead>
                          <TableHead className="text-right">Total Spent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCustomers.map((customer) => (
                          <TableRow key={customer.CustomerID}>
                            <TableCell className="font-medium">{customer.CustomerID}</TableCell>
                            <TableCell>{customer.CustomerName}</TableCell>
                            <TableCell className="text-right">{customer.TotalOrders}</TableCell>
                            <TableCell className="text-right font-medium">{customer.TotalSpent} VND</TableCell>
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
