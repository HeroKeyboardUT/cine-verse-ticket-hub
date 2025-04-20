
import React from 'react';
import { Seat } from '@/models/CinemaModel';

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onSeatClick }) => {
  // Helper function to check if a seat is selected
  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some(s => 
      s.CinemaID === seat.CinemaID && 
      s.RoomNumber === seat.RoomNumber && 
      s.SeatNumber === seat.SeatNumber
    );
  };

  // Determine class name based on seat status and type
  const getSeatClassName = (seat: Seat) => {
    const baseClass = "aspect-square flex items-center justify-center text-xs rounded";
    
    if (seat.Status === 'occupied') {
      return `${baseClass} bg-gray-700 text-gray-500 cursor-not-allowed`;
    }
    
    if (isSeatSelected(seat)) {
      return `${baseClass} bg-primary text-white`;
    }
    
    switch(seat.SeatType.toLowerCase()) {
      case 'vip':
        return `${baseClass} bg-purple-900/30 seat`;
      case 'premium':
        return `${baseClass} bg-purple-800/20 seat`;
      default:
        return `${baseClass} bg-gray-800/50 seat`;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 mb-8">
      {seats.map((seat) => (
        <button
          key={`${seat.CinemaID}-${seat.RoomNumber}-${seat.SeatNumber}`}
          className={getSeatClassName(seat)}
          onClick={() => onSeatClick(seat)}
          disabled={seat.Status === 'occupied'}
        >
          {String.fromCharCode(65 + Math.floor((seat.SeatNumber - 1) / 12))}{(seat.SeatNumber - 1) % 12 + 1}
        </button>
      ))}
    </div>
  );
};

export default SeatMap;
