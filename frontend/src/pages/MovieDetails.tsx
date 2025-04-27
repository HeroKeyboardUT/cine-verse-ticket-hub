import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchMovieById,
  fetchMovies,
  type Movie,
  fetchMovieOrderCount,
} from "@/lib/data_movies";
import { fetchShowtimeByMovieId, type Showtime } from "@/lib/data_showtimes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Calendar,
  Star,
  Ticket,
  Play,
  MapPin,
  Film,
  Subtitles,
  Volume2,
} from "lucide-react";
import MovieGrid from "@/components/MovieGrid";

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMovie] = await Promise.all([fetchMovieById(movieId!)]);
        setMovie(fetchedMovie);

        const fetchedOrderCount = await fetchMovieOrderCount(movieId!);
        setOrderCount(fetchedOrderCount);

        // Fetch similar movies based on genre
        if (fetchedMovie && fetchedMovie.genre) {
          const allMovies = await fetchMovies();
          const filtered = allMovies
            .filter(
              (m) =>
                m.id !== fetchedMovie.id &&
                m.genre &&
                m.genre.some((g) => fetchedMovie.genre.includes(g))
            )
            .slice(0, 6); // Limit to 6 similar movies
          setSimilarMovies(filtered);
        }
      } catch (err) {
        setError("Failed to load movie or showtimes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      const fetchedShowtimes = await fetchShowtimeByMovieId(movieId);
      if (fetchedShowtimes.length !== 0) {
        setShowtimes(fetchedShowtimes);
      } else {
        setShowtimes([]);
      }
    };
    fetchShowtimes();
    // Fixed the missing dependency array to prevent infinite loop
  }, [movieId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5)), url(${movie?.backdropUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
            <div className="shrink-0 w-48 md:w-64 hidden md:block rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-transform duration-300">
              <img
                src={movie?.posterUrl || "/placeholder.svg"}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">
                  {movie?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm"
                  >
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">
                      {movie?.customerRating}/10.0
                    </span>
                  </Badge>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2 opacity-70" />
                    <span>{movie?.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    <span>{movie?.releaseDate}</span>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full border border-primary/20 transition-all hover:scale-105">
                    <Ticket className="h-4 w-4 mr-2 text-primary animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-gray-200 text-sm font-medium">
                        Đã có{" "}
                        {orderCount > 1000
                          ? `${(orderCount / 1000).toFixed(1)}k`
                          : orderCount}{" "}
                        lượt đặt vé xem phim này, còn bạn thì saoooo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {movie?.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to={`/movie/${movie?.id}/book`}>
                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2 rounded-full px-6"
                  >
                    <Ticket className="h-4 w-4" />
                    Đặt vé
                  </Button>
                </Link>
                <Link to={`/movie/${movie?.id}/watch`}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2 rounded-full px-6"
                  >
                    <Play className="h-4 w-4" />
                    Xem ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="showtimes" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full p-1">
            <TabsTrigger value="showtimes" className="rounded-full">
              Showtimes
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-full">
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="showtimes"
            className="py-6 animate-in fade-in duration-300"
          >
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Available Showtimes
            </h2>
            {showtimes.length === 0 ? (
              <EmptyShowtimes />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {showtimes.map((showtime) => (
                  <ShowtimeCard key={showtime.ShowTimeID} showtime={showtime} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="details"
            className="py-6 animate-in fade-in duration-300"
          >
            <div className="space-y-8 max-w-3xl mx-auto">
              <DetailSection title="Tóm tắt" content={movie?.description} />
              <DetailSection
                title="Diễn viên"
                content="Thông tin không khả dụng"
              />
              <DetailSection title="Đạo diễn" content={movie?.director} />
              <DetailSection
                title="Lượt đặt vé"
                content={`${orderCount} lượt`}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-24">
          <MovieGrid
            title={`Phim tương tự với thể loại ${movie?.genre?.join(", ")}`}
            movies={similarMovies}
            emptyMessage="Không tìm thấy phim tương tự"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const LoadingState = () => (
  <div className="container mx-auto px-4 py-16 space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4 max-w-lg" />
      <Skeleton className="h-6 w-1/2" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-2 pt-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20 mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-red-500 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-xl font-bold text-red-500 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-400">{message}</p>
    </div>
    <Button variant="outline" onClick={() => window.location.reload()}>
      Try Again
    </Button>
  </div>
);

const EmptyShowtimes = () => (
  <div className="text-center py-12 px-4">
    <div className="bg-primary/5 p-8 rounded-xl border border-primary/10 inline-block mb-6">
      <Calendar className="h-12 w-12 text-primary/60 mx-auto" />
    </div>
    <h3 className="text-xl font-medium mb-2">No Showtimes Available</h3>
    <p className="text-gray-400 max-w-md mx-auto">
      There are currently no scheduled showtimes for this movie. Please check
      back later.
    </p>
  </div>
);

const ShowtimeCard = ({ showtime }: { showtime: Showtime }) => {
  const startTime = new Date(showtime.StartTime);
  const endTime = new Date(showtime.EndTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{showtime.CinemaName}</h3>
            </div>
            <Badge variant="outline" className="bg-background/50">
              Room {showtime.RoomNumber}
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(startTime)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-semibold">
                  {formatTime(startTime)}
                </span>
                <span className="text-muted-foreground">-</span>
                <span className="text-muted-foreground">
                  {formatTime(endTime)}
                </span>
              </div>
            </div>
            <Badge variant="secondary">{showtime.RoomType}</Badge>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Film className="h-3.5 w-3.5" />
              <span>{showtime.Format}</span>
            </div>
            {showtime.Subtitle && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Subtitles className="h-3.5 w-3.5" />
                <span>Subtitles</span>
              </div>
            )}
            {showtime.Dub && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Dubbed</span>
              </div>
            )}
          </div>

          <Link to={`${showtime.ShowTimeID}/book`} className="block mt-4">
            <Button variant="default" className="w-full">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailSection = ({
  title,
  content,
}: {
  title: string;
  content?: string;
}) => (
  <div className="bg-card rounded-xl p-6 border border-border/50">
    <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
    <p className="text-gray-300 leading-relaxed">
      {content || "Information not available"}
    </p>
  </div>
);

export default MovieDetails;
