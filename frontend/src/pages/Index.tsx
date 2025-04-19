import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import MovieGrid from "@/components/MovieGrid";
import { fetchMovies } from "@/lib/data";
import { Movie } from "@/lib/data";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu phim từ API khi component được mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const fetchedMovies = await fetchMovies();
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
  const featuredMovie = movies[0] || null; // Lấy phim thứ 2 làm featured (hoặc xử lý khác nếu cần)
  const inTheaters = movies; // Phim đang chiếu
  const comingSoon = [...movies.slice(3), ...movies.slice(0, 3)]; // Demo: Lấy một số phim làm coming soon

  // Hiển thị khi đang tải hoặc lỗi
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {featuredMovie && <Hero movie={featuredMovie} />}
      <div className="container mx-auto px-4 py-8">
        <MovieGrid title="Now Showing" movies={inTheaters} />
        <MovieGrid title="Coming Soon" movies={comingSoon} />
      </div>
    </div>
  );
};

export default Index;
