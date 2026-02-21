const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    busName: { type: String, required: true },
    totalSeats: { type: Number, required: true, default: 40 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", BusSchema);