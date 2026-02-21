import { useState } from "react";
import api from "../../api";

export default function AddRoute() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        from: from.trim(),
        to: to.trim(),
      };

      // ✅ only send distanceKm if user typed it
      if (distanceKm !== "") {
        payload.distanceKm = Number(distanceKm);
      }

      await api.post("/api/admin/routes", payload);

      alert("Route added successfully ✅");
      setFrom("");
      setTo("");
      setDistanceKm("");
    } catch (err) {
      // ✅ show the real backend message
      alert(err?.response?.data?.message || err.message || "Failed to add route");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h2>Add Route</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="From (e.g. Mogadishu)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="To (e.g. Afgooye)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="number"
          placeholder="Distance (km) — optional"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button disabled={loading} style={{ padding: "8px 14px" }}>
          {loading ? "Saving..." : "Add Route"}
        </button>
      </form>
    </div>
  );
}