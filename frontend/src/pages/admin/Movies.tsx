// @/components/admin/MovieList.tsx
import React, { useState, useEffect } from "react";
import {
  Film,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchMovies,
  Movie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/lib/data_movies";
import MovieDialog from "@/components/admin/MovieDialog";
import { toast } from "@/hooks/use-toast";

const MovieList = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Movie>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch movies from database on mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMovies();
        console.log(data);
        setMoviesData(data);
        setFilteredMovies(data);
      } catch (err) {
        setError("Failed to load movies. Please try again.");
        toast({
          title: "Error",
          description: "Could not fetch movies from the database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Filter and sort movies
  useEffect(() => {
    filterAndSortMovies();
  }, [searchTerm, sortField, sortDirection, moviesData]);

  const filterAndSortMovies = () => {
    let filtered = [...moviesData];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (movie.description &&
            movie.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          movie.genre.some((g) =>
            g.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "genre") {
        aVal = a.genre.join(", ");
        bVal = b.genre.join(", ");
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    setFilteredMovies(filtered);
  };

  const handleSort = (field: keyof Movie) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCreateMovie = () => {
    setCurrentMovie(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setCurrentMovie(movie);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleViewMovie = (movie: Movie) => {
    setCurrentMovie(movie);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        deleteMovie(movieId);
        setMoviesData((prev) => prev.filter((movie) => movie.id !== movieId));
        toast({
          title: "Movie deleted",
          description: "The movie has been successfully removed.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: (err as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveMovie = async (movie: Movie) => {
    try {
      if (dialogMode === "create") {
        const newMovie = await createMovie(movie);
        setMoviesData((prev) => [...prev, newMovie]); // Sử dụng newMovie từ backend
        toast({
          title: "Movie created",
          description: `"${newMovie.title}" has been added to the database.`,
        });
      } else if (dialogMode === "edit") {
        const updatedMovie = await updateMovie(movie);
        setMoviesData((prev) =>
          prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
        );
        toast({
          title: "Movie updated",
          description: `"${updatedMovie.title}" has been updated successfully.`,
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading movies...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Film className="mr-2 h-8 w-8" />
            Movie Management
          </h1>
          <Button onClick={handleCreateMovie}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Movie List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        {sortField === "title" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hidden lg:table-cell"
                      onClick={() => handleSort("customerRating")} // Sửa rating thành customerRating
                    >
                      <div className="flex items-center">
                        Rating
                        {sortField === "customerRating" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hidden lg:table-cell"
                      onClick={() => handleSort("releaseDate")}
                    >
                      <div className="flex items-center">
                        Release Date
                        {sortField === "releaseDate" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No movies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">
                          {movie.id}
                        </TableCell>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {movie.customerRating}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {movie.releaseDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewMovie(movie)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMovie(movie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMovie(movie.id)}
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
      </div>

      <MovieDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        movie={currentMovie}
        onSave={handleSaveMovie}
      />
    </>
  );
};

export default MovieList;
