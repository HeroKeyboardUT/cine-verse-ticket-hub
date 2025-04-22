
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Seat } from "@/lib/data_seat";
import { Building2, Seat as SeatIcon } from "lucide-react";
import { fetchCinemas, Cinema } from "@/lib/data_cinemas";

interface Room {
  cinemaId: string;
  roomNumber: number;
  capacity: number;
  type: string;
  screenId: string;
}

const SeatManagement = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seatTypes] = useState<Array<"standard" | "premium" | "vip">>(["standard", "premium", "vip"]);

  // Fetch cinemas
  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const fetchedCinemas = await fetchCinemas();
        setCinemas(fetchedCinemas);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cinemas:", err);
        toast({
          title: "Error",
          description: "Could not load cinemas",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadCinemas();
  }, []);

  // Mock rooms data - replace with actual API call
  useEffect(() => {
    if (selectedCinema) {
      // Mock data - replace with actual API
      const mockRooms: Room[] = [
        { cinemaId: selectedCinema, roomNumber: 1, capacity: 120, type: "Standard", screenId: "SCR001" },
        { cinemaId: selectedCinema, roomNumber: 2, capacity: 80, type: "Premium", screenId: "SCR002" },
        { cinemaId: selectedCinema, roomNumber: 3, capacity: 60, type: "VIP", screenId: "SCR003" },
      ];
      setRooms(mockRooms);
      setSelectedRoom(null);
      setSeats([]);
    } else {
      setRooms([]);
      setSelectedRoom(null);
    }
  }, [selectedCinema]);

  // Generate seats when room is selected
  useEffect(() => {
    if (selectedCinema && selectedRoom !== null) {
      // In a real app, fetch real seats data from API
      // For now, we'll use the generateSeats function for demonstration
      const generatedSeats = generateSeats(`${selectedCinema}-${selectedRoom}`);
      setSeats(generatedSeats);
    }
  }, [selectedCinema, selectedRoom]);

  // Mock function to generate seats
  const generateSeats = (showtime: string): Seat[] => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;
    const seats: Seat[] = [];
  
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Generate status
        const random = Math.random();
        let status: "available" | "occupied" | "selected" = "available";
  
        // Determine seat type
        let type: "standard" | "premium" | "vip" = "standard";
        if (row === "G" || row === "H") {
          type = "premium";
        }
        if (row === "D" || row === "E") {
          type = "vip";
        }
  
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status,
          type,
        });
      }
    });
  
    return seats;
  };

  const handleSeatClick = (seat: Seat) => {
    if (editMode) {
      setSelectedSeat(seat);
    }
  };

  const handleSeatTypeChange = (seatId: string, newType: "standard" | "premium" | "vip") => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId ? { ...seat, type: newType } : seat
      )
    );

    toast({
      title: "Seat Updated",
      description: `Seat ${seatId} type changed to ${newType}.`,
    });
    
    setSelectedSeat(null);
  };

  const getSeatColor = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-gray-300 hover:bg-gray-400";
      case "premium":
        return "bg-blue-300 hover:bg-blue-400";
      case "vip":
        return "bg-purple-300 hover:bg-purple-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <SeatIcon className="mr-2 h-7 w-7" />
          Seat Management
        </h1>
        <Button 
          variant={editMode ? "default" : "outline"}
          onClick={() => setEditMode(prev => !prev)}
        >
          {editMode ? "Exit Edit Mode" : "Edit Seats"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Cinema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="cinema">Cinema</Label>
              <Select
                value={selectedCinema}
                onValueChange={(value) => setSelectedCinema(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cinema" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select
                value={selectedRoom?.toString() || ""}
                onValueChange={(value) => setSelectedRoom(parseInt(value))}
                disabled={!selectedCinema}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.roomNumber} value={room.roomNumber.toString()}>
                      Room {room.roomNumber} - {room.type} ({room.capacity} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 mr-2"></div>
                <span>Standard</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-300 mr-2"></div>
                <span>Premium</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-300 mr-2"></div>
                <span>VIP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : selectedCinema && selectedRoom !== null ? (
        <Card>
          <CardHeader>
            <CardTitle>Seat Layout - Room {selectedRoom}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8 mx-auto">
              <div className="w-full h-4 bg-gray-800 mb-12 text-center text-white text-sm flex items-center justify-center rounded">
                SCREEN
              </div>

              <div className="grid grid-cols-12 gap-2">
                {seats.map((seat) => (
                  <div
                    key={seat.id}
                    className={`w-full aspect-square flex items-center justify-center rounded cursor-pointer ${getSeatColor(
                      seat.type
                    )} ${selectedSeat?.id === seat.id ? "ring-2 ring-red-500" : ""}`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.id}
                  </div>
                ))}
              </div>
            </div>

            {selectedSeat && (
              <div className="mt-6 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-4">Edit Seat {selectedSeat.id}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seatType">Seat Type</Label>
                    <Select
                      value={selectedSeat.type}
                      onValueChange={(value) => 
                        handleSeatTypeChange(
                          selectedSeat.id, 
                          value as "standard" | "premium" | "vip"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {seatTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedSeat(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a cinema and room to view and manage seats
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeatManagement;
