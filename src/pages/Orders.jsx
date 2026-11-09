import { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { Empty, ErrorBox, Loader } from "../components/Loader";

export default function Orders() {
  const { user } = useAuth();
  const { loadCart } = useShop();
  const { data, loading, error } = useFetch(user ? `/orders/user/${user.id}` : null);

  useEffect(() => { loadCart(); }, [loadCart]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;

  const orders = (Array.isArray(data) ? data : data?.data || []).slice().reverse();
  if (!orders.length)
    return (
      <div className="center-box">
        <Empty text="You have no orders yet" />
        <Link className="btn" to="/products">Start shopping</Link>
      </div>
    );

  return (
    <>
      <h2>My Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="card order">
          <div className="row between wrap">
            <b>Order #{o.id}</b>
            <span className="muted">{new Date(o.createdAt).toLocaleDateString()}</span>
            <span className="pill">{o.paymentMethodType === "card" ? "Card" : "Cash"}</span>
            <span className={`pill ${o.isPaid ? "ok" : "warn"}`}>{o.isPaid ? "Paid" : "Not paid"}</span>
            <span className={`pill ${o.isDelivered ? "ok" : "warn"}`}>{o.isDelivered ? "Delivered" : "Processing"}</span>
            <b>{o.totalOrderPrice} EGP</b>
          </div>
          <div className="order-items">
            {o.cartItems.map((i) => (
              <div key={i._id} className="order-item">
                <img src={i.product.imageCover} alt={i.product.title} />
                <small>{i.product.title.split(" ").slice(0, 3).join(" ")}</small>
                <small className="muted">{i.count} × {i.price}</small>
              </div>
            ))}
          </div>
          {o.shippingAddress && (
            <small className="muted">Ship to: {o.shippingAddress.details}, {o.shippingAddress.city} — {o.shippingAddress.phone}</small>
          )}
        </div>
      ))}
    </>
  );
}
