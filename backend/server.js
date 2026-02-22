const express = require("express");
console.log("✅ THIS server.js is running");
const mongoose = require("mongoose");
const bookingRoutes = require("./routes/bookingRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const allowedOrigins = [ "https://bus-ticketsystem.netlify.app",
  "http://localhost:5173" // for local dev (optional but recommended)
];




const app = express();

app.use(cors({
  origin: [
    "https://bus-ticketsystem.netlify.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Bus Ticket System API is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌:", err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
});