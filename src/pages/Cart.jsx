import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Empty } from "../components/Loader";
import { TrashIcon } from "../components/Icons";

export default function Cart() {
  const { cart, busy, updateCount, removeFromCart, clearCart } = useShop();

  if (!cart.products.length)
    return (
      <div className="center-box">
        <Empty text="Your cart is empty" />
        <Link className="btn" to="/products">Start shopping</Link>
      </div>
    );

  return (
    <>
      <div className="row between">
        <h2>Shopping Cart ({cart.count})</h2>
        <button className="btn danger" onClick={clearCart}>Clear cart</button>
      </div>

      <div className="card">
        {cart.products.map((item) => (
          <div key={item._id} className="cart-row">
            <img src={item.product.imageCover} alt={item.product.title} />
            <div className="grow">
              <Link to={`/products/${item.product._id}`}><b>{item.product.title}</b></Link>
              <div className="muted">{item.price} EGP</div>
              <button className="link-btn danger-text" onClick={() => removeFromCart(item.product._id)}>
                <TrashIcon width={16} height={16} /> Remove
              </button>
            </div>
            <div className="qty">
              <button disabled={busy === item.product._id} onClick={() => updateCount(item.product._id, item.count - 1)}>−</button>
              <span>{item.count}</span>
              <button disabled={busy === item.product._id} onClick={() => updateCount(item.product._id, item.count + 1)}>+</button>
            </div>
            <b className="line-total">{item.price * item.count} EGP</b>
          </div>
        ))}
        <div className="row between total-row">
          <h3>Total: {cart.total} EGP</h3>
          <Link className="btn" to="/checkout">Proceed to checkout</Link>
        </div>
      </div>
    </>
  );
}
