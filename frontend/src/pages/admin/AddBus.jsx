import { useState } from "react";
import api from "../../api";

export default function AddBus() {
  const [busNumber, setBusNumber] = useState("");
  const [busName, setBusName] = useState("");
  const [totalSeats, setTotalSeats] = useState(40);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/admin/buses", {
        busNumber,
        busName,
        totalSeats
      });

      alert("Bus added successfully ✅");
      setBusNumber("");
      setBusName("");
      setTotalSeats(40);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Add Bus</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Bus Name"
          value={busName}
          onChange={(e) => setBusName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="number"
          placeholder="Total Seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button disabled={loading} style={{ padding: "8px 14px" }}>
          {loading ? "Saving..." : "Add Bus"}
        </button>
      </form>
    </div>
  );
}