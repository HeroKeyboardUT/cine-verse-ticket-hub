
import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, ArrowUpDown, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Mock showtimes data
const initialShowtimes = [
  { id: '1', movieId: '1', movieTitle: 'Inception', date: '2023-05-15', time: '18:30', hall: 'Hall A', availableSeats: 100, price: 15 },
  { id: '2', movieId: '2', movieTitle: 'The Matrix', date: '2023-05-16', time: '20:00', hall: 'Hall B', availableSeats: 80, price: 15 },
  { id: '3', movieId: '3', movieTitle: 'Interstellar', date: '2023-05-17', time: '19:00', hall: 'Hall C', availableSeats: 120, price: 15 },
  { id: '4', movieId: '1', movieTitle: 'Inception', date: '2023-05-18', time: '21:30', hall: 'Hall A', availableSeats: 100, price: 15 },
  { id: '5', movieId: '4', movieTitle: 'Dune', date: '2023-05-19', time: '17:00', hall: 'Hall D', availableSeats: 90, price: 15 },
];

interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  date: string;
  time: string;
  hall: string;
  availableSeats: number;
  price: number;
}

const ShowtimesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Showtime>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showtimes, setShowtimes] = useState<Showtime[]>(initialShowtimes);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>(initialShowtimes);

  useEffect(() => {
    filterAndSortShowtimes();
  }, [searchTerm, sortField, sortDirection, showtimes]);

  const filterAndSortShowtimes = () => {
    let filtered = [...showtimes];
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(showtime => 
        showtime.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.hall.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.date.includes(searchTerm) ||
        showtime.time.includes(searchTerm)
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
    
    setFilteredShowtimes(filtered);
  };

  const handleSort = (field: keyof Showtime) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteShowtime = (showtimeId: string) => {
    if (confirm('Are you sure you want to delete this showtime?')) {
      setShowtimes(showtimes.filter(showtime => showtime.id !== showtimeId));
      toast({
        title: "Showtime deleted",
        description: "The showtime has been successfully removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Calendar className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Showtime Management</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Showtimes</CardTitle>
          <CardDescription>Manage movie showtimes and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showtimes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Showtime
            </Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('movieTitle')}>
                    <div className="flex items-center">
                      Movie
                      {sortField === 'movieTitle' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Date
                      {sortField === 'date' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('time')}>
                    <div className="flex items-center">
                      Time
                      {sortField === 'time' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('hall')}>
                    <div className="flex items-center">
                      Hall
                      {sortField === 'hall' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => handleSort('availableSeats')}>
                    <div className="flex items-center">
                      Available Seats
                      {sortField === 'availableSeats' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('price')}>
                    <div className="flex items-center justify-end">
                      Price
                      {sortField === 'price' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShowtimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No showtimes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShowtimes.map((showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell className="font-medium">{showtime.id}</TableCell>
                      <TableCell>{showtime.movieTitle}</TableCell>
                      <TableCell>{showtime.date}</TableCell>
                      <TableCell>{showtime.time}</TableCell>
                      <TableCell className="hidden md:table-cell">{showtime.hall}</TableCell>
                      <TableCell className="hidden lg:table-cell">{showtime.availableSeats}</TableCell>
                      <TableCell className="text-right">${showtime.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteShowtime(showtime.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

export default ShowtimesPage;
