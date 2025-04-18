
import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Map, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Mock cinema data
const initialCinemas = [
  { id: '1', name: 'Cinema City Downtown', address: '123 Main St, Downtown', screens: 8, totalSeats: 1200, status: 'Active' },
  { id: '2', name: 'Riverside Multiplex', address: '456 River Rd, Riverside', screens: 6, totalSeats: 900, status: 'Active' },
  { id: '3', name: 'West Mall Cinema', address: '789 West Mall, Westside', screens: 10, totalSeats: 1500, status: 'Active' },
  { id: '4', name: 'East End Pictures', address: '101 East Blvd, Eastside', screens: 4, totalSeats: 600, status: 'Maintenance' },
  { id: '5', name: 'North Star Cineplex', address: '202 North Ave, Northside', screens: 12, totalSeats: 1800, status: 'Active' },
];

interface Cinema {
  id: string;
  name: string;
  address: string;
  screens: number;
  totalSeats: number;
  status: string;
}

const CinemasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Cinema>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [cinemas, setCinemas] = useState<Cinema[]>(initialCinemas);
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>(initialCinemas);

  // Filter and sort cinemas
  React.useEffect(() => {
    let filtered = [...cinemas];
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(cinema => 
        cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    setFilteredCinemas(filtered);
  }, [searchTerm, sortField, sortDirection, cinemas]);

  const handleSort = (field: keyof Cinema) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteCinema = (cinemaId: string) => {
    if (confirm('Are you sure you want to delete this cinema?')) {
      setCinemas(cinemas.filter(cinema => cinema.id !== cinemaId));
      toast({
        title: "Cinema deleted",
        description: "The cinema has been successfully removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Building2 className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Cinema Management</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Cinemas</CardTitle>
          <CardDescription>Manage cinema locations and properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cinemas..."
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
              Add Cinema
            </Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('address')}>
                    <div className="flex items-center">
                      Address
                      {sortField === 'address' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('screens')}>
                    <div className="flex items-center">
                      Screens
                      {sortField === 'screens' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => handleSort('totalSeats')}>
                    <div className="flex items-center">
                      Total Seats
                      {sortField === 'totalSeats' && (
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCinemas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No cinemas found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCinemas.map((cinema) => (
                    <TableRow key={cinema.id}>
                      <TableCell className="font-medium">{cinema.id}</TableCell>
                      <TableCell>{cinema.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{cinema.address}</TableCell>
                      <TableCell className="hidden md:table-cell">{cinema.screens}</TableCell>
                      <TableCell className="hidden lg:table-cell">{cinema.totalSeats}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cinema.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cinema.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Map className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCinema(cinema.id)}>
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

export default CinemasPage;
