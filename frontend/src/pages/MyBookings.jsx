import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadBookings();
    // eslint-disable-next-line
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking cancelled ✅");
      loadBookings(); // refresh list
    } catch (err) {
      alert(err?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("/")}>← Back</button>

      <h2 style={{ marginTop: 10 }}>My Bookings</h2>

      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "12px",
            borderRadius: "8px"
          }}
        >
          <p><b>Booking ID:</b> {b._id}</p>
          <p><b>Status:</b> {b.status}</p>
          <p><b>Seats:</b> {b.seats?.join(", ")}</p>
          <p><b>Total Price:</b> ${b.totalPrice}</p>

          <hr />

          <p><b>Route:</b> {b.schedule?.route?.from} → {b.schedule?.route?.to}</p>
          <p><b>Bus:</b> {b.schedule?.bus?.busName}</p>
          <p><b>Date:</b> {b.schedule?.travelDate} | <b>Time:</b> {b.schedule?.departureTime}</p>

          {b.status !== "cancelled" && (
            <button
              onClick={() => cancelBooking(b._id)}
              style={{ marginTop: 10, padding: "8px 14px", cursor: "pointer" }}
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
}