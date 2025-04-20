
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface BookingDetails {
  OrderID: string;
  Date: string;
  Time: string;
  TotalPrice: number;
  Status: string;
  MovieTitle: string;
  Seats: string[];
}

const BookingConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch the booking details from the API
    // For now, we'll use mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBooking({
        OrderID: orderId || 'unknown',
        Date: new Date().toLocaleDateString(),
        Time: new Date().toLocaleTimeString(),
        TotalPrice: 42.97,
        Status: 'Confirmed',
        MovieTitle: 'Inside Out 2',
        Seats: ['A1', 'A2', 'A3']
      });
      setLoading(false);
    }, 500);
  }, [orderId]);
  
  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Booking Not Found</h1>
        <p className="mt-4">We couldn't find your booking details.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="bg-black/20 rounded-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-6">Your booking has been successfully completed.</p>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-4">Booking Details</h2>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm text-left">
            <div className="text-gray-400">Confirmation #:</div>
            <div>{booking.OrderID}</div>
            
            <div className="text-gray-400">Movie:</div>
            <div>{booking.MovieTitle}</div>
            
            <div className="text-gray-400">Date:</div>
            <div>{booking.Date}</div>
            
            <div className="text-gray-400">Time:</div>
            <div>{booking.Time}</div>
            
            <div className="text-gray-400">Seats:</div>
            <div>{booking.Seats.join(', ')}</div>
            
            <div className="text-gray-400">Amount Paid:</div>
            <div>${booking.TotalPrice.toFixed(2)}</div>
            
            <div className="text-gray-400">Status:</div>
            <div className="text-green-500">{booking.Status}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            A confirmation has been sent to your email.
            Please arrive at least 15 minutes before showtime.
          </p>
          
          <Link to="/">
            <Button variant="default" className="mt-2">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
