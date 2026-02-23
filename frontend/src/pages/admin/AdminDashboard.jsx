import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    buses: 0,
    routes: 0,
    schedules: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const [busesRes, routesRes, schedulesRes] = await Promise.all([
          api.get("/api/admin/buses"),
          api.get("/api/admin/routes"),
          api.get("/api/schedules")
        ]);

        setStats({
          buses: busesRes.data?.length ?? 0,
          routes: routesRes.data?.length ?? 0,
          schedules: schedulesRes.data?.length ?? 0
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);
        alert("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <h1 className="pageTitle">Admin Dashboard</h1>
      <p className="pageSub">Quick admin overview and shortcuts</p>

      {loading ? (
        <div className="card cardPad">Loading...</div>
      ) : (
        <>
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            <div className="card cardPad">
              <div className="badge">Total Buses</div>
              <h2>{stats.buses}</h2>
            </div>

            <div className="card cardPad">
              <div className="badge">Total Routes</div>
              <h2>{stats.routes}</h2>
            </div>

            <div className="card cardPad">
              <div className="badge">Total Schedules</div>
              <h2>{stats.schedules}</h2>
            </div>
          </div>

          <div className="card cardPad" style={{ marginTop: 16 }}>
            <h3>Quick Actions</h3>

            <div className="row">
              <Link className="btn btnPrimary" to="/admin/add-bus">
                + Add Bus
              </Link>
              <Link className="btn btnPrimary" to="/admin/add-route">
                + Add Route
              </Link>
              <Link className="btn btnPrimary" to="/admin/add-schedule">
                + Add Schedule
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}