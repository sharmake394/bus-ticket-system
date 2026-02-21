import { Routes, Route } from "react-router-dom";
import Schedules from "./pages/Schedules";
import SeatBooking from "./pages/SeatBooking";
import BookingSuccess from "./pages/BookingSuccess";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import AddBus from "./pages/admin/AddBus";
import AddRoute from "./pages/admin/AddRoute";
import AddSchedule from "./pages/admin/AddSchedule";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Schedules />} />
      <Route path="/schedule/:id" element={<SeatBooking />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/admin/add-bus" element={<AddBus />} />
      <Route path="/admin/add-route" element={<AddRoute />} />
      <Route path="/admin/add-schedule" element={<AddSchedule />} />
      
    </Routes>
  );
}

export default App;