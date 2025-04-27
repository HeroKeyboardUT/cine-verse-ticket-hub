import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import MovieGrid from "@/components/MovieGrid";
import { fetchMovies, Movie } from "@/lib/data_movies";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu phim từ API khi component được mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const fetchedMovies = await fetchMovies();
        console.log(fetchedMovies); // Debugging line to check fetched movies
        setMovies(fetchedMovies);
      } catch (err) {
        setError("Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Xử lý dữ liệu phim
  const currentlyShowing = movies.filter((movie) => movie.isShowing == true);
  const upcomingMovies = movies.filter((movie) => movie.isShowing != true);

  // Chọn phim nổi bật từ phim đang chiếu (nếu có), nếu không thì từ toàn bộ danh sách
  const featuredMovie =
    currentlyShowing.length > 0 ? currentlyShowing[0] : movies[0] || null;

  // Hiển thị khi đang tải hoặc lỗi
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {featuredMovie && <Hero movie={featuredMovie} />}
      <div className="container mx-auto px-4 py-8">
        <MovieGrid title="Now Showing" movies={currentlyShowing} />
        <MovieGrid title="Coming Soon" movies={upcomingMovies} />
      </div>
    </div>
  );
};

export default Index;
