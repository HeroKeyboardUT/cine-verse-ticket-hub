// @/components/admin/MovieDialog.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Movie, createMovie, updateMovie } from "@/lib/data";
import { toast } from "@/hooks/use-toast";

interface MovieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  movie: Movie | null;
  onSave?: (movie: Movie) => void;
}

const MovieDialog: React.FC<MovieDialogProps> = ({
  isOpen,
  onOpenChange,
  mode,
  movie,
  onSave,
}) => {
  const [formData, setFormData] = useState<Movie>(
    movie || {
      id: "",
      title: "",
      releaseDate: "",
      duration: 0,
      language: "",
      description: "",
      posterUrl: "",
      ageRating: "",
      studio: "",
      country: "",
      director: "",
      customerRating: 0,
      genre: [""],
    }
  );
  const [genreInput, setGenreInput] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof Movie, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData(movie);
      setGenreInput(movie.genre.join(", "));
    } else {
      setFormData({
        id: "",
        title: "",
        releaseDate: "",
        duration: 0,
        language: "",
        description: "",
        posterUrl: "",
        ageRating: "",
        studio: "",
        country: "",
        director: "",
        customerRating: 0,
        genre: [""],
      });
      setGenreInput("");
    }
    setErrors({});
  }, [movie, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "duration") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : parseInt(value),
      });
    } else if (name === "customerRating") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenreInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const genres = [
      ...new Set(
        genreInput
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g !== "")
      ),
    ];

    const updatedFormData = {
      ...formData,
      genre: genres.length > 0 ? genres : [""],
    };

    setFormData(updatedFormData);
    const newErrors: Partial<Record<keyof Movie, string>> = {};

    if (mode === "create" && !updatedFormData.id) {
      newErrors.id = "Movie ID is required";
    } else if (mode === "create" && !/^MOV\d{3}$/.test(updatedFormData.id)) {
      newErrors.id = "Movie ID must be in format MOVxxx (e.g., MOV001)";
    }

    if (!updatedFormData.title) newErrors.title = "Title is required";
    if (!updatedFormData.releaseDate)
      newErrors.releaseDate = "Release Date is required";
    if (!updatedFormData.duration || updatedFormData.duration <= 0) {
      newErrors.duration = "Duration must be a positive number (in minutes)";
    }

    if (
      updatedFormData.customerRating !== undefined &&
      (updatedFormData.customerRating < 0 ||
        updatedFormData.customerRating > 9.99)
    ) {
      newErrors.customerRating = "Rating must be between 0.00 and 9.99";
    }

    if (genres.length === 0) {
      newErrors.genre = "At least one genre is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      let savedMovie: Movie;
      if (mode === "create") {
        savedMovie = await createMovie(updatedFormData);
      } else if (mode === "edit") {
        savedMovie = await updateMovie(updatedFormData);
      } else {
        setIsSubmitting(false);
        return;
      }

      if (onSave) {
        onSave(savedMovie);
      }

      toast({
        title: mode === "create" ? "Movie created" : "Movie updated",
        description: `"${savedMovie.title}" has been ${
          mode === "create" ? "added to" : "updated in"
        } the database.`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while saving the movie.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === "view";
  const isEditMode = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add New Movie"
              : mode === "edit"
              ? "Edit Movie"
              : "Movie Details"}
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
          <div className="space-y-2">
            <Label htmlFor="id">Movie ID</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              readOnly={isReadOnly || isEditMode}
              placeholder="e.g., MOV021"
              className={errors.id ? "border-red-500" : ""}
            />
            {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
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
                className={errors.releaseDate ? "border-red-500" : ""}
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-sm">{errors.releaseDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              readOnly={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posterUrl">Poster URL</Label>
              <Input
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                name="language"
                value={formData.language || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="e.g., English"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerRating">
                Customer Rating (0.00-9.99)
              </Label>
              <Input
                id="customerRating"
                name="customerRating"
                type="number"
                min="0"
                max="9.99"
                step="0.01"
                value={formData.customerRating || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={errors.customerRating ? "border-red-500" : ""}
              />
              {errors.customerRating && (
                <p className="text-red-500 text-sm">{errors.customerRating}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre (comma separated)</Label>
              <Input
                id="genre"
                value={genreInput}
                onChange={handleGenreChange}
                placeholder="Action, Drama, Comedy"
                readOnly={isReadOnly}
                className={errors.genre ? "border-red-500" : ""}
              />
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRating">Age Rating</Label>
              <Input
                id="ageRating"
                name="ageRating"
                value={formData.ageRating || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="e.g., PG-13"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio">Studio</Label>
              <Input
                id="studio"
                name="studio"
                value={formData.studio || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="e.g., Warner Bros"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="e.g., USA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                name="director"
                value={formData.director || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="e.g., Christopher Nolan"
              />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Movie"
                  : "Update Movie"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDialog;
