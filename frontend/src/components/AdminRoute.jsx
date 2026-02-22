import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [allowed, setAllowed] = useState(null); // null = loading

  useEffect(() => {
    const check = async () => {
      try {
        if (!token) return setAllowed(false);
        const res = await api.get("/api/auth/me");
        setAllowed(res.data?.user?.role === "admin");
      } catch {
        setAllowed(false);
      }
    };
    check();
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (allowed === null) return <div style={{ padding: 20 }}>Checking access...</div>;
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}