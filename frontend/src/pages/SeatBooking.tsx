
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MovieController } from '@/controllers/MovieController';
import { CinemaController } from '@/controllers/CinemaController';
import { BookingController } from '@/controllers/BookingController';
import { Seat } from '@/models/CinemaModel';
import { FoodOrderItem } from '@/models/BookingModel';
import { Movie } from '@/models/MovieModel';
import FoodAndDrinkSelector from '@/components/booking/FoodAndDrinkSelector';
import SeatMap from '@/components/booking/SeatMap';
import SeatLegend from '@/components/booking/SeatLegend';
import BookingSummary from '@/components/booking/BookingSummary';

const SeatBooking = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const cinemaId = searchParams.get('cinemaId') || 'CIN001'; // Default cinema
  const roomId = parseInt(searchParams.get('roomId') || '1'); // Default room
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [foodItems, setFoodItems] = useState<FoodOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!movieId) {
          setError("Movie ID is missing");
          return;
        }
        
        // Fetch movie details
        const movieData = await MovieController.getMovieById(movieId);
        setMovie(movieData);
        
        // Fetch seats
        if (time) {
          const formattedTime = `${date}T${time}`;
          const seatData = await CinemaController.getSeatsByRoomId(roomId, cinemaId, formattedTime);
          setSeats(seatData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load booking data:", err);
        setError("Failed to load booking information. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, time, date, cinemaId, roomId]);
  
  const toggleSeatSelection = (seat: Seat) => {
    if (seat.Status === 'occupied') return;
    
    setSelectedSeats(prev => {
      const seatId = `${seat.CinemaID}-${seat.RoomNumber}-${seat.SeatNumber}`;
      const isSelected = prev.some(s => `${s.CinemaID}-${s.RoomNumber}-${s.SeatNumber}` === seatId);
      
      if (isSelected) {
        return prev.filter(s => `${s.CinemaID}-${s.RoomNumber}-${s.SeatNumber}` !== seatId);
      } else {
        return [...prev, seat];
      }
    });
  };
  
  const getTotalPrice = () => {
    return BookingController.calculateTotalPrice(selectedSeats, foodItems);
  };
  
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real app, we would get this from authentication
      const customerId = localStorage.getItem('customerId') || undefined;
      
      const bookingData = {
        Date: date,
        Time: time,
        PaymentMethod: 'Card', // This would typically come from a payment form
        CustomerID: customerId,
        Seats: BookingController.prepareSeatBookings(
          selectedSeats, 
          roomId, 
          movieId || '', 
          `${date}T${time}`
        ),
        FoodItems: foodItems.length > 0 ? foodItems : undefined
      };
      
      const response = await BookingController.createBooking(bookingData);
      
      toast({
        title: "Booking successful!",
        description: `You booked ${selectedSeats.length} seat(s) for ${movie?.Title}.`,
      });
      
      // Redirect to homepage after short delay
      setTimeout(() => {
        navigate(`/booking-confirmation/${response.OrderID}`);
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      toast({
        title: "Booking failed",
        description: "There was a problem with your booking. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }
  
  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Error</h1>
        <p className="mt-4">{error || "Movie not found"}</p>
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
              <h2 className="text-xl font-medium mb-1">{movie.Title}</h2>
              <p className="text-gray-400">{date} - {time}</p>
            </div>
            
            <div className="w-full h-2 bg-primary/20 mb-12"></div>
            
            <p className="text-center text-sm mb-10">SCREEN</p>
            
            <SeatMap 
              seats={seats} 
              selectedSeats={selectedSeats} 
              onSeatClick={toggleSeatSelection} 
            />
            
            <SeatLegend />
          </div>
          
          <div className="p-6 bg-black/20 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Food & Drinks</h3>
            <FoodAndDrinkSelector onFoodItemsChange={setFoodItems} />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <BookingSummary
            movie={movie}
            date={date}
            time={time}
            selectedSeats={selectedSeats}
            foodItems={foodItems}
            totalPrice={getTotalPrice()}
            onConfirm={handleBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
