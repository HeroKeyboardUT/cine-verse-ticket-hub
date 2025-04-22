import showtimeModel from "../models/showtime.model.js";

class showtimeController {
  async getAllShowtimes(req, res) {
    try {
      const showtimes = await showtimeModel.getAllShowtimes();
      res.status(200).json(showtimes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving showtimes", error: error.message });
    }
  }

  async getShowtimeById(req, res) {
    try {
      const movieId = req.params.id;
      const showtimes = await showtimeModel.getShowtimeById(movieId);
      if (!showtimes || showtimes.length === 0) {
        return res
          .status(404)
          .json({ message: "No showtimes found for this movie" });
      }
      res.status(200).json(showtimes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving showtimes", error: error.message });
    }
  }

  async createShowtime(req, res) {
    try {
      await showtimeModel.createShowtime(req.body);
      res.status(201).json({ message: "Showtime created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating showtime", error: error.message });
    }
  }

  async updateShowtime(req, res) {
    try {
      await showtimeModel.updateShowtime(req.params.id, req.body);
      res.status(200).json({ message: "Showtime updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating showtime", error: error.message });
    }
  }

  async deleteShowtime(req, res) {
    try {
      await showtimeModel.deleteShowtime(req.params.id);
      res.status(200).json({ message: "Showtime deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting showtime", error: error.message });
    }
  }
}

export default new showtimeController();
