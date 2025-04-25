import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  PieChart,
  TrendingUp,
  ArrowUpDown,
  Database,
  Layers,
  Film,
  Ticket,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Cinema, fetchCinemas } from "@/lib/data_cinemas";
import { Movie, fetchMovies } from "@/lib/data_movies";
import { User, fetchUsers } from "@/lib/data_user";
import { Order, getAllOrders } from "@/lib/data_order";

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

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cinemasData = await fetchCinemas();
        setCinemas(cinemasData);

        const moviesData = await fetchMovies();
        setMovies(moviesData);

        const usersData = await fetchUsers();
        setUsers(usersData);

        const ordersData = await getAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  const dateRanges = [
    { id: "7days", name: "Last 7 Days" },
    { id: "30days", name: "Last 30 Days" },
    { id: "90days", name: "Last 90 Days" },
    { id: "year", name: "This Year" },
  ];

  // Filter orders based on selected cinema and date range
  const filterOrders = (ordersToFilter: Order[]) => {
    // First apply cinema filter if needed
    let filteredOrders = ordersToFilter;
    if (cinema !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.CinemaName &&
          cinemas.find((c) => c.id === cinema)?.name === order.CinemaName
      );
    }

    // Then apply date range filter
    const today = new Date();
    let startDate: Date;

    switch (dateRange) {
      case "7days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case "90days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1); // Jan 1 of current year
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }

    return filteredOrders.filter((order) => {
      const orderDate = new Date(order.OrderDate);
      return orderDate >= startDate && orderDate <= today;
    });
  };

  // Filter orders by year
  const filterOrdersByYear = (
    ordersToFilter: Order[],
    yearToFilter: string
  ) => {
    return ordersToFilter.filter((order) => {
      const orderDate = new Date(order.OrderDate);
      return orderDate.getFullYear().toString() === yearToFilter;
    });
  };

  const fetchMonthlyRevenue = () => {
    setIsLoading(true);

    try {
      const filteredOrders = filterOrdersByYear(orders, year);

      // Initialize monthly data with zero values
      const monthlyData: RevenueData[] = months.map((month, index) => ({
        month,
        revenue: 0,
      }));

      // Aggregate revenue by month
      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.OrderDate);
        const monthIndex = orderDate.getMonth();
        monthlyData[monthIndex].revenue += order.TotalPrice;
      });

      setRevenueData(monthlyData);
      setHasData(true);
    } catch (error) {
      console.error("Error processing monthly revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieRevenue = () => {
    setIsLoading(true);

    try {
      const filteredOrders = filterOrders(orders).filter(
        (order) => order.isTicket && order.MovieTitle
      );

      // Group orders by movie title and calculate revenue
      const movieRevenueMap = new Map<
        string,
        { revenue: number; tickets: number }
      >();

      filteredOrders.forEach((order) => {
        if (!order.MovieTitle) return;

        if (!movieRevenueMap.has(order.MovieTitle)) {
          movieRevenueMap.set(order.MovieTitle, { revenue: 0, tickets: 0 });
        }

        const movieData = movieRevenueMap.get(order.MovieTitle)!;
        movieData.revenue += order.TotalPrice;
        movieData.tickets += 1; // Assuming one ticket per order, adjust if needed
      });

      // Convert map to array and sort by revenue (descending)
      const movieRevenueArray: MovieRevenue[] = Array.from(
        movieRevenueMap.entries()
      )
        .map(([name, data]) => ({
          name,
          revenue: data.revenue,
          tickets: data.tickets,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5 movies

      setMovieRevenueData(movieRevenueArray);
      setHasData(true);
    } catch (error) {
      console.error("Error processing movie revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyRevenue = () => {
    setIsLoading(true);

    try {
      const filteredOrders = filterOrders(orders);

      // Generate date range (last 7 days by default)
      const today = new Date();
      const days =
        dateRange === "7days"
          ? 7
          : dateRange === "30days"
          ? 30
          : dateRange === "90days"
          ? 90
          : 7;

      const dailyData: DailyRevenue[] = [];

      // Create entries for each day in the range
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Format date as string (e.g., "Apr 15")
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Find orders for this day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.OrderDate);
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        // Calculate revenue and ticket count for the day
        const revenue = dailyOrders.reduce(
          (sum, order) => sum + order.TotalPrice,
          0
        );
        const tickets = dailyOrders.filter((order) => order.isTicket).length;

        dailyData.push({
          date: dateStr,
          revenue,
          tickets,
        });
      }

      setDailyRevenueData(dailyData);
      setHasData(true);
    } catch (error) {
      console.error("Error processing daily revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopCustomers = () => {
    setIsLoading(true);

    try {
      const filteredOrders = filterOrders(orders);

      // Group orders by customer
      const customerOrderMap = new Map<string, Order[]>();

      filteredOrders.forEach((order) => {
        if (!order.CustomerID) return;

        if (!customerOrderMap.has(order.CustomerID)) {
          customerOrderMap.set(order.CustomerID, []);
        }

        customerOrderMap.get(order.CustomerID)!.push(order);
      });

      // Calculate customer metrics
      const customerData: TopCustomer[] = [];

      customerOrderMap.forEach((customerOrders, customerId) => {
        const user = users.find((u) => u.id === customerId);
        if (!user) return;

        // Calculate total spent and tickets
        const totalSpent = customerOrders.reduce(
          (sum, order) => sum + order.TotalPrice,
          0
        );
        const ticketsPurchased = customerOrders.filter(
          (order) => order.isTicket
        ).length;

        // Find the most recent purchase
        const lastOrder = customerOrders.sort(
          (a, b) =>
            new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime()
        )[0];

        customerData.push({
          id: customerId,
          name: user.FullName,
          totalSpent,
          ticketsPurchased,
          lastPurchase: new Date(lastOrder.OrderDate)
            .toISOString()
            .split("T")[0], // Format as YYYY-MM-DD
        });
      });

      // Sort by total spent and take top 5
      const topCustomersData = customerData
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      setTopCustomers(topCustomersData);
      setHasData(true);
    } catch (error) {
      console.error("Error processing top customers data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return revenueData.reduce((total, item) => total + item.revenue, 0);
  };

  const calculateOverallStats = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.TotalPrice,
      0
    );
    const totalTickets = orders.filter((order) => order.isTicket).length;
    const totalMovies = movies.length;

    // Calculate year-over-year growth
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const currentYearOrders = orders.filter((order) => {
      const orderDate = new Date(order.OrderDate);
      return orderDate.getFullYear() === currentYear;
    });

    const lastYearOrders = orders.filter((order) => {
      const orderDate = new Date(order.OrderDate);
      return orderDate.getFullYear() === lastYear;
    });

    const currentYearRevenue = currentYearOrders.reduce(
      (sum, order) => sum + order.TotalPrice,
      0
    );
    const lastYearRevenue = lastYearOrders.reduce(
      (sum, order) => sum + order.TotalPrice,
      0
    );

    const revenueGrowth =
      lastYearRevenue > 0
        ? ((currentYearRevenue - lastYearRevenue) / lastYearRevenue) * 100
        : 0;

    const currentYearTickets = currentYearOrders.filter(
      (order) => order.isTicket
    ).length;
    const lastYearTickets = lastYearOrders.filter(
      (order) => order.isTicket
    ).length;

    const ticketGrowth =
      lastYearTickets > 0
        ? ((currentYearTickets - lastYearTickets) / lastYearTickets) * 100
        : 0;

    // Count new movies this month
    const today = new Date();
    const currentMonth = today.getMonth();
    const newMoviesThisMonth = movies.filter((movie) => {
      if (!movie.releaseDate) return false;
      const releaseDate = new Date(movie.releaseDate);
      return (
        releaseDate.getMonth() === currentMonth &&
        releaseDate.getFullYear() === currentYear
      );
    }).length;

    return {
      totalRevenue,
      totalTickets,
      totalMovies,
      revenueGrowth,
      ticketGrowth,
      newMoviesThisMonth,
    };
  };

  const handleRunReport = (reportType: string) => {
    if (reportType === "monthly") {
      fetchMonthlyRevenue();
    } else if (reportType === "movies") {
      fetchMovieRevenue();
    } else if (reportType === "daily") {
      fetchDailyRevenue();
    } else if (reportType === "customers") {
      fetchTopCustomers();
    }
  };

  const stats = calculateOverallStats();

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
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueGrowth >= 0 ? "+" : ""}
              {stats.revenueGrowth.toFixed(1)}% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Tickets
              </CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTickets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.ticketGrowth >= 0 ? "+" : ""}
              {stats.ticketGrowth.toFixed(1)}% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Movies
              </CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <Film className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newMoviesThisMonth} new this month
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
                      {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleRunReport("monthly")}
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? "Loading..." : "Run Report"}
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
              <CardDescription>Compare revenue by movie title</CardDescription>
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
                      {dateRanges.map((range) => (
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
                      {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleRunReport("movies")}
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? "Loading..." : "Run Report"}
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {hasData && movieRevenueData.length > 0 && (
                <div className="mt-8 space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Revenue Distribution by Movie
                    </h3>
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
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {movieRevenueData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Movie Revenue Details
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Movie Title</TableHead>
                            <TableHead className="text-right">
                              Tickets Sold
                            </TableHead>
                            <TableHead className="text-right">
                              Revenue
                            </TableHead>
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
                              {movieRevenueData
                                .reduce(
                                  (total, item) => total + item.tickets,
                                  0
                                )
                                .toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              $$
                              {movieRevenueData
                                .reduce(
                                  (total, item) => total + item.revenue,
                                  0
                                )
                                .toLocaleString()}
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
                      {dateRanges.map((range) => (
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
                      {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleRunReport("daily")}
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? "Loading..." : "Run Report"}
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
                        <Tooltip
                          formatter={(value, name) => [
                            `$${value}`,
                            name === "revenue" ? "Revenue" : "Tickets",
                          ]}
                        />
                        <Bar name="Revenue" dataKey="revenue" fill="#9b87f5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">
                            Tickets Sold
                          </TableHead>
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
                            {dailyRevenueData.reduce(
                              (total, item) => total + item.tickets,
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            $$
                            {dailyRevenueData
                              .reduce((total, item) => total + item.revenue, 0)
                              .toLocaleString()}
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
                      {dateRanges.map((range) => (
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
                      {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleRunReport("customers")}
                  disabled={isLoading}
                  className="sm:mb-1 flex items-center"
                >
                  {isLoading ? "Loading..." : "Run Report"}
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
                          <TableHead className="text-right">
                            Tickets Purchased
                          </TableHead>
                          <TableHead className="text-right">
                            Total Spent
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Last Purchase
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.id}
                            </TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell className="text-right">
                              {customer.ticketsPurchased}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${customer.totalSpent}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {customer.lastPurchase}
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
      </Tabs>
    </div>
  );
};

export default ReportsPage;
