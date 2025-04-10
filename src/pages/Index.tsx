
import React from 'react';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import { movies } from '@/lib/data';

const Index = () => {
  // Use first movie as featured movie for the hero
  const featuredMovie = movies[0];
  
  // Movies currently in theaters
  const inTheaters = movies;
  
  // Coming soon movies (for demo, we'll reuse some movies)
  const comingSoon = movies.slice(3).concat(movies.slice(0, 3));

  return (
    <div>
      <Hero movie={featuredMovie} />
      <div className="container mx-auto px-4 py-8">
        <MovieGrid title="Now Showing" movies={inTheaters} />
        <MovieGrid title="Coming Soon" movies={comingSoon} />
      </div>
    </div>
  );
};

export default Index;
