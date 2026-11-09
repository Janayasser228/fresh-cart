import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { PagedProducts } from "../components/ProductCard";
import { ErrorBox, Loader } from "../components/Loader";

export default function CategoryDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/categories/${id}`);
  const subs = useFetch(`/categories/${id}/subcategories`);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  const c = data.data;
  return (
    <>
      <div className="card hero-mini">
        <img src={c.image} alt={c.name} />
        <h1>{c.name}</h1>
      </div>

      {subs.data?.data.length > 0 && (
        <>
          <h3>Subcategories</h3>
          <div className="chips">
            {subs.data.data.map((s) => <span key={s._id} className="chip">{s.name}</span>)}
          </div>
        </>
      )}

      <h2>Products in {c.name}</h2>
      <PagedProducts extra={{ "category[in]": id }} />
    </>
  );
}
