import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { PagedProducts } from "../components/ProductCard";
import { SearchIcon } from "../components/Icons";

export default function Products() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ keyword: "", category: "", brand: "", sort: "" });
  const cats = useFetch("/categories");
  const brands = useFetch("/brands");

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const search = (e) => {
    e.preventDefault();
    setFilters({ ...filters, keyword: q.trim() });
  };

  const extra = {};
  if (filters.keyword) extra.keyword = filters.keyword;
  if (filters.category) extra["category[in]"] = filters.category;
  if (filters.brand) extra.brand = filters.brand;
  if (filters.sort) extra.sort = filters.sort;

  return (
    <>
      <h2>All Products</h2>
      <div className="filters">
        <form onSubmit={search} className="search">
          <input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn" aria-label="search"><SearchIcon /></button>
        </form>
        <select value={filters.category} onChange={set("category")}>
          <option value="">All categories</option>
          {cats.data?.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={filters.brand} onChange={set("brand")}>
          <option value="">All brands</option>
          {brands.data?.data.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select value={filters.sort} onChange={set("sort")}>
          <option value="">Sort by</option>
          <option value="price">Price: low to high</option>
          <option value="-price">Price: high to low</option>
          <option value="-ratingsAverage">Top rated</option>
          <option value="-sold">Best selling</option>
        </select>
      </div>
      <PagedProducts extra={extra} />
    </>
  );
}
