const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    travelDate: { type: String, required: true },     // e.g. "2026-02-20"
    departureTime: { type: String, required: true },  // e.g. "08:30"
    price: { type: Number, required: true },
    bookedSeats: [{ type: Number, default: [] }]
  },
  { timestamps: true }
);

ScheduleSchema.index(
  { bus: 1, route: 1, travelDate: 1, departureTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Schedule", ScheduleSchema);