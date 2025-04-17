
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Movie } from '@/lib/data';

interface MovieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  movie: Movie | null;
  onSave: (movie: Movie) => void;
}

// Template for a new movie
const emptyMovie: Movie = {
  id: '',
  title: '',
  description: '',
  posterUrl: '',
  backdropUrl: '',
  rating: 0,
  duration: '',
  genre: [''],
  releaseDate: '',
  showtimes: [
    {
      date: '',
      times: ['']
    }
  ]
};

const MovieDialog: React.FC<MovieDialogProps> = ({
  isOpen,
  onOpenChange,
  mode,
  movie,
  onSave
}) => {
  const [formData, setFormData] = useState<Movie>(movie || emptyMovie);
  
  useEffect(() => {
    if (movie) {
      setFormData(movie);
    } else {
      setFormData(emptyMovie);
    }
  }, [movie, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      genre: e.target.value.split(',').map(g => g.trim())
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Movie' : mode === 'edit' ? 'Edit Movie' : 'Movie Details'}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                readOnly={isReadOnly}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                readOnly={isReadOnly}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              readOnly={isReadOnly}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posterUrl">Poster URL</Label>
              <Input
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                readOnly={isReadOnly}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backdropUrl">Backdrop URL</Label>
              <Input
                id="backdropUrl"
                name="backdropUrl"
                value={formData.backdropUrl}
                onChange={handleChange}
                readOnly={isReadOnly}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                readOnly={isReadOnly}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 2h 15m"
                readOnly={isReadOnly}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre (comma separated)</Label>
              <Input
                id="genre"
                value={formData.genre.join(', ')}
                onChange={handleGenreChange}
                placeholder="Action, Drama, Comedy"
                readOnly={isReadOnly}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trailerUrl">Trailer URL (optional)</Label>
            <Input
              id="trailerUrl"
              name="trailerUrl"
              value={formData.trailerUrl || ''}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          
          {!isReadOnly && (
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Create Movie' : 'Update Movie'}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDialog;
