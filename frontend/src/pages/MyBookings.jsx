import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/my");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      await api.patch(`/api/bookings/${bookingId}/cancel`, {});
      alert("Booking cancelled ✅");
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={() => navigate("/")}>← Back</button>
      <h2 className="page-title">My Bookings</h2>

      {bookings.length === 0 && (
        <div className="card">
          <p className="muted">No bookings found.</p>
        </div>
      )}

      {bookings.map((b) => (
        <div key={b._id} className="card">
          <div className="muted">
            <div><b>Status:</b> {b.status}</div>
            <div><b>Seats:</b> {b.seats?.join(", ") || "N/A"}</div>
            <div><b>Total Price:</b> ${b.totalPrice}</div>
            <hr style={{ borderColor: "rgba(255,255,255,.12)" }} />
            <div><b>Route:</b> {b.schedule?.route?.from || "Unknown"} → {b.schedule?.route?.to || "Unknown"}</div>
            <div><b>Bus:</b> {b.schedule?.bus?.busName || "N/A"}</div>
            <div><b>Date:</b> {b.schedule?.travelDate} • <b>Time:</b> {b.schedule?.departureTime}</div>
          </div>

          {b.status !== "cancelled" && (
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-danger" onClick={() => cancelBooking(b._id)}>
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}