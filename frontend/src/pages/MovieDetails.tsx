
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, Ticket, Play } from "lucide-react";
import { MovieController } from "@/controllers/MovieController";
import { Movie, ShowTime } from "@/models/MovieModel";
import MovieGrid from "@/components/MovieGrid";

interface FormattedShowtime {
  date: string;
  times: string[];
}

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<FormattedShowtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!movieId) {
          setError("Movie ID is missing");
          setLoading(false);
          return;
        }

        // Fetch movie details
        const movieData = await MovieController.getMovieById(movieId);
        setMovie(movieData);

        // Fetch showtimes
        const showtimesData = await MovieController.getShowtimes(movieId);
        
        // Process showtimes into formatted structure
        const groupedShowtimes = processShowtimes(showtimesData);
        setShowtimes(groupedShowtimes);

        // Fetch similar movies (in a real app, we would have an endpoint for this)
        // For now, let's fetch all movies and filter out the current one
        const allMovies = await MovieController.getAllMovies();
        setSimilarMovies(
          allMovies
            .filter(m => m.MovieID !== movieId)
            .slice(0, 6)
            .map(m => ({
              id: m.MovieID,
              title: m.Title,
              posterUrl: m.PosterURL,
              rating: m.CustomerRating / 2, // Convert from 10-scale to 5-scale
              genre: MovieController.getFormattedGenres(m.Genres)
            }))
        );

        setLoading(false);
      } catch (err) {
        console.error("Failed to load movie details:", err);
        setError("Failed to load movie details. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  // Process showtimes into a format grouped by date
  const processShowtimes = (showtimesData: ShowTime[]): FormattedShowtime[] => {
    const groupedByDate: Record<string, string[]> = {};

    showtimesData.forEach(showtime => {
      const date = new Date(showtime.StartTime).toLocaleDateString();
      const time = new Date(showtime.StartTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }

      groupedByDate[date].push(time);
    });

    return Object.keys(groupedByDate).map(date => ({
      date,
      times: groupedByDate[date]
    }));
  };

  if (loading) {
    return <p className="text-center py-16">Loading...</p>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Error</h1>
        <p className="mt-4">{error}</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Movie Not Found</h1>
        <p className="mt-4">The movie you're looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Movie backdrop with info */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${movie.PosterURL})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
            <div className="shrink-0 w-52 hidden md:block rounded-lg overflow-hidden shadow-lg">
              <img
                src={movie.PosterURL}
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {movie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{(movie.CustomerRating / 2).toFixed(1)}/5</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{MovieController.formatMovieTime(movie.Duration)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{new Date(movie.ReleaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {MovieController.getFormattedGenres(movie.Genres).map((genre, index) => (
                  <span
                    key={index}
                    className="bg-secondary/50 text-white text-xs px-2 py-1 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 mb-6 max-w-2xl">
                {movie.Description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to={`/movie/${movie.MovieID}/book`}>
                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Book Tickets
                  </Button>
                </Link>
                <Link to={`/movie/${movie.MovieID}/watch`}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="showtimes" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="showtimes" className="py-6">
            <h2 className="text-xl font-semibold mb-6">Available Showtimes</h2>

            {showtimes.length > 0 ? (
              showtimes.map((showtime, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">{showtime.date}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {showtime.times.map((time, timeIndex) => (
                      <Link
                        to={`/movie/${movie.MovieID}/book?date=${showtime.date}&time=${time}`}
                        key={timeIndex}
                      >
                        <Button variant="outline" className="w-full">
                          {time}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No showtimes available for this movie.</p>
            )}
          </TabsContent>

          <TabsContent value="details" className="py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                <p className="text-gray-300">{movie.Description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-400">Director:</div>
                  <div>{movie.Director || "Not available"}</div>
                  
                  <div className="text-gray-400">Studio:</div>
                  <div>{movie.Studio || "Not available"}</div>
                  
                  <div className="text-gray-400">Country:</div>
                  <div>{movie.Country || "Not available"}</div>
                  
                  <div className="text-gray-400">Language:</div>
                  <div>{movie.Language || "Not available"}</div>
                  
                  <div className="text-gray-400">Age Rating:</div>
                  <div>{movie.AgeRating || "Not rated"}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <MovieGrid title="Similar Movies" movies={similarMovies} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
