const express = require("express");
const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/bookings
 * Body: { scheduleId, seats[] }
 * Book seats
 */
router.post("/", protect, async (req, res) => {
  try {
    const { scheduleId, seats } = req.body;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Select at least one seat" });
    }

    const schedule = await Schedule.findById(scheduleId).populate("bus");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const totalSeats = schedule.bus.totalSeats;

    // Validate seats
    for (const seat of seats) {
      if (seat < 1 || seat > totalSeats) {
        return res.status(400).json({ message: `Invalid seat number: ${seat}` });
      }
      if (schedule.bookedSeats.includes(seat)) {
        return res.status(400).json({ message: `Seat ${seat} already booked` });
      }
    }

    const totalPrice = seats.length * schedule.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      schedule: scheduleId,
      seats,
      totalPrice,
      status: "confirmed"
    });

    // Update booked seats
    schedule.bookedSeats.push(...seats);
    await schedule.save();

    res.status(201).json({
      message: "Booking successful",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/bookings/my
 * View logged-in user's bookings
 */
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "schedule",
        populate: [{ path: "bus" }, { path: "route" }]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel a booking and free seats
 */
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner can cancel
    if (String(booking.user) !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Free booked seats
    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      schedule.bookedSeats = schedule.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await schedule.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;