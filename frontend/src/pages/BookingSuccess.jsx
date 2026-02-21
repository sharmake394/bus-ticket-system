import { useLocation, Link } from "react-router-dom";

export default function BookingSuccess() {
  const { state } = useLocation(); // we will pass booking data here

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ Booking Confirmed</h2>

      {!state?.booking ? (
        <p>
          Booking details not found. <Link to="/">Go back home</Link>
        </p>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: 15, marginTop: 10 }}>
          <p><b>Booking ID:</b> {state.booking._id}</p>
          <p><b>Seats:</b> {state.booking.seats?.join(", ")}</p>
          <p><b>Total Price:</b> ${state.booking.totalPrice}</p>
          <p><b>Status:</b> Confirmed ✅</p>

          <div style={{ marginTop: 15 }}>
            <Link to="/">⬅ Back to schedules</Link>
          </div>
        </div>
      )}
    </div>
  );
}