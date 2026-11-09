import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { priceOf } from "../api";
import useFetch from "../hooks/useFetch";
import { HeartIcon, StarIcon } from "./Icons";
import { Empty, ErrorBox, Loader } from "./Loader";
import Pagination from "./Pagination";

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWished, busy } = useShop();
  const wished = isWished(product._id);

  return (
    <div className="card product-card">
      <button className={`heart ${wished ? "on" : ""}`} onClick={() => toggleWishlist(product._id)} aria-label="wishlist">
        <HeartIcon filled={wished} />
      </button>
      <Link to={`/products/${product._id}`}>
        <img src={product.imageCover} alt={product.title} loading="lazy" />
        <small className="muted">{product.category?.name}</small>
        <h4>{product.title.split(" ").slice(0, 3).join(" ")}</h4>
      </Link>
      <div className="row between">
        <div>
          {product.priceAfterDiscount ? (
            <>
              <b>{product.priceAfterDiscount} EGP</b> <s className="muted">{product.price}</s>
            </>
          ) : (
            <b>{product.price} EGP</b>
          )}
        </div>
        <span className="rating"><StarIcon width={14} height={14} /> {product.ratingsAverage}</span>
      </div>
      <button className="btn" disabled={busy === product._id} onClick={() => addToCart(product._id)}>
        {busy === product._id ? "Adding..." : "+ Add to cart"}
      </button>
    </div>
  );
}

export function ProductGrid({ products }) {
  if (!products?.length) return <Empty text="No products found" />;
  return (
    <div className="grid products">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

// قايمة منتجات بصفحات (Pagination) — بنستخدمها في Products و Brand و Category
export function PagedProducts({ extra = {} }) {
  const [page, setPage] = useState(1);
  const key = JSON.stringify(extra);
  useEffect(() => setPage(1), [key]);

  const { data, loading, error } = useFetch("/products", { page, limit: 12, ...extra });

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  return (
    <>
      <ProductGrid products={data.data} />
      <Pagination page={page} pages={data.metadata?.numberOfPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </>
  );
}

export { priceOf };
