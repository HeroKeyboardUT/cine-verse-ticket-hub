import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieById, Movie } from "@/lib/data_movies";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, Ticket, Play } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import { set } from "date-fns";

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMovie = await fetchMovieById(movieId);
        // console.log("Fetched movie:", fetchedMovie);

        setMovie(fetchedMovie);
      } catch (err) {
        setError("Không thể tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) {
    return <p className="text-center py-16">Đang tải...</p>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Lỗi</h1>
        <p className="mt-4">{error}</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Không tìm thấy phim</h1>
        <p className="mt-4">Phim bạn đang tìm không tồn tại.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Quay lại trang chủ</Button>
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
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${movie.backdropUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
            <div className="shrink-0 w-52 hidden md:block rounded-lg overflow-hidden shadow-lg">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{movie.customerRating}/5</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>

              {/* <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-secondary/50 text-white text-xs px-2 py-1 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div> */}

              <p className="text-gray-300 mb-6 max-w-2xl">
                {movie.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to={`/movie/${movie.id}/book`}>
                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Đặt vé
                  </Button>
                </Link>
                <Link to={`/movie/${movie.id}/watch`}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2"
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

      {/* Content tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="showtimes" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="showtimes">Lịch chiếu</TabsTrigger>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="showtimes" className="py-6">
            <h2 className="text-xl font-semibold mb-6">Lịch chiếu khả dụng</h2>

            {movie.showtimes.map((showtime, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-medium mb-4">{showtime.date}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {showtime.times.map((time, timeIndex) => (
                    <Link
                      to={`/movie/${movie.id}/book?date=${showtime.date}&time=${time}`}
                      key={timeIndex}
                    >
                      <Button variant="outline" className="w-full">
                        {time}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent> */}

          <TabsContent value="details" className="py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
                <p className="text-gray-300">{movie.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Diễn viên</h3>
                <p className="text-gray-300">Thông tin không khả dụng</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Đạo diễn</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <MovieGrid title="Phim tương tự" movies={similarMovies} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
