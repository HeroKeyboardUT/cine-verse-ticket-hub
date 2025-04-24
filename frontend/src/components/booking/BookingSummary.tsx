import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie } from "@/lib/data_movies";
import { Seat } from "@/lib/data_seat";
import { FoodItem } from "@/lib/data_food";
import { Voucher } from "@/lib/data_voucher";
import { Showtime } from "@/lib/data_showtimes";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Film, User } from "lucide-react";

interface BookingSummaryProps {
  movie: Movie;
  selectedSeats: string[];
  seats: Seat[];
  selectedFood: { [key: string]: number };
  popcornItems: FoodItem[];
  drinkItems: FoodItem[];
  voucher: Voucher | null;
  onCheckout: () => void;
  showtime?: Showtime | null;
  totalPrice?: number;
  user?: any;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  selectedSeats,
  seats,
  selectedFood,
  popcornItems,
  drinkItems,
  voucher,
  onCheckout,
  showtime,
  totalPrice: externalTotalPrice,
  user,
}) => {
  const calculateSeatTotal = (): number => {
    return selectedSeats.reduce((total, seatNumber) => {
      const seat = seats.find((s) => s.SeatNumber === seatNumber);
      return total + (seat ? seat.Price : 0);
    }, 0);
  };

  const calculateFoodTotal = (): number => {
    return Object.entries(selectedFood).reduce((total, [itemId, quantity]) => {
      // Look in both popcorn and drink arrays
      const food =
        popcornItems.find((f) => f.id === itemId) ||
        drinkItems.find((f) => f.id === itemId);

      return total + (food ? food.price * quantity : 0);
    }, 0);
  };

  const calculateVoucherDiscount = (subtotal: number): number => {
    if (!voucher) return 0;

    if (voucher.discountType === "Fixed") {
      return voucher.discountAmount;
    } else {
      // Percentage discount
      return (subtotal * voucher.discountAmount) / 100;
    }
  };

  const getTotalPrice = (): number => {
    if (externalTotalPrice !== undefined) {
      return externalTotalPrice;
    }

    const subtotal = calculateSeatTotal() + calculateFoodTotal();
    const voucherDiscount = calculateVoucherDiscount(subtotal);
    return Math.max(0, subtotal - voucherDiscount);
  };

  const seatTotal = calculateSeatTotal();
  const foodTotal = calculateFoodTotal();
  const subtotal = seatTotal + foodTotal;
  const discount = calculateVoucherDiscount(subtotal);
  const total = getTotalPrice();

  return (
    <div className="bg-black/20 rounded-lg p-6 sticky top-4">
      <h3 className="text-xl font-medium mb-4">Booking Summary</h3>

      {/* Customer Information */}
      {user && (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-primary">Customer Details</h4>
          </div>
          <div className="text-sm space-y-1 text-gray-300">
            <p>{user.FullName}</p>
            <p className="text-gray-400">{user.Email}</p>
            {user.PhoneNumber && (
              <p className="text-gray-400">{user.PhoneNumber}</p>
            )}
            {user.MembershipLevel && (
              <p className="mt-1">
                <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                  {user.MembershipLevel} Member
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h4 className="font-medium">{movie.title}</h4>
        <p className="text-gray-400 text-sm">{movie.releaseDate}</p>
      </div>

      {showtime && (
        <>
          <div className="space-y-2 mb-4 p-3 bg-black/30 rounded-lg">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>
                {format(new Date(showtime.StartTime), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>
                {format(new Date(showtime.StartTime), "h:mm a")} -{" "}
                {format(new Date(showtime.EndTime), "h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Film className="h-3.5 w-3.5 text-primary" />
              <span>
                {showtime.Format}
                {showtime.Subtitle ? " (Subtitled)" : ""}
                {showtime.Dub ? " (Dubbed)" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>
                {showtime.CinemaName} - Room {showtime.RoomNumber}
              </span>
            </div>
          </div>
        </>
      )}

      <Separator className="my-4" />

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Selected Seats</span>
          <span>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </div>

        {selectedSeats.length > 0 && (
          <div className="flex justify-between mb-2 text-sm">
            <span>Seats Subtotal</span>
            <span>{seatTotal.toLocaleString()} VND</span>
          </div>
        )}

        {/* Show selected food items in summary */}
        {Object.entries(selectedFood).filter(([_, qty]) => qty > 0).length >
          0 && (
          <>
            <div className="mt-4 mb-2 text-sm font-medium">Selected Items:</div>
            {Object.entries(selectedFood)
              .filter(([_, qty]) => qty > 0)
              .map(([itemId, qty]) => {
                const item =
                  popcornItems.find((p) => p.id === itemId) ||
                  drinkItems.find((d) => d.id === itemId);

                if (!item) return null;

                return (
                  <div
                    key={itemId}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.name} {item.size ? `(${item.size})` : ""} x {qty}
                    </span>
                    <span>{(item.price * qty).toLocaleString()} VND</span>
                  </div>
                );
              })}
            <div className="flex justify-between mt-2 mb-2 text-sm">
              <span>Food Subtotal</span>
              <span>{foodTotal.toLocaleString()} VND</span>
            </div>
            <Separator className="my-2" />
          </>
        )}

        {voucher && (
          <div className="mt-4 mb-4 p-3 bg-green-900/20 border border-green-500 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">Voucher Applied</h5>
                <p className="text-sm text-gray-300">{voucher.code}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {voucher.description}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                  {voucher.discountType === "Fixed"
                    ? `${voucher.discountAmount.toLocaleString()} VND`
                    : `${voucher.discountAmount}%`}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">You save:</span>
              <span className="text-green-400">
                -{discount.toLocaleString()} VND
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between font-medium text-lg mt-4">
          <span>Total Price</span>
          <span>{total.toLocaleString()} VND</span>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={onCheckout}
        disabled={selectedSeats.length === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};
