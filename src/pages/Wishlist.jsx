import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Empty } from "../components/Loader";
import { TrashIcon } from "../components/Icons";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, busy } = useShop();

  if (!wishlist.length)
    return (
      <div className="center-box">
        <Empty text="Your wishlist is empty" />
        <Link className="btn" to="/products">Browse products</Link>
      </div>
    );

  return (
    <>
      <h2>My Wishlist ({wishlist.length})</h2>
      <div className="card">
        {wishlist.map((p) => (
          <div key={p._id} className="cart-row">
            <img src={p.imageCover} alt={p.title} />
            <div className="grow">
              <Link to={`/products/${p._id}`}><b>{p.title}</b></Link>
              <div className="muted">{p.priceAfterDiscount ?? p.price} EGP</div>
              <button className="link-btn danger-text" onClick={() => toggleWishlist(p._id)}>
                <TrashIcon width={16} height={16} /> Remove
              </button>
            </div>
            <button className="btn" disabled={busy === p._id} onClick={() => addToCart(p._id)}>
              {busy === p._id ? "Adding..." : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
