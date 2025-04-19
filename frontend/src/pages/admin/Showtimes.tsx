import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";

interface Showtime {
  id: string; // Composite key: RoomID|MovieID|StartTime
  roomId: string;
  movieId: string;
  movieTitle: string;
  startTime: string;
  duration: number;
  format: string;
  subtitle: boolean;
  dub: boolean;
}

interface Movie {
  MovieID: string;
  Title: string;
  Duration: number;
}

interface Room {
  RoomNumber: number;
  CinemaID: string;
  Name: string;
}

interface Cinema {
  CinemaID: string;
  Name: string;
}

const ShowtimesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch cinemas for dropdown
        const cinemasRes = await fetch("http://localhost:5000/api/cinemas");
        if (!cinemasRes.ok) {
          const errorData = await cinemasRes.json();
          throw new Error(errorData.message || "Failed to fetch cinemas");
        }
        const cinemasData = await cinemasRes.json();

        setCinemas(cinemasData.data);

        // Fetch showtimes
        const showtimesRes = await fetch("http://localhost:5000/api/showtimes");
        if (!showtimesRes.ok) {
          const errorData = await showtimesRes.json();
          throw new Error(errorData.message || "Failed to fetch showtimes");
        }
        const showtimesData = await showtimesRes.json();

        // Fetch movies for dropdown
        const moviesRes = await fetch("http://localhost:5000/api/movies");
        if (!moviesRes.ok) {
          const errorData = await moviesRes.json();
          throw new Error(errorData.message || "Failed to fetch movies");
        }
        const moviesData = await moviesRes.json();

        setMovies(moviesData);

        // Map showtimes data
        const mappedShowtimes = showtimesData.map((st: any) => ({
          id: `${st.RoomID}|${st.MovieID}|${st.StartTime}`,
          roomId: st.RoomID,
          movieId: st.MovieID,
          movieTitle:
            moviesData.find((m: Movie) => m.MovieID === st.MovieID)?.Title ||
            st.MovieID,
          startTime: st.StartTime,
          duration: st.Duration,
          format: st.Format,
          subtitle: st.Subtitle,
          dub: st.Dub,
        }));

        setShowtimes(mappedShowtimes);
        setFilteredShowtimes(mappedShowtimes);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch rooms when cinema changes
  useEffect(() => {
    if (!selectedCinema) {
      setRooms([]);
      return;
    }

    const fetchRooms = async () => {
      try {
        const roomsRes = await fetch(
          `http://localhost:5000/api/rooms?cinemaId=${selectedCinema}`
        );
        if (!roomsRes.ok) {
          const errorData = await roomsRes.json();
          throw new Error(errorData.message || "Failed to fetch rooms");
        }
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      } catch (err) {
        console.error("Fetch error:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to fetch rooms",
          variant: "destructive",
        });
      }
    };

    fetchRooms();
  }, [selectedCinema]);

  // Filter showtimes based on search term
  useEffect(() => {
    const filtered = showtimes.filter(
      (st) =>
        st.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.startTime.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShowtimes(filtered);
  }, [searchTerm, showtimes]);

  const handleSaveShowtime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentShowtime) return;

    try {
      const payload = {
        RoomID: currentShowtime.roomId,
        MovieID: currentShowtime.movieId,
        StartTime: currentShowtime.startTime,
        Duration: currentShowtime.duration,
        Format: currentShowtime.format,
        Subtitle: currentShowtime.subtitle,
        Dub: currentShowtime.dub,
      };

      const url = currentShowtime.id
        ? `http://localhost:5000/api/showtimes/${encodeURIComponent(
            currentShowtime.id
          )}`
        : "http://localhost:5000/api/showtimes";

      const method = currentShowtime.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save showtime");
      }

      toast({
        title: "Success",
        description: `Showtime ${
          currentShowtime.id ? "updated" : "added"
        } successfully`,
      });

      // Refresh data
      const updatedRes = await fetch("http://localhost:5000/api/showtimes");
      const updatedData = await updatedRes.json();
      const updatedShowtimes = updatedData.map((st: any) => ({
        id: `${st.RoomID}|${st.MovieID}|${st.StartTime}`,
        roomId: st.RoomID,
        movieId: st.MovieID,
        movieTitle:
          movies.find((m) => m.MovieID === st.MovieID)?.Title || st.MovieID,
        startTime: st.StartTime,
        duration: st.Duration,
        format: st.Format,
        subtitle: st.Subtitle,
        dub: st.Dub,
      }));

      setShowtimes(updatedShowtimes);
      setIsDialogOpen(false);
      setCurrentShowtime(null);
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to save showtime",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShowtime = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this showtime?"))
      return;

    try {
      const [roomId, movieId, startTime] = id.split("|");
      const response = await fetch(
        `http://localhost:5000/api/showtimes/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            RoomID: roomId,
            MovieID: movieId,
            StartTime: startTime,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete showtime");
      }

      toast({
        title: "Success",
        description: "Showtime deleted successfully",
      });

      setShowtimes((prev) => prev.filter((st) => st.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete showtime",
        variant: "destructive",
      });
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading showtimes...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Calendar className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Showtime Management</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Showtimes</CardTitle>
          <CardDescription>
            Manage movie schedules and showtimes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showtimes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center"
              onClick={() => {
                setCurrentShowtime({
                  id: "",
                  roomId: "",
                  movieId: "",
                  movieTitle: "",
                  startTime: new Date().toISOString(),
                  duration: 120,
                  format: "",
                  subtitle: false,
                  dub: false,
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Showtime
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShowtimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No showtimes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShowtimes.map((showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell>{showtime.movieTitle}</TableCell>
                      <TableCell>{showtime.roomId}</TableCell>
                      <TableCell>
                        {format(parseISO(showtime.startTime), "PPpp")}
                      </TableCell>
                      <TableCell>{showtime.duration} mins</TableCell>
                      <TableCell>{showtime.format}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentShowtime(showtime);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteShowtime(showtime.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentShowtime?.id ? "Edit Showtime" : "Add Showtime"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveShowtime}>
            <div className="space-y-4">
              {/* Select Cinema */}
              <Select
                value={selectedCinema || ""}
                onValueChange={(value) => {
                  setSelectedCinema(value);
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          roomId: "", // Reset room when cinema changes
                        }
                      : null
                  );
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Cinema" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.CinemaID} value={cinema.CinemaID}>
                      {cinema.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Select Room */}
              <Select
                value={currentShowtime?.roomId || ""}
                onValueChange={(value) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          roomId: value,
                        }
                      : null
                  )
                }
                required
                disabled={!selectedCinema}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem
                      key={room.RoomNumber}
                      value={room.RoomNumber.toString()}
                    >
                      {room.Name} (Room {room.RoomNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ...existing fields for movie, start time, duration, etc... */}
              <Select
                value={currentShowtime?.movieId || ""}
                onValueChange={(value) => {
                  const selectedMovie = movies.find(
                    (movie) => movie.MovieID === value
                  );
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          movieId: value,
                          duration: selectedMovie
                            ? selectedMovie.Duration
                            : prev.duration,
                        }
                      : null
                  );
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.MovieID} value={movie.MovieID}>
                      {movie.Title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="datetime-local"
                value={
                  currentShowtime?.startTime
                    ? format(
                        parseISO(currentShowtime.startTime),
                        "yyyy-MM-dd'T'HH:mm"
                      )
                    : ""
                }
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          startTime: new Date(e.target.value).toISOString(),
                        }
                      : null
                  )
                }
                required
              />

              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={currentShowtime?.duration || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          duration: parseInt(e.target.value),
                        }
                      : null
                  )
                }
                required
              />

              <Input
                placeholder="Format (e.g., 2D, 3D, IMAX)"
                value={currentShowtime?.format || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          format: e.target.value,
                        }
                      : null
                  )
                }
                required
              />

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentShowtime?.subtitle || false}
                    onChange={(e) =>
                      setCurrentShowtime((prev) =>
                        prev
                          ? {
                              ...prev,
                              subtitle: e.target.checked,
                            }
                          : null
                      )
                    }
                    className="mr-2"
                  />
                  Subtitles
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentShowtime?.dub || false}
                    onChange={(e) =>
                      setCurrentShowtime((prev) =>
                        prev
                          ? {
                              ...prev,
                              dub: e.target.checked,
                            }
                          : null
                      )
                    }
                    className="mr-2"
                  />
                  Dubbed
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowtimesPage;
