import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function SeatBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/schedules/${id}`)
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error("Failed to load schedule:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const bookedSeats = useMemo(
    () => new Set(schedule?.bookedSeats || []),
    [schedule]
  );

  const toggleSeat = (seatNum) => {
    if (bookedSeats.has(seatNum)) return;

    setSelected((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const bookNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return navigate("/login");
      }

      const res = await api.post("/api/bookings", {
        scheduleId: id,
        seats: selected,
      });

      alert(res.data?.message || "Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!schedule) {
    return (
      <div className="card">
        <p>Schedule not found</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const totalSeats = Number(schedule.bus?.totalSeats || 0);
  const price = Number(schedule.price || 0);

  return (
    <div>
      <button className="btn" onClick={() => navigate("/")}>← Back</button>

      <h2 className="page-title">
        {schedule.route?.from || "Unknown"} → {schedule.route?.to || "Unknown"}
      </h2>

      <div className="card">
        <div className="muted">
          <div><b>Bus:</b> {schedule.bus?.busName || "N/A"}</div>
          <div><b>Date:</b> {schedule.travelDate} • <b>Time:</b> {schedule.departureTime}</div>
          <div><b>Price per seat:</b> ${price}</div>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Select Seats</h3>

      {totalSeats <= 0 ? (
        <div className="card"><p className="muted">No seat data available for this bus.</p></div>
      ) : (
        <div className="grid-seats">
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
            const isBooked = bookedSeats.has(seat);
            const isSelected = selected.includes(seat);

            const cls =
              "seat " +
              (isBooked ? "seat-booked" : "") +
              (isSelected ? " seat-selected" : "");

            return (
              <button
                key={seat}
                className={cls}
                onClick={() => toggleSeat(seat)}
                disabled={isBooked}
                title={isBooked ? "Booked" : "Available"}
              >
                {seat}
              </button>
            );
          })}
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="muted">
          <div><b>Selected:</b> {selected.join(", ") || "None"}</div>
          <div><b>Total:</b> ${selected.length * price}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" disabled={selected.length === 0} onClick={bookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}