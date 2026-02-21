import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    alert("Logged out ✅");
    window.location.reload();
  };

  useEffect(() => {
    api.get("/api/schedules")
      .then((res) => setSchedules(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 15 }}>
        {token ? (
          <>
            <button onClick={() => navigate("/my-bookings")}>My Bookings</button>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      <h2>Available Bus Schedules</h2>

      {schedules.length === 0 && <p>No schedules available.</p>}

      {schedules.map((s) => (
        <div
          key={s._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: 6
          }}
        >
          <h3>
            {s.route?.from} → {s.route?.to}
          </h3>
          <p>Bus: {s.bus?.busName}</p>
          <p>Date: {s.travelDate}</p>
          <p>Time: {s.departureTime}</p>
          <p>Price: ${s.price}</p>
          <p>Available Seats: {s.availableSeats}</p>

          <button style={{ marginTop: 10 }} onClick={() => navigate(`/schedule/${s._id}`)}>
            Select Seats
          </button>
        </div>
      ))}
    </div>
  );
}