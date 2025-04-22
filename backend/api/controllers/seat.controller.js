import SeatModel from "../models/seat.model.js";

class SeatController {
  async getAllSeats(req, res) {
    try {
      const seats = await SeatModel.getAllSeats();
      res.status(200).json(seats);
    } catch (error) {
      console.error("Error fetching seats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSeatById(req, res) {
    const { id } = req.params;
    try {
      const seat = await SeatModel.getSeatById(id);
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.status(200).json(seat);
    } catch (error) {
      console.error("Error fetching seat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSeatByShowTimeId(req, res) {
    const { showTimeId } = req.params;
    try {
      const seats = await SeatModel.getSeatByShowTimeId(showTimeId);
      if (!seats) {
        return res.status(404).json({ error: "Seats not found" });
      }
      res.status(200).json(seats);
    } catch (error) {
      console.error("Error fetching seats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createSeat(req, res) {
    try {
      await SeatModel.createSeat(req.body);
      res.status(201).json({ message: "Seat created successfully" });
    } catch (error) {
      console.error("Error creating seat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default SeatController;
