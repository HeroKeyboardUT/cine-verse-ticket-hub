import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    customerRating: number;
    duration: string;
    genre: string[];
  };
}
const handleClick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movie/${movie.id}`} onClick={handleClick}>
      <Card className="overflow-hidden bg-card border-0 rounded-lg movie-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded-md flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            {movie.customerRating}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-bold text-white truncate">{movie.title}</h3>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {movie.duration}
            </div>
            <span>{movie.genre[0]}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
