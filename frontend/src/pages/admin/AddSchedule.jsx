import { useEffect, useState } from "react";
import api from "../../api";

export default function AddSchedule() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [price, setPrice] = useState("");

  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setErrorMsg("");
        setLoadingLists(true);

        const [bRes, rRes] = await Promise.all([
          api.get("/api/admin/buses"),
          api.get("/api/admin/routes")
        ]);

        setBuses(Array.isArray(bRes.data) ? bRes.data : []);
        setRoutes(Array.isArray(rRes.data) ? rRes.data : []);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load buses/routes";
        setErrorMsg(msg);
        console.error(err);
      } finally {
        setLoadingLists(false);
      }
    };

    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!busId || !routeId || !travelDate || !departureTime || price === "") {
      return alert("Fill all fields");
    }

    try {
      setLoadingCreate(true);
      setErrorMsg("");
      console.log({ busId, routeId, travelDate, departureTime, price });

     await api.post(
  "/api/admin/schedules",
  { busId, routeId, travelDate, departureTime, price },
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);

      alert("Schedule created ✅");
      setBusId("");
      setRouteId("");
      setTravelDate("");
      setDepartureTime("");
      setPrice("");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to create schedule";
      setErrorMsg(msg);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 520 }}>
      <h2>Add Schedule</h2>

      {loadingLists && <p>Loading buses & routes...</p>}

      {errorMsg && (
        <p style={{ color: "red" }}>
          <b>Error:</b> {errorMsg}
        </p>
      )}

      {!loadingLists && (buses.length === 0 || routes.length === 0) && (
        <p style={{ color: "orange" }}>
          Missing data: {buses.length === 0 ? "No buses" : ""}{" "}
          {routes.length === 0 ? "No routes" : ""}
          <br />
          Make sure you’re logged in as <b>admin</b> and you already created buses/routes.
        </p>
      )}

      <form onSubmit={handleCreate}>
        <div style={{ marginBottom: 10 }}>
          <label>Bus</label>
          <select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">-- Select Bus --</option>
            {buses.map((b) => (
              <option key={b._id} value={b._id}>
                {b.busName} ({b.busNumber}) - seats: {b.totalSeats}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Route</label>
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">-- Select Route --</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.from} → {r.to}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Travel Date</label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Departure Time</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button disabled={loadingCreate} style={{ padding: "8px 14px" }}>
          {loadingCreate ? "Saving..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}