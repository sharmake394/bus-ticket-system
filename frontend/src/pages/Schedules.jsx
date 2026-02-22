import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/schedules")
      .then((res) => setSchedules(res.data))
      .catch((err) => console.error("Failed to load schedules:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading schedules...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Bus Schedules</h2>

      {schedules.length === 0 && (
        <p>No schedules available at the moment.</p>
      )}

      {schedules.map((s) => (
        <div
          key={s._id}
          style={{
            border: "1px solid #ccc",
            margin: "12px 0",
            padding: "12px",
            borderRadius: 6,
          }}
        >
          <h3>
            {s.route?.from || "Unknown"} → {s.route?.to || "Unknown"}
          </h3>

          <p>
            <b>Bus:</b> {s.bus?.busName || "N/A"}
          </p>
          <p>
            <b>Date:</b> {s.travelDate}
          </p>
          <p>
            <b>Time:</b> {s.departureTime}
          </p>
          <p>
            <b>Price:</b> ${s.price}
          </p>
          <p>
            <b>Available Seats:</b> {s.availableSeats}
          </p>

          <button
            style={{ marginTop: 10 }}
            onClick={() => navigate(`/schedule/${s._id}`)}
          >
            Select Seats
          </button>
        </div>
      ))}
    </div>
  );
}