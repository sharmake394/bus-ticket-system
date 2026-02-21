const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    seats: [{ type: Number, required: true }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "confirmed" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);