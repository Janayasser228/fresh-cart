import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useShop } from "../context/ShopContext";
import { ProductGrid } from "../components/ProductCard";
import { ErrorBox, Loader } from "../components/Loader";
import { HeartIcon, StarIcon } from "../components/Icons";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWished, busy } = useShop();
  const { data, loading, error } = useFetch(`/products/${id}`);
  const p = data?.data;
  const [img, setImg] = useState("");

  const related = useFetch(p ? "/products" : null, p ? { "category[in]": p.category._id, limit: 8 } : undefined);

  useEffect(() => {
    if (p) setImg(p.imageCover);
    window.scrollTo(0, 0);
  }, [p]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  if (!p) return null;

  const wished = isWished(p._id);
  const relatedList = related.data?.data.filter((x) => x._id !== p._id) || [];

  return (
    <>
      <div className="details">
        <div>
          <img className="main-img" src={img} alt={p.title} />
          <div className="thumbs">
            {[p.imageCover, ...(p.images || [])].map((src) => (
              <img key={src} src={src} alt="" className={src === img ? "on" : ""} onClick={() => setImg(src)} />
            ))}
          </div>
        </div>

        <div>
          <h1>{p.title}</h1>
          <p className="muted">{p.description}</p>
          <p>
            <Link to={`/categories/${p.category._id}`}>{p.category.name}</Link>
            {p.brand && <> · <Link to={`/brands/${p.brand._id}`}>{p.brand.name}</Link></>}
          </p>
          {p.subcategory?.length > 0 && <p className="muted">Sub: {p.subcategory.map((s) => s.name).join(", ")}</p>}
          <div className="row between">
            <h2>
              {p.priceAfterDiscount ? <>{p.priceAfterDiscount} EGP <s className="muted">{p.price}</s></> : <>{p.price} EGP</>}
            </h2>
            <span className="rating"><StarIcon /> {p.ratingsAverage} ({p.ratingsQuantity})</span>
          </div>
          <p className="muted">In stock: {p.quantity} · Sold: {p.sold}</p>
          <div className="row">
            <button className="btn" style={{ flex: 1 }} disabled={busy === p._id} onClick={() => addToCart(p._id)}>
              {busy === p._id ? "Adding..." : "+ Add to cart"}
            </button>
            <button className={`heart static ${wished ? "on" : ""}`} onClick={() => toggleWishlist(p._id)} aria-label="wishlist">
              <HeartIcon filled={wished} width={26} height={26} />
            </button>
          </div>
        </div>
      </div>

      {relatedList.length > 0 && (
        <section>
          <h2>Related products</h2>
          <ProductGrid products={relatedList} />
        </section>
      )}
    </>
  );
}
