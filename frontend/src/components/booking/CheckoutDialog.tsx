import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Film,
  User,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { Movie } from "@/lib/data_movies";
import { Voucher } from "@/lib/data_voucher";
import { Showtime } from "@/lib/data_showtimes";
import { Seat } from "@/lib/data_seat";
import { FoodItem } from "@/lib/data_food";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie;
  selectedSeats: string[];
  foodItemsCount: number;
  totalPrice: number;
  paymentMethod: "Credit Card" | "Cash" | "Mobile App";
  setPaymentMethod: (method: "Credit Card" | "Cash" | "Mobile App") => void;
  isProcessing: boolean;
  onConfirm: () => void;
  showtime?: Showtime | null;
  selectedFood?: { [key: string]: number };
  popcornItems?: FoodItem[];
  drinkItems?: FoodItem[];
  voucher?: Voucher | null;
  seats?: Seat[];
  user?: any;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  movie,
  selectedSeats,
  foodItemsCount,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  isProcessing,
  onConfirm,
  showtime,
  selectedFood = {},
  popcornItems = [],
  drinkItems = [],
  voucher,
  seats = [],
  user,
}) => {
  // Calculate seat subtotal
  const seatTotal = selectedSeats.reduce((total, seatNumber) => {
    const seat = seats.find((s) => s.SeatNumber === seatNumber);
    return total + (seat ? Number(seat.Price) : 0);
  }, 0);

  // Calculate food subtotal
  const foodTotal = Object.entries(selectedFood).reduce(
    (total, [itemId, quantity]) => {
      const food =
        popcornItems.find((f) => f.id === itemId) ||
        drinkItems.find((f) => f.id === itemId);
      return total + (food ? food.price * quantity : 0);
    },
    0
  );

  // Calculate voucher discount
  const subtotal = seatTotal + foodTotal;
  let discount = 0;

  if (voucher) {
    if (voucher.discountType === "Fixed") {
      discount = voucher.discountAmount;
    } else {
      discount = (subtotal * voucher.discountAmount) / 100;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Customer Information */}
          {user && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Information
              </h4>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.FullName}</span>
                    {user.MembershipLevel && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                      >
                        {user.MembershipLevel}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                  {user.Email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span>{user.Email}</span>
                    </div>
                  )}
                  {user.PhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>{user.PhoneNumber}</span>
                    </div>
                  )}
                  {user.CustomerID && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        Account ID: {user.CustomerID}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Movie and Showtime Info */}
          <div className="space-y-3">
            <div className="flex gap-4 items-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {movie.genre?.join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {movie.duration} minutes
                </p>
              </div>
            </div>

            {showtime && (
              <div className="space-y-2 p-3 bg-black/20 rounded-lg">
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
            )}
          </div>

          <Separator />

          {/* Seats Section */}
          <div className="space-y-2">
            <h4 className="font-medium">Selected Seats</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seatNumber) => {
                const seat = seats.find((s) => s.SeatNumber === seatNumber);
                return (
                  <div
                    key={seatNumber}
                    className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs"
                  >
                    {seatNumber} ({seat?.Price?.toLocaleString()} VND)
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span>Seats Subtotal:</span>
              <span>{seatTotal.toLocaleString()} VND</span>
            </div>
          </div>

          {/* Food and Drinks Section */}
          {Object.entries(selectedFood).filter(([_, qty]) => qty > 0).length >
            0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Food & Drinks</h4>
              <div className="space-y-1">
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
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} {item.size ? `(${item.size})` : ""} x{" "}
                          {qty}
                        </span>
                        <span>{(item.price * qty).toLocaleString()} VND</span>
                      </div>
                    );
                  })}
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span>Food Subtotal:</span>
                <span>{foodTotal.toLocaleString()} VND</span>
              </div>
            </div>
          )}

          {/* Voucher Section */}
          {voucher && (
            <div className="space-y-2">
              <h4 className="font-medium">Applied Voucher</h4>
              <div className="p-3 bg-green-900/20 border border-green-500 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{voucher.code}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
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
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-green-400">
                    -{discount.toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between font-bold">
            <span>Total Price:</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>

          {/* Payment Method */}
          <div>
            <span className="font-medium block mb-2">Payment Method:</span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={
                  paymentMethod === "Credit Card" ? "default" : "outline"
                }
                onClick={() => setPaymentMethod("Credit Card")}
                className="w-full"
              >
                Credit Card
              </Button>
              <Button
                variant={paymentMethod === "Cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("Cash")}
                className="w-full"
              >
                Cash
              </Button>
              <Button
                variant={paymentMethod === "Mobile App" ? "default" : "outline"}
                onClick={() => setPaymentMethod("Mobile App")}
                className="w-full"
              >
                Mobile App
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
