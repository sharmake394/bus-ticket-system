const express = require("express");
const Schedule = require("../models/Schedule");

const router = express.Router();

/**
 * GET /api/schedules
 * Public: list schedules with bus + route
 */
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("bus")
      .populate("route")
      .sort({ travelDate: 1, departureTime: 1 });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/schedules/:id
 * Public: get one schedule with bus + route
 */
router.get("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("bus")
      .populate("route");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;