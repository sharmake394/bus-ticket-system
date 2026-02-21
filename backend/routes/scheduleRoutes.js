const express = require("express");
const Schedule = require("../models/Schedule");

const router = express.Router();

/**
 * GET /api/schedules
 * Query filters (optional):
 *   ?from=Mogadishu&to=Afgooye&date=2026-02-20
 */
router.get("/", async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // populate bus + route data
    let query = Schedule.find()
      .populate("bus")   // brings bus data
      .populate("route") // brings route data
      .sort({ travelDate: 1, departureTime: 1 });

    let schedules = await query;

    // Optional filtering AFTER populate (easy + works fine for your project)
    if (from) {
      schedules = schedules.filter(
        (s) => s.route?.from?.toLowerCase() === from.toLowerCase()
      );
    }
    if (to) {
      schedules = schedules.filter(
        (s) => s.route?.to?.toLowerCase() === to.toLowerCase()
      );
    }
    if (date) {
      schedules = schedules.filter((s) => s.travelDate === date);
    }

    // Add availableSeats count in response
    schedules = schedules.map((s) => {
      const totalSeats = s.bus?.totalSeats || 0;
      const booked = s.bookedSeats?.length || 0;

      return {
        ...s.toObject(),
        availableSeats: Math.max(totalSeats - booked, 0),
      };
    });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/schedules/:id
 * Single schedule details + available seats
 */
router.get("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("bus")
      .populate("route");

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    const totalSeats = schedule.bus?.totalSeats || 0;
    const bookedSet = new Set(schedule.bookedSeats || []);
    const availableSeats = [];

    for (let seat = 1; seat <= totalSeats; seat++) {
      if (!bookedSet.has(seat)) availableSeats.push(seat);
    }

    res.json({
      ...schedule.toObject(),
      availableSeatsCount: availableSeats.length,
      availableSeats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;