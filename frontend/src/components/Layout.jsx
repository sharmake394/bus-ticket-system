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
      <div className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">Bus Ticket System</Link>

          <Link to="/">Home</Link>

          {token && <Link to="/my-bookings">My Bookings</Link>}

          {me?.role === "admin" && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/add-bus">Add Bus</Link>
              <Link to="/admin/add-route">Add Route</Link>
              <Link to="/admin/add-schedule">Add Schedule</Link>
            </>
          )}

          <div className="spacer" />

          {token ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <Link className="btn" to="/login">Login</Link>
          )}
        </div>
      </div>

      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}