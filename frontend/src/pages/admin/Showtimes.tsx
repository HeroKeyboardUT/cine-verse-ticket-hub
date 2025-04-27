import React, { useState, useEffect } from "react";
import { Calendar, Search, Edit, Trash2, Plus } from "lucide-react";
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
import { format, parseISO } from "date-fns";
import {
  fetchShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  Showtime,
} from "@/lib/data_showtimes";

const ShowtimesPage = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null);

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const fetchedShowtimes = await fetchShowtimes();
        setShowtimes(fetchedShowtimes);
        setFilteredShowtimes(fetchedShowtimes);
      } catch (err) {
        setError("Failed to load showtimes");
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, []);

  useEffect(() => {
    const filtered = showtimes.filter(
      (st) =>
        st.MovieID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.CinemaID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.StartTime.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShowtimes(filtered);
  }, [searchTerm, showtimes]);

  const handleSaveShowtime = async () => {
    if (!currentShowtime) return;

    try {
      if (currentShowtime.ShowTimeID) {
        await updateShowtime(currentShowtime.ShowTimeID, currentShowtime);
        toast({
          title: "Success",
          description: "Showtime updated successfully",
        });
      } else {
        await createShowtime(currentShowtime);
        toast({
          title: "Success",
          description: "Showtime created successfully",
        });
      }

      const updatedShowtimes = await fetchShowtimes();
      setShowtimes(updatedShowtimes);
      setFilteredShowtimes(updatedShowtimes);
      setIsDialogOpen(false);
      setCurrentShowtime(null);
    } catch (err) {
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
      await deleteShowtime(id);
      toast({ title: "Success", description: "Showtime deleted successfully" });

      const updatedShowtimes = await fetchShowtimes();
      setShowtimes(updatedShowtimes);
      setFilteredShowtimes(updatedShowtimes);
    } catch (err) {
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
                  ShowTimeID: "",
                  CinemaID: "",
                  CinemaName: "",
                  RoomNumber: 0,
                  RoomType: "",
                  MovieID: "",
                  MovieTitle: "",
                  StartTime: new Date().toISOString(),
                  EndTime: "",
                  Duration: 120,
                  Format: "",
                  Subtitle: true,
                  Dub: false,
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
                  <TableHead>Showtime ID</TableHead>
                  <TableHead>Cinema</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Dub</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShowtimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-6">
                      No showtimes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShowtimes.map((showtime) => (
                    <TableRow key={showtime.ShowTimeID}>
                      <TableCell>{showtime.ShowTimeID}</TableCell>
                      <TableCell>{showtime.CinemaID}</TableCell>
                      <TableCell>{showtime.RoomNumber}</TableCell>
                      <TableCell>{showtime.MovieID}</TableCell>
                      <TableCell>
                        {format(parseISO(showtime.StartTime), "PPpp")}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(showtime.EndTime), "PPpp")}
                      </TableCell>
                      <TableCell>{showtime.Duration} mins</TableCell>
                      <TableCell>{showtime.Format}</TableCell>
                      <TableCell>{showtime.Subtitle ? "Yes" : "No"}</TableCell>
                      <TableCell>{showtime.Dub ? "Yes" : "No"}</TableCell>
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
                            onClick={() =>
                              handleDeleteShowtime(showtime.ShowTimeID)
                            }
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
              {currentShowtime?.ShowTimeID ? "Edit Showtime" : "Add Showtime"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveShowtime();
            }}
          >
            <div className="space-y-4">
              <Input
                placeholder="Cinema ID"
                value={currentShowtime?.CinemaID || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev ? { ...prev, CinemaID: e.target.value } : null
                  )
                }
                required
              />
              <Input
                type="number"
                placeholder="Room Number"
                value={currentShowtime?.RoomNumber || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? { ...prev, RoomNumber: parseInt(e.target.value) }
                      : null
                  )
                }
                required
              />
              <Input
                placeholder="Movie ID"
                value={currentShowtime?.MovieID || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev ? { ...prev, MovieID: e.target.value } : null
                  )
                }
                required
              />
              <Input
                type="datetime-local"
                value={
                  currentShowtime?.StartTime
                    ? format(
                        parseISO(currentShowtime.StartTime),
                        "yyyy-MM-dd'T'HH:mm"
                      )
                    : ""
                }
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? {
                          ...prev,
                          StartTime: new Date(e.target.value).toISOString(),
                        }
                      : null
                  )
                }
                required
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={currentShowtime?.Duration || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev
                      ? { ...prev, Duration: parseInt(e.target.value) }
                      : null
                  )
                }
                required
              />
              <Input
                placeholder="Format (e.g., 2D, 3D, IMAX)"
                value={currentShowtime?.Format || ""}
                onChange={(e) =>
                  setCurrentShowtime((prev) =>
                    prev ? { ...prev, Format: e.target.value } : null
                  )
                }
                required
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentShowtime?.Subtitle || false}
                    onChange={(e) =>
                      setCurrentShowtime((prev) =>
                        prev ? { ...prev, Subtitle: e.target.checked } : null
                      )
                    }
                    className="mr-2"
                  />
                  Subtitles
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentShowtime?.Dub || false}
                    onChange={(e) =>
                      setCurrentShowtime((prev) =>
                        prev ? { ...prev, Dub: e.target.checked } : null
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
