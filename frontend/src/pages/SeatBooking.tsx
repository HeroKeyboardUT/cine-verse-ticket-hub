import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { fetchSeatsByShowtime, Seat } from "@/lib/data_seat";
import { fetchMovieById, Movie } from "@/lib/data_movies";
import { fetchFoodItems, FoodItem } from "@/lib/data_food";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { set } from "date-fns";

const SeatBooking = () => {
  const { movieId, showtimesID } = useParams<{
    movieId: string;
    showtimesID: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<{ [key: string]: number }>(
    {}
  );
  const [voucher, setVoucher] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMovie = await fetchMovieById(movieId!);
        const fetchedSeats = await fetchSeatsByShowtime(showtimesID!);
        // console.log(fetchedSeats, "fetchedSeats");
        // const fetchedFoodItems = await fetchFoodItems();
        setMovie(fetchedMovie);
        setSeats(fetchedSeats);
        // setFoodItems(fetchedFoodItems);
      } catch (err) {
        setError("Failed to load movie, seat, or food data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, showtimesID]);

  const toggleSeatSelection = (
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
    setSelectedFood((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity,
    }));
  };

  const getTotalPrice = () => {
    const seatTotal = selectedSeats.reduce((total, seatNumber) => {
      const seat = seats.find((s) => s.SeatNumber === seatNumber);
      return total + (seat ? seat.Price : 0);
    }, 0);

    const foodTotal = Object.entries(selectedFood).reduce(
      (total, [itemId, quantity]) => {
        const food = foodItems.find((f) => f.id === itemId);
        return total + (food ? food.price * quantity : 0);
      },
      0
    );

    return seatTotal + foodTotal - discount;
  };

  const applyVoucher = () => {
    // Simulate voucher validation
    if (voucher === "DISCOUNT10") {
      setDiscount(10000);
      toast({
        title: "Voucher applied!",
        description: "You saved 10,000 VND.",
      });
    } else {
      toast({ title: "Invalid voucher", variant: "destructive" });
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking successful!",
      description: `You booked ${selectedSeats.length} seat(s) for ${movie?.title}.`,
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-500">{error}</h1>
      </div>
    );

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
              <p className="text-gray-400">{movie.releaseDate}</p>
            </div>

            <div className="w-full h-2 bg-primary/20 mb-12"></div>

            <p className="text-center text-sm mb-10">SCREEN</p>

            <div className="grid grid-cols-12 gap-2 mb-8">
              {seats.map((seat) => (
                <button
                  key={seat.SeatNumber}
                  className={`aspect-square flex items-center justify-center text-xs rounded ${
                    seat.status === "occupied"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : selectedSeats.includes(seat.SeatNumber)
                      ? "bg-primary text-white"
                      : seat.SeatType === "vip"
                      ? "bg-purple-900/30 seat"
                      : "bg-gray-800/50 seat"
                  }`}
                  onClick={() =>
                    toggleSeatSelection(seat.SeatNumber, seat.status)
                  }
                  disabled={seat.status === "occupied"}
                >
                  {seat.SeatNumber}
                </button>
              ))}
            </div>

            <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-800/50 rounded mr-2"></div>
                <span>Standard</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-900/30 rounded mr-2"></div>
                <span>VIP</span>
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

          <div className="p-6 bg-black/20 rounded-lg mb-8">
            <h3 className="text-xl font-medium mb-4">Food & Drinks</h3>
            <div className="grid grid-cols-2 gap-4">
              {foodItems.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between"
                >
                  <span>{food.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleFoodSelection(food.id, -1)}
                      disabled={!selectedFood[food.id]}
                    >
                      -
                    </Button>
                    <span>{selectedFood[food.id] || 0}</span>
                    <Button
                      size="sm"
                      onClick={() => handleFoodSelection(food.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-black/20 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Voucher</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 text-white"
                placeholder="Enter voucher code"
              />
              <Button onClick={applyVoucher}>Apply</Button>
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

              <div className="flex justify-between mb-2">
                <span>Discount</span>
                <span>{discount.toLocaleString()} VND</span>
              </div>

              <div className="flex justify-between font-medium">
                <span>Total Price</span>
                <span>{getTotalPrice().toLocaleString()} VND</span>
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
