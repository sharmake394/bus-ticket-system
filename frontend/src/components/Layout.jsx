import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function Layout() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadMe = async () => {
      try {
        if (!token) return setMe(null);
        const res = await api.get("/api/auth/me");
        setMe(res.data?.user || null);
      } catch {
        // token invalid/expired
        localStorage.removeItem("token");
        setMe(null);
      }
    };
    loadMe();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setMe(null);
    navigate("/");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          padding: 14,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/" style={{ fontWeight: "bold" }}>Home</Link>

        {token && <Link to="/my-bookings">My Bookings</Link>}

        {me?.role === "admin" && (
          <>
            <Link to="/admin/add-bus">Add Bus</Link>
            <Link to="/admin/add-route">Add Route</Link>
            <Link to="/admin/add-schedule">Add Schedule</Link>
          </>
        )}

        <div style={{ marginLeft: "auto" }}>
          {token ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}