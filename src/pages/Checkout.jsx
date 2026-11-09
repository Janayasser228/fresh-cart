import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Field from "../components/Field";
import useForm from "../hooks/useForm";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";

export default function Checkout() {
  const { cart, loadCart } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("new");
  const [payment, setPayment] = useState("cash");
  const [save, setSave] = useState(false);

  const loadAddresses = () =>
    api.get("/addresses").then((r) => {
      setAddresses(r.data.data || []);
      if (r.data.data?.length) setSelected(r.data.data[0]._id);
    }).catch(() => {});

  useEffect(() => { loadAddresses(); }, []);

  const removeAddress = async (id) => {
    await api.delete(`/addresses/${id}`);
    toast("Address removed");
    setSelected("new");
    loadAddresses();
  };

  const useSaved = selected !== "new";

  const form = useForm(
    { details: "", phone: "", city: "" },
    (v) => {
      if (useSaved) return {}; 
      const e = {};
      if (v.details.trim().length < 5) e.details = "Enter your address details";
      if (!/^01[0125][0-9]{8}$/.test(v.phone)) e.phone = "Enter a valid Egyptian phone";
      if (v.city.trim().length < 2) e.city = "Enter your city";
      return e;
    },
    async (v) => {
      let shippingAddress;
      if (useSaved) {
        const a = addresses.find((x) => x._id === selected);
        shippingAddress = { details: a.details, phone: a.phone, city: a.city };
      } else {
        shippingAddress = { details: v.details, phone: v.phone, city: v.city };
        if (save) await api.post("/addresses", { name: v.city, ...shippingAddress });
      }

      if (payment === "cash") {
        await api.post(`/orders/${cart.cartId}`, { shippingAddress });
        await loadCart();
        toast("Order placed successfully 🎉");
        navigate("/orders");
      } else {
        const { data } = await api.post(
          `/orders/checkout-session/${cart.cartId}?url=${window.location.origin}`,
          { shippingAddress }
        );
        window.location.href = data.session.url; 
      }
    }
  );

  if (!cart.cartId || !cart.products.length)
    return (
      <div className="center-box">
        <p>Your cart is empty.</p>
        <Link className="btn" to="/products">Shop now</Link>
      </div>
    );

  return (
    <div className="checkout">
      <form className="card" onSubmit={form.submit} noValidate>
        <h2>Shipping address</h2>
        {form.apiError && <div className="alert error">{form.apiError}</div>}

        {addresses.map((a) => (
          <label key={a._id} className="radio">
            <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} />
            <span className="grow">{a.details} — {a.city} — {a.phone}</span>
            <button type="button" className="link-btn danger-text" onClick={() => removeAddress(a._id)}>Delete</button>
          </label>
        ))}
        <label className="radio">
          <input type="radio" checked={selected === "new"} onChange={() => setSelected("new")} />
          <span>Use a new address</span>
        </label>

        {!useSaved && (
          <>
            <Field form={form} name="details" label="Details" />
            <Field form={form} name="phone" label="Phone" type="tel" />
            <Field form={form} name="city" label="City" />
            <label className="radio">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
              <span>Save this address for next time</span>
            </label>
          </>
        )}

        <h2>Payment method</h2>
        <label className="radio">
          <input type="radio" checked={payment === "cash"} onChange={() => setPayment("cash")} />
          <span>Cash on delivery</span>
        </label>
        <label className="radio">
          <input type="radio" checked={payment === "online"} onChange={() => setPayment("online")} />
          <span>Online payment (card)</span>
        </label>

        <button className="btn" disabled={form.loading}>
          {form.loading ? "Processing..." : payment === "cash" ? "Place order" : "Pay online"}
        </button>
      </form>

      <aside className="card summary">
        <h3>Order summary</h3>
        {cart.products.map((i) => (
          <div key={i._id} className="row between">
            <span>{i.product.title.split(" ").slice(0, 3).join(" ")} × {i.count}</span>
            <b>{i.price * i.count}</b>
          </div>
        ))}
        <hr />
        <div className="row between"><b>Total</b><b>{cart.total} EGP</b></div>
      </aside>
    </div>
  );
}
