import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Schedules from "./pages/Schedules";
import SeatBooking from "./pages/SeatBooking";
import BookingSuccess from "./pages/BookingSuccess";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";

import AddBus from "./pages/admin/AddBus";
import AddRoute from "./pages/admin/AddRoute";
import AddSchedule from "./pages/admin/AddSchedule";
import NotFound from "./pages/Notfound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Schedules />} />
        <Route path="/schedule/:id" element={<SeatBooking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-bus"
          element={
            <AdminRoute>
              <AddBus />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-route"
          element={
            <AdminRoute>
              <AddRoute />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-schedule"
          element={
            <AdminRoute>
              <AddSchedule />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;