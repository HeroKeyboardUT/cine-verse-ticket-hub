
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Seat } from '@/models/CinemaModel';
import { FoodOrderItem } from '@/models/BookingModel';
import { Movie } from '@/models/MovieModel';

interface BookingSummaryProps {
  movie: Movie;
  date: string;
  time: string;
  selectedSeats: Seat[];
  foodItems: FoodOrderItem[];
  totalPrice: number;
  onConfirm: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  date,
  time,
  selectedSeats,
  foodItems,
  totalPrice,
  onConfirm
}) => {
  // Format seats for display (e.g., "A1, A2, B3")
  const formatSeats = () => {
    if (selectedSeats.length === 0) return 'None';
    
    return selectedSeats
      .map(seat => {
        const row = String.fromCharCode(65 + Math.floor((seat.SeatNumber - 1) / 12));
        const num = (seat.SeatNumber - 1) % 12 + 1;
        return `${row}${num}`;
      })
      .join(', ');
  };

  return (
    <div className="bg-black/20 rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4">Booking Summary</h3>
      
      <div className="mb-6">
        <img 
          src={movie.PosterURL} 
          alt={movie.Title} 
          className="w-full h-48 object-cover rounded-lg mb-4" 
        />
        <h4 className="font-medium">{movie.Title}</h4>
        <p className="text-gray-400 text-sm">{date} - {time}</p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Selected Seats</span>
          <span>{formatSeats()}</span>
        </div>
        
        {foodItems.length > 0 && (
          <div className="mb-2">
            <div className="mb-1">Food & Drinks:</div>
            {foodItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm pl-2">
                <span>{item.Quantity}x {item.ItemID}</span>
                <span>${(item.Price * item.Quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between font-medium mt-4">
          <span>Total Price</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="w-full"
        onClick={onConfirm}
        disabled={selectedSeats.length === 0}
      >
        Confirm Booking
      </Button>
    </div>
  );
};

export default BookingSummary;
