import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie } from "@/lib/data_movies";
import { Seat } from "@/lib/data_seat";
import { FoodItem } from "@/lib/data_food";
import { Voucher } from "@/lib/data_voucher";

interface BookingSummaryProps {
  movie: Movie;
  selectedSeats: string[];
  seats: Seat[];
  selectedFood: { [key: string]: number };
  popcornItems: FoodItem[];
  drinkItems: FoodItem[];
  voucher: Voucher | null;
  onCheckout: () => void;
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

      <div className="mb-6">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h4 className="font-medium">{movie.title}</h4>
        <p className="text-gray-400 text-sm">{movie.releaseDate}</p>
      </div>

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
          <div className="flex justify-between mb-2 text-green-400">
            <span>Voucher Discount</span>
            <span>-{discount.toLocaleString()} VND</span>
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
