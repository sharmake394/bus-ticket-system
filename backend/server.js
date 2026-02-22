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

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps / curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Bus Ticket System API is running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});