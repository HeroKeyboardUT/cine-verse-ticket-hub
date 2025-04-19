
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movies } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

const WatchMovie = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const movie = movies.find(m => m.id === movieId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
      </div>
    );
  }

  // Mock video controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  return (
    <div className="bg-black min-h-screen">
      {/* Video player */}
      <div className="relative aspect-video max-h-[80vh] w-full">
        {/* Video placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <button 
                onClick={togglePlay}
                className="h-20 w-20 bg-primary/80 rounded-full flex items-center justify-center transition hover:bg-primary"
              >
                <Play className="h-10 w-10 text-white" />
              </button>
            </div>
          )}
        </div>
        
        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex flex-col gap-2">
            <div className="w-full bg-gray-700/50 h-1 rounded overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-gray-300">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <span className="text-sm text-white">00:00 / {movie.duration}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-300">
                  <Settings className="h-5 w-5" />
                </button>
                <button className="text-white hover:text-gray-300">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Link to={`/movie/${movie.id}`} className="flex items-center text-gray-400 hover:text-white mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to movie details
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        <p className="text-gray-400 mb-6">{movie.description}</p>
        
        <div className="flex space-x-4">
          <Button variant="outline" onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="secondary">Add to Watchlist</Button>
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Movie Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-gray-400 text-sm">Release Date</h3>
              <p>{movie.releaseDate}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Duration</h3>
              <p>{movie.duration}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Genre</h3>
              <p>{movie.genre.join(', ')}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Rating</h3>
              <p>{movie.rating}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
