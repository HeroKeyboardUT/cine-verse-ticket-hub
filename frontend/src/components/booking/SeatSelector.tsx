import type React from "react";
import { useState } from "react";
import type { Seat } from "@/lib/data_seat";
import type { Movie } from "@/lib/data_movies";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign } from "lucide-react";

interface SeatSelectorProps {
  movie: Movie;
  seats: Seat[];
  selectedSeats: string[];
  onSeatToggle: (seatNumber: string, status: "available" | "occupied") => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  movie,
  seats,
  selectedSeats,
  onSeatToggle,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Group seats by row for better organization
  const seatRows = seats.reduce((acc, seat) => {
    // Extract row letter from seat number (e.g., "A1" -> "A")
    const row = seat.SeatNumber.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="p-8 bg-gradient-to-b from-black/40 to-black/20 rounded-xl mb-8 border border-gray-800/50 ">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-medium mb-2">{movie.title}</h2>
        <p className="text-gray-400">{movie.releaseDate}</p>
      </div>

      {/* Screen representation */}
      <div className="relative mb-16">
        <div className="w-full h-2 bg-primary/30 mb-3 rounded-full overflow-hidden">
          <div className="w-full h-full bg-primary/60 animate-pulse"></div>
        </div>
        <div className="w-[90%] h-1 bg-primary/20 mx-auto mb-2 rounded-full"></div>
        <div className="w-[80%] h-0.5 bg-primary/10 mx-auto mb-10 rounded-full"></div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary/10 px-6 py-1.5 rounded-full text-sm font-medium text-primary/80 backdrop-blur-sm border border-primary/20">
          SCREEN
        </div>
      </div>

      <TooltipProvider>
        {/* Seat grid organized by rows */}
        <div className="space-y-3 mb-10 max-w-4xl mx-auto ">
          {Object.entries(seatRows).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 mr-2">
                {row}
              </div>
              <div className="flex-1 grid grid-cols-12 gap-2">
                {rowSeats.map((seat) => (
                  <Tooltip key={seat.SeatNumber}>
                    <TooltipTrigger asChild>
                      <button
                        className={`
                          relative flex flex-col items-center justify-center py-1 rounded-md
                          transition-all duration-200 transform
                          ${
                            seat.status === "occupied"
                              ? "bg-gray-700/70 text-gray-500 cursor-not-allowed border border-gray-600/50"
                              : selectedSeats.includes(seat.SeatNumber)
                              ? "bg-primary text-white border-2 border-white scale-105 ring-2 ring-primary/50"
                              : hoveredSeat === seat.SeatNumber
                              ? seat.SeatType === "vip"
                                ? "bg-purple-800/60 border border-purple-500/70"
                                : "bg-gray-700/80 border border-gray-500/70"
                              : seat.SeatType === "vip"
                              ? "bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50"
                              : "bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700/50"
                          }
                        `}
                        onClick={() =>
                          onSeatToggle(seat.SeatNumber, seat.status)
                        }
                        disabled={seat.status === "occupied"}
                        onMouseEnter={() => setHoveredSeat(seat.SeatNumber)}
                        onMouseLeave={() => setHoveredSeat(null)}
                      >
                        <span className="font-medium text-xs">
                          {seat.SeatNumber}
                        </span>
                        <span
                          className={`text-[8px] mt-0.5 ${
                            seat.SeatType === "vip"
                              ? "text-purple-300"
                              : "text-gray-400"
                          }`}
                        >
                          {seat.SeatType === "vip" ? "VIP" : "STD"}
                        </span>
                        {selectedSeats.includes(seat.SeatNumber) && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-black/90 border-gray-700 p-3"
                    >
                      <div className="space-y-1.5">
                        <div className="font-medium text-white">
                          {seat.SeatNumber}
                        </div>
                        <div className="flex items-center text-xs text-gray-300">
                          <span className="capitalize">
                            {seat.SeatType} Seat
                          </span>
                          <span className="mx-1.5">•</span>
                          <span>
                            {seat.status === "occupied"
                              ? "Unavailable"
                              : "Available"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs font-medium text-primary">
                          <DollarSign className="h-3 w-3 mr-0.5" />
                          <span>{seat.Price.toLocaleString()} VND</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Seat legend */}
      <div className="flex justify-center flex-wrap gap-x-8 gap-y-3 text-sm p-4 bg-black/30 rounded-lg border border-gray-800/50">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-800/60 rounded-md mr-2 border border-gray-700/50"></div>
          <span>Standard</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-purple-900/40 rounded-md mr-2 border border-purple-700/50"></div>
          <span>VIP</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-700/70 rounded-md mr-2 border border-gray-600/50"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary rounded-md mr-2 border-2 border-white ring-2 ring-primary/50"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-black/30 rounded-lg border border-gray-800/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Selected Seats</h3>
            <Badge
              variant="outline"
              className="bg-primary/20 border-primary/30"
            >
              {selectedSeats.length} seats
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seatNumber) => {
              const seat = seats.find((s) => s.SeatNumber === seatNumber);
              return (
                <Badge
                  key={seatNumber}
                  variant="outline"
                  className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                >
                  {seatNumber} • {seat?.Price.toLocaleString()} VND
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
