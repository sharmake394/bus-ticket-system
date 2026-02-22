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

  if (loading) return <div>Loading schedules...</div>;

  return (
    <div>
      <h2 className="page-title">Available Bus Schedules</h2>
      <p className="muted">Choose a schedule, then pick seats and book.</p>

      {schedules.length === 0 && (
        <div className="card">
          <p className="muted">No schedules available at the moment.</p>
        </div>
      )}

      {schedules.map((s) => (
        <div key={s._id} className="card">
          <h3>
            {s.route?.from || "Unknown"} → {s.route?.to || "Unknown"}
          </h3>

          <div className="muted">
            <div><b>Bus:</b> {s.bus?.busName || "N/A"}</div>
            <div><b>Date:</b> {s.travelDate} • <b>Time:</b> {s.departureTime}</div>
            <div><b>Price:</b> ${s.price} • <b>Available Seats:</b> {s.availableSeats}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate(`/schedule/${s._id}`)}>
              Select Seats
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}