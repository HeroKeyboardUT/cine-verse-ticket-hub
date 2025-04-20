
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { movies, generateSeats, Seat } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const SeatBooking = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  
  const movie = movies.find(m => m.id === movieId);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  useEffect(() => {
    if (time) {
      setSeats(generateSeats(time));
    }
  }, [time]);
  
  const toggleSeatSelection = (seatId: string, status: 'available' | 'occupied' | 'selected') => {
    if (status === 'occupied') return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };
  
  const getSeatPrice = (type: 'standard' | 'premium' | 'vip') => {
    switch (type) {
      case 'vip': return 18.99;
      case 'premium': return 15.99;
      case 'standard': return 12.99;
      default: return 12.99;
    }
  };
  
  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat ? getSeatPrice(seat.type) : 0);
    }, 0);
  };
  
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Booking successful!",
      description: `You booked ${selectedSeats.length} seat(s) for ${movie?.title}.`,
    });
    
    // Redirect to homepage after short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Tickets</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          <div className="p-6 bg-black/20 rounded-lg mb-8">
            <div className="text-center mb-10">
              <h2 className="text-xl font-medium mb-1">{movie.title}</h2>
              <p className="text-gray-400">{date} - {time}</p>
            </div>
            
            <div className="w-full h-2 bg-primary/20 mb-12"></div>
            
            <p className="text-center text-sm mb-10">SCREEN</p>
            
            <div className="grid grid-cols-12 gap-2 mb-8">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  className={`aspect-square flex items-center justify-center text-xs rounded ${
                    seat.status === 'occupied' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 
                    selectedSeats.includes(seat.id) ? 'bg-primary text-white' : 
                    seat.type === 'vip' ? 'bg-purple-900/30 seat' : 
                    seat.type === 'premium' ? 'bg-purple-800/20 seat' : 
                    'bg-gray-800/50 seat'
                  }`}
                  onClick={() => toggleSeatSelection(seat.id, seat.status)}
                  disabled={seat.status === 'occupied'}
                >
                  {seat.row}{seat.number}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-800/50 rounded mr-2"></div>
                <span>Standard ($12.99)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-800/20 rounded mr-2"></div>
                <span>Premium ($15.99)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-900/30 rounded mr-2"></div>
                <span>VIP ($18.99)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded mr-2"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4">Booking Summary</h3>
            
            <div className="mb-6">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-48 object-cover rounded-lg mb-4" 
              />
              <h4 className="font-medium">{movie.title}</h4>
              <p className="text-gray-400 text-sm">{date} - {time}</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Selected Seats</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Total Price</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
