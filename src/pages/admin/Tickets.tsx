
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Filter, Download, Calendar, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from '@/hooks/use-toast';

// Define types for Ticket
type TicketStatus = "Booked" | "Completed" | "Cancelled";

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  customerName: string;
  seats: string;
  showtime: string;
  cinemaName: string;
  status: TicketStatus;
  amount: number;
}

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [cinemaFilter, setCinemaFilter] = useState('All');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Sample data for tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "T1001",
      movieId: "M101",
      movieTitle: "Avengers: Endgame",
      customerName: "John Doe",
      seats: "A1, A2",
      showtime: "2025-05-01 15:30",
      cinemaName: "Cinema City Downtown",
      status: "Booked",
      amount: 20.00
    },
    {
      id: "T1002",
      movieId: "M102",
      movieTitle: "Spider-Man: No Way Home",
      customerName: "Jane Smith",
      seats: "B3, B4, B5",
      showtime: "2025-05-02 18:00",
      cinemaName: "Riverside Multiplex",
      status: "Completed",
      amount: 30.00
    },
    {
      id: "T1003",
      movieId: "M103",
      movieTitle: "The Batman",
      customerName: "Mike Johnson",
      seats: "C7, C8",
      showtime: "2025-05-03 20:15",
      cinemaName: "West Mall Cinema",
      status: "Cancelled",
      amount: 20.00
    },
    {
      id: "T1004",
      movieId: "M104",
      movieTitle: "Black Panther",
      customerName: "Sarah Williams",
      seats: "D3, D4",
      showtime: "2025-05-04 16:45",
      cinemaName: "Cinema City Downtown",
      status: "Completed",
      amount: 20.00
    },
    {
      id: "T1005",
      movieId: "M101",
      movieTitle: "Avengers: Endgame",
      customerName: "Robert Brown",
      seats: "E5, E6, E7",
      showtime: "2025-05-05 19:00",
      cinemaName: "East End Pictures",
      status: "Booked",
      amount: 30.00
    }
  ]);

  // Sample cinemas
  const cinemas = [
    { id: "All", name: "All Cinemas" },
    { id: "C101", name: "Cinema City Downtown" },
    { id: "C102", name: "Riverside Multiplex" },
    { id: "C103", name: "West Mall Cinema" },
    { id: "C104", name: "East End Pictures" },
    { id: "C105", name: "North Star Cineplex" }
  ];

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    const matchesCinema = cinemaFilter === 'All' || ticket.cinemaName === cinemas.find(cinema => cinema.id === cinemaFilter)?.name;
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const ticketDate = new Date(ticket.showtime.split(' ')[0]);
      matchesDateRange = ticketDate >= dateRange.from && ticketDate <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesCinema && matchesDateRange;
  });

  // Calculate totals
  const calculateTotals = () => {
    const totalAmount = filteredTickets.reduce((sum, ticket) => sum + ticket.amount, 0);
    const totalTickets = filteredTickets.length;
    const completedTickets = filteredTickets.filter(ticket => ticket.status === "Completed").length;
    const bookedTickets = filteredTickets.filter(ticket => ticket.status === "Booked").length;
    const cancelledTickets = filteredTickets.filter(ticket => ticket.status === "Cancelled").length;
    
    return {
      totalAmount,
      totalTickets,
      completedTickets,
      bookedTickets,
      cancelledTickets
    };
  };

  const totals = calculateTotals();

  // Handle when delete ticket
  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    toast({
      title: "Ticket deleted",
      description: `Ticket #${ticketId} has been successfully deleted.`,
    });
  };

  // Handle status change
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    toast({
      title: "Status updated",
      description: `Ticket status has been updated to ${newStatus}.`,
    });
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create CSV content
      const headers = ["ID", "Movie", "Customer", "Seats", "Showtime", "Cinema", "Status", "Amount"];
      const csvContent = 
        headers.join(',') + '\n' + 
        filteredTickets.map(ticket => 
          [
            ticket.id,
            `"${ticket.movieTitle}"`,
            `"${ticket.customerName}"`,
            `"${ticket.seats}"`,
            ticket.showtime,
            `"${ticket.cinemaName}"`,
            ticket.status,
            ticket.amount
          ].join(',')
        ).join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `tickets_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast({
        title: "Export complete",
        description: "Tickets have been exported to CSV successfully.",
      });
    }, 1000);
  };

  // Display different colors for statuses
  const getStatusBadge = (status: TicketStatus) => {
    switch(status) {
      case "Booked":
        return <Badge className="bg-blue-500">Booked</Badge>;
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Manage and search through all ticket transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as TicketStatus | 'All')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cinema">Cinema</Label>
              <Select 
                value={cinemaFilter}
                onValueChange={(value) => setCinemaFilter(value)}
              >
                <SelectTrigger id="cinema">
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
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Tickets</div>
                <div className="text-2xl font-bold">{totals.totalTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Booked</div>
                <div className="text-2xl font-bold text-blue-500">{totals.bookedTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-500">{totals.completedTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</div>
                <div className="text-2xl font-bold">${totals.totalAmount.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Cinema</TableHead>
                  <TableHead className="hidden lg:table-cell">Seats</TableHead>
                  <TableHead className="hidden md:table-cell">Showtime</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.movieTitle}</TableCell>
                      <TableCell>{ticket.customerName}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.cinemaName}</TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.seats}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.showtime}</TableCell>
                      <TableCell>
                        <Select 
                          value={ticket.status}
                          onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue placeholder={ticket.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>${ticket.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <p className="text-muted-foreground">No tickets found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;
