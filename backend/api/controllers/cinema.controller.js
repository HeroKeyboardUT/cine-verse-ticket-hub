import cinemaModel from "../models/cinema.model.js";

class cinemaController {
  async getAllCinemas(req, res) {
    try {
      const cinemas = await cinemaModel.getAllCinemas();
      res.status(200).json(cinemas);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving cinemas", error: error.message });
    }
  }

  async getCinemaById(req, res) {
    try {
      const cinema = await cinemaModel.getCinemaById(req.params.id);
      if (!cinema) return res.status(404).json({ message: "Cinema not found" });
      res.status(200).json(cinema);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving cinema", error: error.message });
    }
  }

  async createCinema(req, res) {
    try {
      await cinemaModel.createCinema(req.body);
      res.status(201).json({ message: "Cinema created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating cinema", error: error.message });
    }
  }

  async updateCinema(req, res) {
    try {
      await cinemaModel.updateCinema(req.params.id, req.body);
      res.status(200).json({ message: "Cinema updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating cinema", error: error.message });
    }
  }

  async deleteCinema(req, res) {
    try {
      await cinemaModel.deleteCinema(req.params.id);
      res.status(200).json({ message: "Cinema deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting cinema", error: error.message });
    }
  }
}

export default new cinemaController();
