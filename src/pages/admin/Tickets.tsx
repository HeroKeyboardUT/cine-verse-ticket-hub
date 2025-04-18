
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

// Định nghĩa kiểu cho Ticket
type TicketStatus = "Booked" | "Completed" | "Cancelled";

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  customerName: string;
  seats: string;
  showtime: string;
  status: TicketStatus;
  amount: number;
}

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');

  // Dữ liệu mẫu cho tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "T1001",
      movieId: "M101",
      movieTitle: "Avengers: Endgame",
      customerName: "John Doe",
      seats: "A1, A2",
      showtime: "2025-05-01 15:30",
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
      status: "Cancelled",
      amount: 20.00
    }
  ]);

  // Lọc tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Xử lý khi xóa ticket
  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  // Hiển thị màu sắc khác nhau cho các trạng thái
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select 
            className="bg-background border border-input rounded-md px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket ID</p>
                    <p className="font-medium">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Movie</p>
                    <p className="font-medium">{ticket.movieTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="font-medium">{ticket.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Seats</p>
                    <p className="font-medium">{ticket.seats}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Showtime</p>
                    <p className="font-medium">{ticket.showtime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="font-medium">${ticket.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteTicket(ticket.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
