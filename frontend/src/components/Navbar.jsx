import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    alert("Logged out ✅");
    navigate("/login");
  };

  return (
    <div className="navShell">
      <div className="navInner">
        <div className="navLeft">
          <div className="brand">Bus Ticket System</div>

          <div className="navLinks">
            <Link className="navLink" to="/">Home</Link>
            {token && <Link className="navLink" to="/my-bookings">My Bookings</Link>}
            {token && <Link className="navLink" to="/admin">Admin</Link>}
          </div>
        </div>

        <div className="navRight">
          {token ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <Link className="btn btnPrimary" to="/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}