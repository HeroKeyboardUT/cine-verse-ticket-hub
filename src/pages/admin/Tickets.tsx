
import React, { useState, useEffect } from 'react';
import { Ticket, Search, Filter, ArrowUpDown, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock tickets data
const initialTickets = [
  { id: 'T1001', movieId: '1', movieTitle: 'Inception', customerName: 'John Doe', seats: 'A1, A2', showtime: '2023-05-15 18:30', status: 'Booked', amount: 30 },
  { id: 'T1002', movieId: '2', movieTitle: 'The Matrix', customerName: 'Jane Smith', seats: 'B3, B4', showtime: '2023-05-16 20:00', status: 'Completed', amount: 30 },
  { id: 'T1003', movieId: '3', movieTitle: 'Interstellar', customerName: 'Robert Johnson', seats: 'C5', showtime: '2023-05-17 19:00', status: 'Cancelled', amount: 15 },
  { id: 'T1004', movieId: '1', movieTitle: 'Inception', customerName: 'Emily Davis', seats: 'D7, D8, D9', showtime: '2023-05-18 21:30', status: 'Booked', amount: 45 },
  { id: 'T1005', movieId: '4', movieTitle: 'Dune', customerName: 'Michael Brown', seats: 'E2', showtime: '2023-05-19 17:00', status: 'Completed', amount: 15 },
];

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  customerName: string;
  seats: string;
  showtime: string;
  status: 'Booked' | 'Completed' | 'Cancelled';
  amount: number;
}

const TicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Ticket>('showtime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(initialTickets);

  useEffect(() => {
    filterAndSortTickets();
  }, [searchTerm, sortField, sortDirection]);

  const filterAndSortTickets = () => {
    let filtered = [...initialTickets];
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.seats.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredTickets(filtered);
  };

  const handleSort = (field: keyof Ticket) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'Booked':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Booked</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Ticket className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Ticket Management</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Manage movie tickets and reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ticket ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('movieTitle')}>
                    <div className="flex items-center">
                      Movie
                      {sortField === 'movieTitle' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center">
                      Customer
                      {sortField === 'customerName' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Seats</TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('showtime')}>
                    <div className="flex items-center">
                      Showtime
                      {sortField === 'showtime' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('amount')}>
                    <div className="flex items-center justify-end">
                      Amount
                      {sortField === 'amount' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.movieTitle}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.customerName}</TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.seats}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.showtime}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell className="text-right">${ticket.amount}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsPage;
