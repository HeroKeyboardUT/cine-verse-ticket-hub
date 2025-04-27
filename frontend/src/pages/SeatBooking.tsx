import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeatsByShowtime, Seat } from "@/lib/data_seat";
import { fetchMovieById, Movie } from "@/lib/data_movies";
import { fetchFoodItems, FoodItem } from "@/lib/data_food";
import { fetchVouchers, Voucher } from "@/lib/data_voucher";
import { createTicketOrder } from "@/lib/data_order";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchShowtimeByMovieId,
  Showtime,
  fetchOccupancyRate,
} from "@/lib/data_showtimes";
import { format } from "date-fns";
import { Film, Calendar, Clock, MapPin, Users } from "lucide-react";
import { SeatSelector } from "@/components/booking/SeatSelector";
import { FoodSelector } from "@/components/booking/FoodSelector";
import { VoucherSelector } from "@/components/booking/VoucherSelector";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { CheckoutDialog } from "@/components/booking/CheckoutDialog";
import { Progress } from "@/components/ui/progress";

const SeatBooking = () => {
  const { movieId, showtimesID } = useParams<{
    movieId: string;
    showtimesID: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for data
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [popcornItems, setPopcornItems] = useState<FoodItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<FoodItem[]>([]);
  const [otherItems, setOtherItems] = useState<FoodItem[]>([]);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);
  const [occupancyRate, setOccupancyRate] = useState<number | null>(null);

  // State for user selections
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<{ [key: string]: number }>(
    {}
  );
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "Credit Card" | "Cash" | "Mobile App"
  >("Credit Card");

  // Get user from local storage
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!storedToken || !storedUser) {
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch movie details
        const fetchedMovie = await fetchMovieById(movieId!);
        setMovie(fetchedMovie);

        // Fetch seats for the showtime
        const fetchedSeats = await fetchSeatsByShowtime(showtimesID!);
        setSeats(fetchedSeats);

        // Fetch showtime details
        try {
          const showtimes = await fetchShowtimeByMovieId(movieId!);
          const currentShowtime = showtimes.find(
            (st) => st.ShowTimeID === showtimesID
          );
          if (currentShowtime) {
            setShowtime(currentShowtime);
          }

          // Fetch occupancy rate
          try {
            const rate = await fetchOccupancyRate(showtimesID!);
            setOccupancyRate(rate);
          } catch (occupancyError) {
            console.error("Error fetching occupancy rate:", occupancyError);
          }
        } catch (showtimeError) {
          console.error("Error fetching showtime:", showtimeError);
        }

        // Fetch food items
        try {
          const fetchedFoodItems = await fetchFoodItems();
          setPopcornItems(fetchedFoodItems.popcorn);
          setDrinkItems(fetchedFoodItems.drinks);
          setOtherItems(fetchedFoodItems.others);
        } catch (foodError) {
          console.error("Error fetching food items:", foodError);
          // Don't fail the whole page if just food items fail
        }

        // Fetch vouchers
        try {
          setVouchersLoading(true);
          const fetchedVouchers = await fetchVouchers();
          setVouchers(fetchedVouchers);
        } catch (voucherError) {
          console.error("Error fetching vouchers:", voucherError);
          // Don't fail the whole page if just vouchers fail
        } finally {
          setVouchersLoading(false);
        }
      } catch (err) {
        setError("Failed to load necessary data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, showtimesID]);

  // Event handlers
  const handleSeatToggle = (
    seatNumber: string,
    status: "available" | "occupied"
  ) => {
    if (status === "occupied") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((id) => id !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleFoodSelection = (itemId: string, quantity: number) => {
    setSelectedFood((prev) => {
      const newQuantity = (prev[itemId] || 0) + quantity;

      // If quantity becomes 0 or negative, remove the item
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  const handleVoucherSelect = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
  };

  const calculateTotalPrice = (): number => {
    // Calculate seat total - Fix the accumulation of seat prices
    const seatTotal = selectedSeats.reduce((total, seatNumber) => {
      const seat = seats.find((s) => s.SeatNumber === seatNumber);
      return total + (seat ? Number(seat.Price) : 0); // Ensure Price is treated as a number
    }, 0);

    // Calculate food total
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

    if (selectedVoucher) {
      if (selectedVoucher.discountType === "Fixed") {
        discount = selectedVoucher.discountAmount;
      } else {
        // Percentage discount
        discount = (subtotal * selectedVoucher.discountAmount) / 100;
      }
    }

    return Math.max(0, subtotal - discount);
  };

  const openCheckoutDialog = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleBookingConfirm = async () => {
    setIsProcessing(true);

    try {
      // if (!user || !user.CustomerID) {
      //   throw new Error("User information not available");
      // }

      // Prepare the food items data
      const foodItemsData = Object.entries(selectedFood)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => ({
          itemId,
          quantity,
        }));

      // Map payment method to appropriate value for backend
      const mappedPaymentMethod =
        paymentMethod === "Credit Card"
          ? "Card"
          : paymentMethod === "Mobile App"
          ? "Online"
          : "Cash";

      // Create the order
      const orderData = {
        customerId: user.CustomerID,
        showtimeId: showtimesID!,
        movieId: movieId!,
        seatNumbers: selectedSeats,
        foodItems: foodItemsData.length > 0 ? foodItemsData : undefined,
        voucherId: selectedVoucher?.id,
        paymentMethod: mappedPaymentMethod,
        totalPrice: calculateTotalPrice(),
      };
      console.log("Order data:", orderData); // Debugging line
      const orderResponse = await createTicketOrder(orderData);

      setShowConfirmDialog(false);

      toast({
        title: "Booking successful!",
        description: `Your order #${orderResponse.orderId} has been created.`,
      });

      // Navigate to a confirmation page or back to homepage
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Booking failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your booking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
      </div>
    );
  }

  // Count total food items selected
  const foodItemsCount = Object.entries(selectedFood).filter(
    ([_, qty]) => qty > 0
  ).length;

  // Calculate total price
  const totalPrice = calculateTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Tickets</h1>

      {/* Showtime Information Card */}
      {showtime && (
        <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{movie?.title}</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(showtime.StartTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(showtime.StartTime), "h:mm a")} -{" "}
                    {format(new Date(showtime.EndTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Film className="h-4 w-4" />
                  <span>
                    {showtime.Format}
                    {showtime.Subtitle ? " (Subtitled)" : ""}
                    {showtime.Dub ? " (Dubbed)" : ""}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {showtime.CinemaName} - Room {showtime.RoomNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Rate Indicator */}
          {occupancyRate !== null && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Theater Occupancy</span>
                <span className="text-sm font-bold">
                  {occupancyRate.toFixed(2)}%
                </span>
              </div>
              <Progress value={occupancyRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {occupancyRate > 80
                  ? "Theater is filling up quickly! Limited seats available."
                  : occupancyRate > 50
                  ? "Moderate attendance. Good seats still available."
                  : "Low attendance. Plenty of seats available."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: Seat selection, food, vouchers */}
        <div className="w-full md:w-3/4 ">
          {/* Seat selection component */}
          <SeatSelector
            movie={movie}
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />

          {/* Food selection component */}
          <FoodSelector
            popcornItems={popcornItems}
            drinkItems={drinkItems}
            othersItems={otherItems}
            selectedFood={selectedFood}
            onFoodSelect={handleFoodSelection}
          />

          {/* Voucher selection component */}
          <VoucherSelector
            onSelectVoucher={handleVoucherSelect}
            orderTotal={totalPrice}
            selectedVoucher={selectedVoucher}
            vouchers={vouchers}
            isLoading={vouchersLoading}
          />
        </div>

        {/* Right column: Order summary */}
        <div className="w-full md:w-1/4">
          <BookingSummary
            movie={movie}
            selectedSeats={selectedSeats}
            seats={seats}
            selectedFood={selectedFood}
            popcornItems={popcornItems}
            drinkItems={drinkItems}
            voucher={selectedVoucher}
            onCheckout={openCheckoutDialog}
            showtime={showtime}
            totalPrice={totalPrice}
            user={user}
          />
        </div>
      </div>

      {/* Checkout dialog */}
      <CheckoutDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        movie={movie}
        selectedSeats={selectedSeats}
        foodItemsCount={foodItemsCount}
        totalPrice={totalPrice}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        isProcessing={isProcessing}
        onConfirm={handleBookingConfirm}
        showtime={showtime}
        selectedFood={selectedFood}
        popcornItems={popcornItems}
        drinkItems={drinkItems}
        voucher={selectedVoucher}
        seats={seats}
        user={user}
      />
    </div>
  );
};

export default SeatBooking;
