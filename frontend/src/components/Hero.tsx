import React from "react";
import { Clock, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroProps {
  movie: {
    id: string;
    title: string;
    description: string;
    backdropUrl: string;
    rating: number;
    duration: string;
    releaseDate: string;
    genre: string[];
  };
}

const Hero = ({ movie }: HeroProps) => {
  return (
    <div
      className="relative h-[70vh] bg-cover bg-center flex items-end"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url(${movie.backdropUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{movie.rating}/10.0</span>
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

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((genre, index) => (
              <span
                key={index}
                className="bg-secondary/50 text-white text-xs px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-300 mb-6 line-clamp-3">{movie.description}</p>

          <div className="flex flex-wrap gap-3">
            <Link to={`/movie/${movie.id}`}>
              <Button variant="default" size="lg">
                Movie Details
              </Button>
            </Link>
            <Link to={`/movie/${movie.id}/book`}>
              <Button variant="secondary" size="lg">
                Book Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
