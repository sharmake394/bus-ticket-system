const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    distanceKm: { type: Number, default: 0 }
  },
  { timestamps: true }
);

RouteSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model("Route", RouteSchema);