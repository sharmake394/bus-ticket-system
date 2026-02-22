const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ TEST
router.get("/ping", (req, res) => {
  res.send("admin routes working ✅");
});

// ✅ GET ALL BUSES
router.get("/buses", protect, admin, async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL ROUTES
router.get("/routes", protect, admin, async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ CREATE BUS
router.post("/buses", protect, admin, async (req, res) => {
  try {
    const { busName, totalSeats } = req.body;

    if (!busName || !totalSeats) {
      return res.status(400).json({ message: "busName and totalSeats are required" });
    }

    const bus = await Bus.create({
      busName,
      totalSeats: Number(totalSeats),
    });

    res.status(201).json({ message: "Bus created ✅", bus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CREATE ROUTE
router.post("/routes", protect, admin, async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to are required" });
    }

    const route = await Route.create({ from, to });

    res.status(201).json({ message: "Route created ✅", route });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST create schedule
router.post("/schedules", protect, admin, async (req, res) => {
  try {
    const { busId, routeId, travelDate, departureTime, price } = req.body;

    if (!busId || !routeId || !travelDate || !departureTime || price === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const schedule = await Schedule.create({
      bus: busId,
      route: routeId,
      travelDate,
      departureTime,
      price,
      bookedSeats: []
    });

    // return populated version (nice for frontend)
    const full = await Schedule.findById(schedule._id)
      .populate("bus")
      .populate("route");

    res.status(201).json({ message: "Schedule created", schedule: full });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;