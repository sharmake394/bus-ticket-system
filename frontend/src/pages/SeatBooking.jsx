import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function SeatBooking() {
  const { id } = useParams(); // schedule id
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

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!schedule) {
    return (
      <div style={{ padding: 20 }}>
        <p>Schedule not found</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const totalSeats = Number(schedule.bus?.totalSeats || 0);
  const price = Number(schedule.price || 0);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("/")}>← Back</button>

      <h2 style={{ marginTop: 10 }}>
        {schedule.route?.from || "Unknown"} → {schedule.route?.to || "Unknown"}
      </h2>

      <p>
        <b>Bus:</b> {schedule.bus?.busName || "N/A"}
      </p>
      <p>
        <b>Date:</b> {schedule.travelDate} | <b>Time:</b>{" "}
        {schedule.departureTime}
      </p>
      <p>
        <b>Price per seat:</b> ${price}
      </p>

      <h3>Select Seats</h3>

      {totalSeats <= 0 ? (
        <p>No seat data available for this bus.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 45px)",
            gap: "8px",
          }}
        >
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
            const isBooked = bookedSeats.has(seat);
            const isSelected = selected.includes(seat);

            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                disabled={isBooked}
                style={{
                  padding: "8px",
                  cursor: isBooked ? "not-allowed" : "pointer",
                  border: "1px solid #333",
                  background: isBooked
                    ? "#ddd"
                    : isSelected
                    ? "#90ee90"
                    : "white",
                }}
              >
                {seat}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <p>
          <b>Selected:</b> {selected.join(", ") || "None"}
        </p>
        <p>
          <b>Total:</b> ${selected.length * price}
        </p>

        <button disabled={selected.length === 0} onClick={bookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
}