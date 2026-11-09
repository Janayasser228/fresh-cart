import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { ProductGrid } from "../components/ProductCard";
import { ErrorBox, Loader } from "../components/Loader";
import { CartIcon } from "../components/Icons";

const slides = [
  { title: "Fresh Fruits & Vegetables", text: "Get up to 25% off on your first order", bg: "linear-gradient(120deg,#0aad0a,#7ed957)" },
  { title: "Daily Essentials", text: "Everything you need, delivered fast", bg: "linear-gradient(120deg,#ff8a00,#ffc371)" },
  { title: "Best Brands, Best Prices", text: "Shop top brands with free shipping", bg: "linear-gradient(120deg,#1e88e5,#64b5f6)" },
];

const features = [
  { t: "Free Delivery", d: "On orders over 500 EGP" },
  { t: "Secure Payment", d: "Cash or online by card" },
  { t: "Easy Returns", d: "Within 14 days" },
  { t: "24/7 Support", d: "We are here to help" },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, []);
  const s = slides[i];
  return (
    <section className="hero" style={{ background: s.bg }}>
      <div>
        <h1>{s.title}</h1>
        <p>{s.text}</p>
        <Link to="/products" className="btn light"><CartIcon /> Shop now</Link>
      </div>
      <div className="dots">
        {slides.map((_, n) => (
          <button key={n} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`slide ${n + 1}`} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const cats = useFetch("/categories");
  const brands = useFetch("/brands", { limit: 12 });
  const products = useFetch("/products", { limit: 12, sort: "-ratingsAverage" });

  return (
    <>
      <Hero />

      <section className="grid features">
        {features.map((f) => (
          <div key={f.t} className="card feature"><b>{f.t}</b><small className="muted">{f.d}</small></div>
        ))}
      </section>

      <section>
        <div className="row between"><h2>Shop Popular Categories</h2><Link to="/categories">View all</Link></div>
        {cats.loading ? <Loader /> : cats.error ? <ErrorBox message={cats.error} /> : (
          <div className="scroll-row">
            {cats.data.data.map((c) => (
              <Link key={c._id} to={`/categories/${c._id}`} className="card cat-tile">
                <img src={c.image} alt={c.name} />
                <b>{c.name}</b>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="row between"><h2>Top Rated Products</h2><Link to="/products">View all</Link></div>
        {products.loading ? <Loader /> : products.error ? <ErrorBox message={products.error} /> : <ProductGrid products={products.data.data} />}
      </section>

      <section>
        <div className="row between"><h2>Featured Brands</h2><Link to="/brands">View all</Link></div>
        {brands.loading ? <Loader /> : brands.error ? <ErrorBox message={brands.error} /> : (
          <div className="scroll-row">
            {brands.data.data.map((b) => (
              <Link key={b._id} to={`/brands/${b._id}`} className="card brand-tile">
                <img src={b.image} alt={b.name} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
